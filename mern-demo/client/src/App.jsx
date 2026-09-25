import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [studentId, setStudentId] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const [editingId, setEditingId] = useState(null)

  // Lấy danh sách sinh viên từ Backend
  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students')

      if (!response.ok) {
        throw new Error('Không thể lấy dữ liệu sinh viên')
      }

      const data = await response.json()
      setStudents(data)
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  // Thêm hoặc cập nhật sinh viên
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!studentId || !name || !email) {
      setError('Vui lòng nhập đầy đủ MSSV, Họ tên và Email')
      return
    }

    try {
      if (editingId) {
        // Cập nhật sinh viên
        const response = await fetch(`/api/students/${editingId}`, {
          method: 'PUT',
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
          throw new Error('Không thể cập nhật sinh viên')
        }

        const updatedStudent = await response.json()

        setStudents(
          students.map((student) =>
            student._id === editingId ? updatedStudent : student
          )
        )

        setEditingId(null)
      } else {
        // Thêm sinh viên
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

        setStudents([...students, newStudent])
      }

      setStudentId('')
      setName('')
      setEmail('')
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  // Chọn sinh viên để sửa
  const handleEdit = (student) => {
    setEditingId(student._id)
    setStudentId(student.studentId)
    setName(student.name)
    setEmail(student.email)
    setError('')
  }

  // Xóa sinh viên
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Bạn có chắc muốn xóa sinh viên này không?'
    )

    if (!confirmed) {
      return
    }

    try {
      const response = await fetch(`/api/students/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Không thể xóa sinh viên')
      }

      setStudents(
        students.filter((student) => student._id !== id)
      )

      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  // Hủy sửa
  const handleCancel = () => {
    setEditingId(null)
    setStudentId('')
    setName('')
    setEmail('')
    setError('')
  }

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial' }}>
      <h1>Danh sách sinh viên</h1>

      {/* Form thêm / sửa sinh viên */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
        <h2>{editingId ? 'Cập nhật sinh viên' : 'Thêm sinh viên'}</h2>

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
          {editingId ? 'Cập nhật' : 'Thêm sinh viên'}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={handleCancel}
            style={{ marginLeft: '10px' }}
          >
            Hủy
          </button>
        )}
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
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>{student.studentId}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>

                <td>
                  <button onClick={() => handleEdit(student)}>
                    Sửa
                  </button>

                  <button
                    onClick={() => handleDelete(student._id)}
                    style={{ marginLeft: '10px' }}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default App