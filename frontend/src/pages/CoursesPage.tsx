import { useEffect, useState } from 'react'

type Course = { id: number; name: string }

function CoursesPage() {
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
    <section>
      <h1>My Courses</h1>
      {loading && <p>Loading…</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && (
        <ul>
          {courses.map((course) => (
            <li key={course.id}>{course.name}</li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default CoursesPage
