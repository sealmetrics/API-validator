from app.models import EndpointInfo, EndpointCategory, DateRange, ReportType, TimeUnit, FunnelReportType


class EndpointsRegistry:
    """Registry of all available Sealmetrics API endpoints for validation."""

    @staticmethod
    def get_all_endpoints() -> list[EndpointInfo]:
        return [
            # Authentication
            EndpointInfo(
                id="auth_accounts",
                name="Get Accounts",
                description="Retrieves all accounts accessible with the provided API token",
                method="GET",
                path="/auth/accounts",
                category=EndpointCategory.AUTHENTICATION,
                parameters=[],
            ),
            # Reports
            EndpointInfo(
                id="report_acquisition",
                name="Traffic / Acquisition",
                description="Get traffic and acquisition data by source, medium, campaign, or term",
                method="GET",
                path="/report/acquisition",
                category=EndpointCategory.REPORTS,
                parameters=[
                    {
                        "name": "account_id",
                        "type": "string",
                        "required": True,
                        "description": "Account ID",
                    },
                    {
                        "name": "date_range",
                        "type": "enum",
                        "required": True,
                        "description": "Date range for the report",
                        "options": [e.value for e in DateRange],
                        "default": "last_30_days",
                    },
                    {
                        "name": "report_type",
                        "type": "enum",
                        "required": False,
                        "description": "Group data by source, medium, campaign, or term",
                        "options": [e.value for e in ReportType],
                        "default": "Source",
                    },
                    {
                        "name": "utm_source",
                        "type": "string",
                        "required": False,
                        "description": "Filter by UTM source",
                    },
                    {
                        "name": "utm_medium",
                        "type": "string",
                        "required": False,
                        "description": "Filter by UTM medium",
                    },
                    {
                        "name": "utm_campaign",
                        "type": "string",
                        "required": False,
                        "description": "Filter by UTM campaign",
                    },
                    {
                        "name": "limit",
                        "type": "integer",
                        "required": False,
                        "description": "Max results to return",
                        "default": 100,
                    },
                ],
            ),
            EndpointInfo(
                id="report_conversions",
                name="Conversions",
                description="Get conversion and sales data",
                method="GET",
                path="/report/conversions",
                category=EndpointCategory.REPORTS,
                parameters=[
                    {
                        "name": "account_id",
                        "type": "string",
                        "required": True,
                        "description": "Account ID",
                    },
                    {
                        "name": "date_range",
                        "type": "enum",
                        "required": True,
                        "description": "Date range for the report",
                        "options": [e.value for e in DateRange],
                        "default": "last_30_days",
                    },
                    {
                        "name": "utm_source",
                        "type": "string",
                        "required": False,
                        "description": "Filter by UTM source",
                    },
                    {
                        "name": "utm_medium",
                        "type": "string",
                        "required": False,
                        "description": "Filter by UTM medium",
                    },
                    {
                        "name": "utm_campaign",
                        "type": "string",
                        "required": False,
                        "description": "Filter by UTM campaign",
                    },
                    {
                        "name": "limit",
                        "type": "integer",
                        "required": False,
                        "description": "Max results to return",
                        "default": 100,
                    },
                ],
            ),
            EndpointInfo(
                id="report_microconversions",
                name="Microconversions",
                description="Get microconversion events (add-to-cart, signups, etc.)",
                method="GET",
                path="/report/microconversions",
                category=EndpointCategory.REPORTS,
                parameters=[
                    {
                        "name": "account_id",
                        "type": "string",
                        "required": True,
                        "description": "Account ID",
                    },
                    {
                        "name": "date_range",
                        "type": "enum",
                        "required": True,
                        "description": "Date range for the report",
                        "options": [e.value for e in DateRange],
                        "default": "last_30_days",
                    },
                    {
                        "name": "label",
                        "type": "string",
                        "required": False,
                        "description": "Filter by microconversion label",
                    },
                    {
                        "name": "limit",
                        "type": "integer",
                        "required": False,
                        "description": "Max results to return",
                        "default": 100,
                    },
                ],
            ),
            EndpointInfo(
                id="report_pages",
                name="Pages Performance",
                description="Get page-level performance metrics",
                method="GET",
                path="/report/pages",
                category=EndpointCategory.REPORTS,
                parameters=[
                    {
                        "name": "account_id",
                        "type": "string",
                        "required": True,
                        "description": "Account ID",
                    },
                    {
                        "name": "date_range",
                        "type": "enum",
                        "required": True,
                        "description": "Date range for the report",
                        "options": [e.value for e in DateRange],
                        "default": "last_30_days",
                    },
                    {
                        "name": "content_grouping",
                        "type": "string",
                        "required": False,
                        "description": "Group pages by content category",
                    },
                    {
                        "name": "show_utms",
                        "type": "boolean",
                        "required": False,
                        "description": "Include UTM parameters in results",
                        "default": False,
                    },
                    {
                        "name": "limit",
                        "type": "integer",
                        "required": False,
                        "description": "Max results to return",
                        "default": 100,
                    },
                ],
            ),
            EndpointInfo(
                id="report_funnel",
                name="Funnel Analysis",
                description="Get conversion funnel data",
                method="GET",
                path="/report/funnel",
                category=EndpointCategory.REPORTS,
                parameters=[
                    {
                        "name": "account_id",
                        "type": "string",
                        "required": True,
                        "description": "Account ID",
                    },
                    {
                        "name": "date_range",
                        "type": "enum",
                        "required": True,
                        "description": "Date range for the report",
                        "options": [e.value for e in DateRange],
                        "default": "last_30_days",
                    },
                    {
                        "name": "report_type",
                        "type": "enum",
                        "required": False,
                        "description": "Group funnel data by dimension",
                        "options": [e.value for e in FunnelReportType],
                        "default": "by_source",
                    },
                ],
            ),
            EndpointInfo(
                id="report_roas_evolution",
                name="ROAS Evolution",
                description="Get ROAS (Return on Ad Spend) over time",
                method="GET",
                path="/report/roas-evolution",
                category=EndpointCategory.REPORTS,
                parameters=[
                    {
                        "name": "account_id",
                        "type": "string",
                        "required": True,
                        "description": "Account ID",
                    },
                    {
                        "name": "date_range",
                        "type": "enum",
                        "required": True,
                        "description": "Date range for the report",
                        "options": [e.value for e in DateRange],
                        "default": "last_30_days",
                    },
                    {
                        "name": "time_unit",
                        "type": "enum",
                        "required": False,
                        "description": "Time granularity",
                        "options": [e.value for e in TimeUnit],
                        "default": "daily",
                    },
                ],
            ),
        ]

    @staticmethod
    def get_endpoint_by_id(endpoint_id: str) -> EndpointInfo | None:
        for endpoint in EndpointsRegistry.get_all_endpoints():
            if endpoint.id == endpoint_id:
                return endpoint
        return None

    @staticmethod
    def get_endpoints_by_category(category: EndpointCategory) -> list[EndpointInfo]:
        return [e for e in EndpointsRegistry.get_all_endpoints() if e.category == category]

    @staticmethod
    def get_health_check_endpoints() -> list[str]:
        """Returns endpoint IDs used for quick health check."""
        return [e.id for e in EndpointsRegistry.get_all_endpoints()]
