import { useEffect, useState } from 'react'
import AnnouncementFeed from '../components/AnnouncementFeed'
import AssignmentList from '../components/AssignmentList'
import CourseGrid, { type Course } from '../components/CourseGrid'
import SyncMark from '../components/SyncMark'
import { pad } from '../lib/format'
import { announcements, assignments } from '../mock/data'
import './HomePage.css'

function HomePage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/courses')
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`)
        return res.json() as Promise<Course[]>
      })
      .then(setCourses)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page">
      <header className="topbar">
        <span className="brand">
          <SyncMark size={30} />
          Sync
        </span>
      </header>

      <div className="split">
        <section className="section">
          <h2 className="label section-label">
            Assignments
            <span className="section-count">{pad(assignments.length)}</span>
          </h2>
          <AssignmentList assignments={assignments} />
        </section>

        <section className="section">
          <h2 className="label section-label">
            Announcements
            <span className="section-count">{pad(announcements.length)}</span>
          </h2>
          <AnnouncementFeed announcements={announcements} />
        </section>
      </div>

      <section className="section" aria-busy={loading} aria-live="polite">
        <h2 className="label section-label">Courses</h2>
        <CourseGrid courses={courses} loading={loading} error={error} />
      </section>

      <footer className="footer label">
        <span>Source · Canvas LMS</span>
        <span>Dashboard v0.1</span>
      </footer>
    </div>
  )
}

export default HomePage
