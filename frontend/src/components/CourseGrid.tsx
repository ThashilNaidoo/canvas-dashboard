import type { Course } from '../lib/api'
import { pad } from '../lib/format'
import './CourseGrid.css'

type Props = { courses: Course[] | null }

function CourseGrid({ courses }: Props) {
  if (courses === null) {
    return (
      <ol className="course-grid">
        {[0, 1, 2, 3].map((i) => (
          <li key={i} className="course-card course-card-skeleton" aria-hidden="true">
            <span className="course-tag">File {pad(i + 1)}</span>
            <span className="skeleton-line" />
          </li>
        ))}
      </ol>
    )
  }

  if (courses.length === 0) {
    return (
      <div className="panel">
        <p className="label">All clear</p>
        <p>No active courses found for this term.</p>
      </div>
    )
  }

  return (
    <ol className="course-grid">
      {courses.map((course, i) => (
        <li key={course.id} className="course-card">
          <span className="course-tag">File {pad(i + 1)}</span>
          <span className="course-orb" aria-hidden="true" />
          <span className="course-name">{course.name}</span>
          <span className="course-status">
            <span className="course-status-dot" aria-hidden="true" />
            Active
          </span>
          <span className="course-watermark" aria-hidden="true">
            {pad(i + 1)}
          </span>
          <span className="course-sweep" aria-hidden="true" />
        </li>
      ))}
    </ol>
  )
}

export default CourseGrid
