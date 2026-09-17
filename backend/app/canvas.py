from datetime import datetime, timedelta, timezone

import httpx

from app.config import get_settings
from app.richtext import blocks_to_text, html_to_blocks


def _get(path: str, **params) -> list[dict]:
    settings = get_settings()
    response = httpx.get(
        f"{settings.canvas_base_url}api/v1/{path}",
        headers={"Authorization": f"Bearer {settings.canvas_api_token.get_secret_value()}"},
        params={"per_page": 100, **params},
        timeout=10,
    )
    response.raise_for_status()
    return response.json()


def _courses() -> dict[int, str]:
    # Courses restricted by date come back without a name; skip them.
    return {
        c["id"]: c["name"]
        for c in _get("courses", enrollment_state="active")
        if "name" in c
    }


def get_course_names() -> list[dict]:
    return [{"id": id, "name": name} for id, name in _courses().items()]


def get_assignments() -> list[dict]:
    """Assignments across active courses: due from a week ago onward, or undated.
    Ordered by due date, undated after dated, done ones last."""
    cutoff = (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()
    result = []
    for course_id, course_name in _courses().items():
        for a in _get(f"courses/{course_id}/assignments", **{"include[]": "submission"}):
            if a.get("due_at") is None or a["due_at"] >= cutoff:
                submission = a.get("submission") or {}
                result.append(
                    {
                        "id": a["id"],
                        "course": course_name,
                        "title": a["name"],
                        "due_at": a["due_at"],
                        "points": a.get("points_possible") or 0,
                        "done": submission.get("workflow_state") in ("submitted", "graded", "pending_review")
                        or bool(submission.get("excused")),
                    }
                )
    return sorted(result, key=lambda a: (a["done"], a["due_at"] is None, a["due_at"] or ""))


def _excerpt(text: str, limit: int = 180) -> str:
    return text if len(text) <= limit else text[: limit - 1].rstrip() + "…"


def get_announcements() -> list[dict]:
    """Announcements across active courses from the last 30 days, newest first."""
    courses = _courses()
    today = datetime.now(timezone.utc).date()
    items = _get(
        "announcements",
        **{"context_codes[]": [f"course_{id}" for id in courses]},
        # Canvas caps end_date at start_date + 28 days unless given explicitly
        start_date=(today - timedelta(days=30)).isoformat(),
        end_date=(today + timedelta(days=1)).isoformat(),
    )
    result = []
    for a in items:
        body = html_to_blocks(a.get("message") or "")
        result.append(
            {
                "id": a["id"],
                "course": courses[int(a["context_code"].removeprefix("course_"))],
                "title": a["title"],
                "posted_at": a["posted_at"],
                "author": a.get("user_name"),
                "url": a["html_url"],
                "excerpt": _excerpt(blocks_to_text(body)),
                "body": body,
            }
        )
    return sorted(result, key=lambda a: a["posted_at"], reverse=True)
