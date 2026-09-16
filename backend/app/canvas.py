import httpx

from app.config import get_settings


def get_course_names() -> list[dict]:
    settings = get_settings()
    response = httpx.get(
        f"{settings.canvas_base_url}api/v1/courses",
        headers={"Authorization": f"Bearer {settings.canvas_api_token.get_secret_value()}"},
        params={"enrollment_state": "active", "per_page": 100},
        timeout=10,
    )
    response.raise_for_status()
    # Courses restricted by date come back without a name; skip them.
    return [{"id": c["id"], "name": c["name"]} for c in response.json() if "name" in c]
