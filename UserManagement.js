import React, {useEffect, useState} from 'react'
import axios from 'axios'
import './index.css'

const API_URL = 'https://jsonplaceholder.typicode.com/users'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    department: '',
  })
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL)
      console.log('Fetch users response:', response)
      setUsers(response.data)
    } catch (error) {
      console.error('Error fetching users', error)
      alert(`Error fetching users: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleDelete = async id => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this user?',
    )
    if (confirmDelete) {
      try {
        await axios.delete(`${API_URL}/${id}`)
        setUsers(users.filter(user => user.id !== id))
        alert('User deleted successfully!')
      } catch (error) {
        console.error('Error deleting user', error)
        alert(`Error deleting user: ${error.message}`)
      }
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (editing) {
      try {
        await axios.put(`${API_URL}/${formData.id}`, formData)
        setUsers(users.map(user => (user.id === formData.id ? formData : user)))
        alert('User updated successfully!')
      } catch (error) {
        console.error('Error updating user', error)
        alert(`Error updating user: ${error.message}`)
      }
    } else {
      try {
        const response = await axios.post(API_URL, formData)
        console.log('Add user response:', response)
        const newUser = {...response.data, id: users.length + 1} // Mock ID
        setUsers([...users, newUser])
        alert('User added successfully!')
      } catch (error) {
        console.error('Error adding user', error)
        alert(`Error adding user: ${error.message}`)
      }
    }
    setFormData({id: '', name: '', email: '', department: ''})
    setEditing(false)
  }

  const handleEdit = user => {
    setFormData(user)
    setEditing(true)
  }

  return (
    <div className="container">
      <h2>User Management</h2>
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <>
          <form className="form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Department"
              value={formData.department}
              onChange={e =>
                setFormData({...formData, department: e.target.value})
              }
              required
            />
            <button type="submit">{editing ? 'Update' : 'Add'} User</button>
          </form>
          <ul className="user-list">
            {users.map(user => (
              <li key={user.id} className="user-item">
                <div className="user-info">
                  <span>{user.name}</span>
                  <span>{user.email}</span>
                  <span>{user.department}</span>
                </div>
                <div className="button-group">
                  <button className="edit-btn" onClick={() => handleEdit(user)}>
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export default UserManagement
