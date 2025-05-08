import { useState, useEffect } from 'react';
import Navbar from "../../components/Navbar/Navbar";
import instance from '../../Service/AxiosHolder/AxiosHolder.jsx';
import Swal from 'sweetalert2';

export default function User() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem('authToken');

  // Fetch users
  function getUserData() {
    setLoading(true);
    setError(null);
    
    instance.get('/user/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      } 
    })
    .then(response => {
      setUsers(response.data.users);
      setLoading(false);
    })
    .catch(err => {
      console.log(err);
      setError("Failed to fetch user data");
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch user data',
      });
    });
  }

  useEffect(() => {
    getUserData();
  }, []);

  function updateUser(editingId) {
    const updatedUser = {
      id: editingId, 
      name: name,
      email: email,
      password: password,
      role: role
    };

    instance.put('/user/updateuser', updatedUser, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      Swal.fire({
        icon: 'success',
        title: 'User updated successfully',
        showConfirmButton: false,
        timer: 1500
      });
      getUserData();
      resetForm();
    })
    .catch(error => {
      console.log("Error: " + error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to update user',
      });
    });
  }

  function deleteUser(userId) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        instance.delete(`/user/deleteuser`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          data: { id: userId } 
        })
        .then(response => {
          Swal.fire(
            'Deleted!',
            'User has been deleted.',
            'success'
          );
          getUserData();
        })
        .catch(error => {
          console.log("Error: " + error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'Failed to delete user',
          });
        });
      }
    });
  }

  // Add new user
  function addUser() {
    const newUser = {
      name: name,
      email: email,
      password: password,
      role: role
    };

    instance.post('/user/createuser', newUser, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      Swal.fire({
        icon: 'success',
        title: 'User added successfully',
        showConfirmButton: false,
        timer: 1500
      });
      getUserData();
      resetForm();
    })
    .catch(error => {
      console.log("Error: " + error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to add user',
      });
    });
  }

  // Set form for editing
  function setEditForm(user) {
    setEditingId(user._id); // Changed from user.id to user._id
    
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setPassword(''); // Clear password field when editing
  }

  // Reset form
  function resetForm() {
    setEditingId(null);
    setName('');
    setEmail('');
    setPassword('');
    setRole('user');
  }

  // Handle form submission
  function handleSubmit(e) {
    e.preventDefault();
    if (editingId) {
      updateUser(editingId);
    } else {
      addUser();
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-blue-50">  
      <Navbar page="user"/>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">User Management</h1>
        
        {/* User Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Edit User' : 'Add New User'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {editingId ? 'New Password (leave blank to keep current)' : 'Password'}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  minLength="6"
                  required={!editingId}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-200"
              >
                {editingId ? 'Update User' : 'Add User'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition duration-200"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* User List */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">User List</h2>
          <button 
            onClick={getUserData} 
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition duration-200"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh Users'}
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user, index) => (
                <tr key={user._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${user.role === 'admin' ? 'bg-red-100 text-red-800' : 
                        user.role === 'manager' ? 'bg-purple-100 text-purple-800' : 
                        'bg-green-100 text-green-800'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditForm(user)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {users.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            No user data available. Click "Refresh Users" to fetch data.
          </div>
        )}
      </div>
    </div>
  );
}             