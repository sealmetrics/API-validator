import httpx
import time
from datetime import datetime
from typing import Any

from app.config import get_settings
from app.models import ValidationResult, EndpointInfo
from app.services.endpoints_registry import EndpointsRegistry


class SealmetricsClient:
    """Client for making validated requests to the Sealmetrics API."""

    def __init__(self, api_token: str):
        self.api_token = api_token
        self.settings = get_settings()
        self.base_url = self.settings.sealmetrics_api_base
        self.headers = {
            "Authorization": f"Bearer {api_token}",
            "Accept": "application/json",
            "Connection": "keep-alive",
            "Accept-Encoding": "gzip, deflate, br",
        }

    async def validate_token(self) -> tuple[bool, list[dict], str | None]:
        """
        Validates the API token by calling /auth/accounts.
        Returns: (is_valid, accounts_list, error_message)
        """
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.base_url}/auth/accounts",
                    headers=self.headers,
                    timeout=30.0,
                )

                if response.status_code == 200:
                    data = response.json()
                    # Handle different response formats
                    if isinstance(data, dict):
                        # Check if it's a {data: [...]} response
                        if "data" in data and isinstance(data["data"], list):
                            accounts = data["data"]
                        # Check if it's a {id: name, id: name, ...} format
                        elif all(isinstance(k, str) and isinstance(v, str) for k, v in data.items()):
                            accounts = [{"id": k, "name": v} for k, v in data.items()]
                        else:
                            accounts = [data]
                    elif isinstance(data, list):
                        accounts = data
                    else:
                        accounts = []
                    return True, accounts, None
                elif response.status_code == 401:
                    return False, [], "Invalid API token"
                else:
                    return False, [], f"API error: {response.status_code}"

            except httpx.TimeoutException:
                return False, [], "Request timeout"
            except Exception as e:
                return False, [], str(e)

    async def validate_endpoint(
        self, endpoint_id: str, parameters: dict
    ) -> ValidationResult:
        """
        Validates a specific endpoint with given parameters.
        Returns detailed validation result.
        """
        endpoint = EndpointsRegistry.get_endpoint_by_id(endpoint_id)
        if not endpoint:
            return ValidationResult(
                endpoint_id=endpoint_id,
                endpoint_name="Unknown",
                success=False,
                status_code=0,
                response_time_ms=0,
                timestamp=datetime.utcnow(),
                request_url="",
                request_params=parameters,
                error_message=f"Unknown endpoint: {endpoint_id}",
            )

        # Build request URL
        url = f"{self.base_url}{endpoint.path}"

        # Filter out empty parameters
        clean_params = {k: v for k, v in parameters.items() if v is not None and v != ""}

        start_time = time.perf_counter()

        async with httpx.AsyncClient() as client:
            try:
                if endpoint.method == "GET":
                    response = await client.get(
                        url,
                        headers=self.headers,
                        params=clean_params,
                        timeout=60.0,
                    )
                else:  # POST
                    response = await client.post(
                        url,
                        headers=self.headers,
                        json=clean_params,
                        timeout=60.0,
                    )

                elapsed_ms = (time.perf_counter() - start_time) * 1000

                # Parse response
                try:
                    response_data = response.json()
                except Exception:
                    response_data = response.text

                # Count data items if applicable
                data_count = None
                if isinstance(response_data, dict):
                    if "data" in response_data and isinstance(response_data["data"], list):
                        data_count = len(response_data["data"])
                    elif "items" in response_data and isinstance(response_data["items"], list):
                        data_count = len(response_data["items"])
                elif isinstance(response_data, list):
                    data_count = len(response_data)

                # Determine success
                success = 200 <= response.status_code < 300

                # Build full URL with params for display
                request_url = str(response.request.url)

                return ValidationResult(
                    endpoint_id=endpoint_id,
                    endpoint_name=endpoint.name,
                    success=success,
                    status_code=response.status_code,
                    response_time_ms=round(elapsed_ms, 2),
                    timestamp=datetime.utcnow(),
                    request_url=request_url,
                    request_params=clean_params,
                    response_data=response_data,
                    data_count=data_count,
                    error_message=None if success else self._extract_error(response_data),
                )

            except httpx.TimeoutException:
                elapsed_ms = (time.perf_counter() - start_time) * 1000
                return ValidationResult(
                    endpoint_id=endpoint_id,
                    endpoint_name=endpoint.name,
                    success=False,
                    status_code=0,
                    response_time_ms=round(elapsed_ms, 2),
                    timestamp=datetime.utcnow(),
                    request_url=url,
                    request_params=clean_params,
                    error_message="Request timeout (60s)",
                )
            except Exception as e:
                elapsed_ms = (time.perf_counter() - start_time) * 1000
                return ValidationResult(
                    endpoint_id=endpoint_id,
                    endpoint_name=endpoint.name,
                    success=False,
                    status_code=0,
                    response_time_ms=round(elapsed_ms, 2),
                    timestamp=datetime.utcnow(),
                    request_url=url,
                    request_params=clean_params,
                    error_message=str(e),
                )

    def _extract_error(self, response_data: Any) -> str | None:
        """Extract error message from API response."""
        if isinstance(response_data, dict):
            if "error" in response_data:
                return str(response_data["error"])
            if "message" in response_data:
                return str(response_data["message"])
            if "detail" in response_data:
                return str(response_data["detail"])
        return None
