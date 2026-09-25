import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [studentId, setStudentId] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  // Lấy danh sách sinh viên từ Backend
  useEffect(() => {
    fetch('/api/students')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Không thể lấy dữ liệu sinh viên')
        }

        return response.json()
      })
      .then((data) => {
        setStudents(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  // Thêm sinh viên
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!studentId || !name || !email) {
      setError('Vui lòng nhập đầy đủ MSSV, Họ tên và Email')
      return
    }

    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId,
          name,
          email,
        }),
      })

      if (!response.ok) {
        throw new Error('Không thể thêm sinh viên')
      }

      const newStudent = await response.json()

      // Cập nhật danh sách trên giao diện
      setStudents([...students, newStudent])

      // Xóa dữ liệu trong form
      setStudentId('')
      setName('')
      setEmail('')
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial' }}>
      <h1>Danh sách sinh viên</h1>

      {/* Form thêm sinh viên */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
        <h2>Thêm sinh viên</h2>

        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="MSSV"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Họ tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button type="submit">
          Thêm sinh viên
        </button>
      </form>

      {loading && <p>Đang tải dữ liệu...</p>}

      {error && (
        <p style={{ color: 'red' }}>
          {error}
        </p>
      )}

      {/* Danh sách sinh viên */}
      {!loading && (
        <table
          border="1"
          cellPadding="10"
          style={{
            borderCollapse: 'collapse',
            width: '100%',
          }}
        >
          <thead>
            <tr>
              <th>MSSV</th>
              <th>Họ tên</th>
              <th>Email</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>{student.studentId}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default App