from pydantic import BaseModel, Field
from typing import Any, Optional
from datetime import datetime
from enum import Enum


class DateRange(str, Enum):
    TODAY = "today"
    YESTERDAY = "yesterday"
    LAST_7_DAYS = "last_7_days"
    LAST_14_DAYS = "last_14_days"
    LAST_30_DAYS = "last_30_days"
    LAST_60_DAYS = "last_60_days"
    LAST_90_DAYS = "last_90_days"
    THIS_MONTH = "this_month"
    LAST_MONTH = "last_month"
    THIS_WEEK_MON_SUN = "this_week_monday_sunday"
    THIS_WEEK_SUN_SAT = "this_week_sunday_saturday"
    THIS_YEAR = "this_year"
    LAST_YEAR = "last_year"


class ReportType(str, Enum):
    SOURCE = "Source"
    MEDIUM = "Medium"
    CAMPAIGN = "Campaign"
    TERM = "Term"


class TimeUnit(str, Enum):
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"


class FunnelReportType(str, Enum):
    BY_SOURCE = "by_source"
    BY_MEDIUM = "by_medium"
    BY_CAMPAIGN = "by_campaign"
    BY_LANDING = "by_landing"


class EndpointCategory(str, Enum):
    AUTHENTICATION = "authentication"
    REPORTS = "reports"
    EVENTS = "events"


class ValidateTokenRequest(BaseModel):
    api_token: str = Field(..., description="Sealmetrics API token")


class ValidateTokenResponse(BaseModel):
    valid: bool
    accounts: list[dict] = []
    error: Optional[str] = None


class EndpointInfo(BaseModel):
    id: str
    name: str
    description: str
    method: str
    path: str
    category: EndpointCategory
    parameters: list[dict] = []


class ValidationRequest(BaseModel):
    api_token: str = Field(..., description="Sealmetrics API token")
    endpoint_id: str = Field(..., description="ID del endpoint a validar")
    parameters: dict = Field(default_factory=dict, description="Parámetros para el endpoint")


class ValidationResult(BaseModel):
    endpoint_id: str
    endpoint_name: str
    success: bool
    status_code: int
    response_time_ms: float
    timestamp: datetime
    request_url: str
    request_params: dict
    response_data: Optional[Any] = None
    error_message: Optional[str] = None
    data_count: Optional[int] = None
    latest_data_date: Optional[str] = None


class HealthCheckRequest(BaseModel):
    api_token: str = Field(..., description="Sealmetrics API token")
    account_id: str = Field(..., description="Account ID para las pruebas")


class HealthCheckResult(BaseModel):
    overall_status: str  # "healthy", "degraded", "unhealthy"
    total_endpoints: int
    successful: int
    failed: int
    total_time_ms: float
    timestamp: datetime
    results: list[ValidationResult]
