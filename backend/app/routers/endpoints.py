from fastapi import APIRouter

from app.models import EndpointInfo, EndpointCategory
from app.services import EndpointsRegistry

router = APIRouter(prefix="/endpoints", tags=["Endpoints"])


@router.get("", response_model=list[EndpointInfo])
async def list_endpoints():
    """Get all available API endpoints for validation."""
    return EndpointsRegistry.get_all_endpoints()


@router.get("/categories")
async def list_categories():
    """Get all endpoint categories."""
    return [{"id": c.value, "name": c.value.title()} for c in EndpointCategory]


@router.get("/category/{category}", response_model=list[EndpointInfo])
async def get_endpoints_by_category(category: EndpointCategory):
    """Get endpoints filtered by category."""
    return EndpointsRegistry.get_endpoints_by_category(category)


@router.get("/{endpoint_id}", response_model=EndpointInfo | None)
async def get_endpoint(endpoint_id: str):
    """Get details for a specific endpoint."""
    return EndpointsRegistry.get_endpoint_by_id(endpoint_id)


@router.get("/health-check/endpoints")
async def get_health_check_endpoints():
    """Get list of endpoints used in health check."""
    endpoint_ids = EndpointsRegistry.get_health_check_endpoints()
    return [EndpointsRegistry.get_endpoint_by_id(eid) for eid in endpoint_ids]
