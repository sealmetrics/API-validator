from fastapi import APIRouter, HTTPException
from datetime import datetime
import time
import asyncio

from app.models import (
    ValidateTokenRequest,
    ValidateTokenResponse,
    ValidationRequest,
    ValidationResult,
    HealthCheckRequest,
    HealthCheckResult,
)
from app.services import SealmetricsClient, EndpointsRegistry

router = APIRouter(prefix="/validate", tags=["Validator"])


@router.post("/token", response_model=ValidateTokenResponse)
async def validate_token(request: ValidateTokenRequest):
    """
    Validate an API token and return available accounts.
    This is the first step before using other validation endpoints.
    """
    client = SealmetricsClient(request.api_token)
    is_valid, accounts, error = await client.validate_token()

    return ValidateTokenResponse(
        valid=is_valid,
        accounts=accounts,
        error=error,
    )


@router.post("/endpoint", response_model=ValidationResult)
async def validate_endpoint(request: ValidationRequest):
    """
    Validate a specific API endpoint with given parameters.
    Returns detailed information about the request and response.
    """
    # Verify endpoint exists
    endpoint = EndpointsRegistry.get_endpoint_by_id(request.endpoint_id)
    if not endpoint:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown endpoint: {request.endpoint_id}",
        )

    client = SealmetricsClient(request.api_token)
    result = await client.validate_endpoint(request.endpoint_id, request.parameters)

    return result


@router.post("/health-check", response_model=HealthCheckResult)
async def health_check(request: HealthCheckRequest):
    """
    Run a quick health check on core API endpoints.
    Tests authentication, traffic, and conversions endpoints.
    """
    client = SealmetricsClient(request.api_token)

    # First validate token
    is_valid, _, error = await client.validate_token()
    if not is_valid:
        raise HTTPException(status_code=401, detail=error or "Invalid API token")

    # Get health check endpoints
    endpoint_ids = EndpointsRegistry.get_health_check_endpoints()

    start_time = time.perf_counter()
    results: list[ValidationResult] = []

    # Run validations
    for endpoint_id in endpoint_ids:
        # Build parameters based on endpoint
        params = {}
        if endpoint_id != "auth_accounts":
            params = {
                "account_id": request.account_id,
                "date_range": "today",
                "limit": 10,
            }
            # Add report_type for endpoints that require it
            if endpoint_id == "report_acquisition":
                params["report_type"] = "Source"
            elif endpoint_id == "report_funnel":
                params["report_type"] = "by_source"

        result = await client.validate_endpoint(endpoint_id, params)
        results.append(result)

    total_time = (time.perf_counter() - start_time) * 1000

    # Calculate overall status
    successful = sum(1 for r in results if r.success)
    failed = len(results) - successful

    if failed == 0:
        status = "healthy"
    elif successful > 0:
        status = "degraded"
    else:
        status = "unhealthy"

    return HealthCheckResult(
        overall_status=status,
        total_endpoints=len(results),
        successful=successful,
        failed=failed,
        total_time_ms=round(total_time, 2),
        timestamp=datetime.utcnow(),
        results=results,
    )


@router.post("/batch", response_model=list[ValidationResult])
async def validate_batch(
    api_token: str,
    endpoint_ids: list[str],
    account_id: str,
    date_range: str = "today",
):
    """
    Validate multiple endpoints in parallel.
    Useful for comprehensive API testing.
    """
    client = SealmetricsClient(api_token)

    # Validate token first
    is_valid, _, error = await client.validate_token()
    if not is_valid:
        raise HTTPException(status_code=401, detail=error or "Invalid API token")

    # Create validation tasks
    async def validate_one(endpoint_id: str) -> ValidationResult:
        params = {}
        if endpoint_id != "auth_accounts":
            params = {
                "account_id": account_id,
                "date_range": date_range,
                "limit": 10,
            }
        return await client.validate_endpoint(endpoint_id, params)

    # Run all validations in parallel
    results = await asyncio.gather(*[validate_one(eid) for eid in endpoint_ids])

    return list(results)
