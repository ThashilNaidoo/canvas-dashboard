import AnnouncementFeed from '../components/AnnouncementFeed'
import AssignmentList from '../components/AssignmentList'
import CourseGrid from '../components/CourseGrid'
import SyncMark from '../components/SyncMark'
import { fetchAnnouncements, fetchAssignments, fetchCourses } from '../lib/api'
import { pad } from '../lib/format'
import { useFetch } from '../lib/useFetch'
import './HomePage.css'

function ErrorPanel({ what, error }: { what: string; error: string }) {
  return (
    <div className="panel panel-error" role="alert">
      <p className="label">Signal lost</p>
      <p>
        Couldn't reach the {what} feed. {error}
      </p>
    </div>
  )
}

function HomePage() {
  const courses = useFetch(fetchCourses)
  const assignments = useFetch(fetchAssignments)
  const announcements = useFetch(fetchAnnouncements)

  const syncing = courses.loading || assignments.loading || announcements.loading
  const sync = () => {
    if (syncing) return
    courses.refetch()
    assignments.refetch()
    announcements.refetch()
  }

  return (
    <div className="page">
      <header className="topbar">
        <button
          className={`brand ${syncing ? 'syncing' : ''}`}
          onClick={sync}
          aria-label="Sync with Canvas"
          aria-busy={syncing}
        >
          <SyncMark size={40} />
          Sync
        </button>
      </header>

      <div className="split">
        <section className="section" aria-busy={assignments.loading}>
          <h2 className="label section-label">
            Assignments
            {assignments.data && <span className="section-count">{pad(assignments.data.length)}</span>}
          </h2>
          {assignments.error && <ErrorPanel what="assignment" error={assignments.error} />}
          {!assignments.error && <AssignmentList assignments={assignments.data} />}
        </section>

        <section className="section" aria-busy={announcements.loading}>
          <h2 className="label section-label">
            Announcements
            {announcements.data && (
              <span className="section-count">{pad(announcements.data.length)}</span>
            )}
          </h2>
          {announcements.error && <ErrorPanel what="announcement" error={announcements.error} />}
          {!announcements.error && <AnnouncementFeed announcements={announcements.data} />}
        </section>
      </div>

      <section className="section" aria-busy={courses.loading}>
        <h2 className="label section-label">Courses</h2>
        {courses.error && <ErrorPanel what="course" error={courses.error} />}
        {!courses.error && <CourseGrid courses={courses.data} />}
      </section>

      <footer className="footer label">
        <span>Source · Canvas LMS</span>
        <span>Dashboard v0.1</span>
      </footer>
    </div>
  )
}

export default HomePage
