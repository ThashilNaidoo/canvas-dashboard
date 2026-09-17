from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.canvas import get_announcements, get_assignments, get_course_names

app = FastAPI(title="Coursework Dashboard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health():
    return {"status": "online"}


@app.get("/api/courses")
def courses():
    return get_course_names()


@app.get("/api/assignments")
def assignments():
    return get_assignments()


@app.get("/api/announcements")
def announcements():
    return get_announcements()
