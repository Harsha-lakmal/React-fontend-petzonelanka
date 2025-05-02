import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import instance from "../Service/AxiosHolder/AxiosHolder";
import Swal from 'sweetalert2';

function User() {
    const { isAuthenticated, jwtToken, usertype } = useAuth();
    const navigate = useNavigate();
    
    const [users, setUsers] = useState([]);
    const [fullname, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [userType, setUserType] = useState("");
    const [userId, setUserId] = useState(0);
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    const config = {
        headers: {
            Authorization: `Bearer ${jwtToken}`
        }
    };

    useEffect(function () {
        if (isAuthenticated) {
            if(usertype?.includes("chashier") || usertype?.includes("store")) {
                navigate("/");
            }
            getUsers();
        }
    }, [isAuthenticated]);

    async function getUsers() {
        try {
            const response = await instance.get("/users", config);
            setUsers(response.data);
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: "Error!",
                text: "Failed to fetch users",
                icon: "error",
                confirmButtonText: "OK"
            });
        }
    }

    async function addUser() {
        if (!validateForm()) return;

        const data = {
            username: username,
            password: password,
            fullname: fullname,
            userType: userType
        };
        
        try {
            await instance.post("/users", data, config);
            Swal.fire({
                title: "Success!",
                text: "User added successfully",
                icon: "success",
                confirmButtonText: "OK"
            });
            getUsers();
            clear();
        } catch (error) {
            console.log(error);
            setError(error.response?.data?.message || "Failed to add user");
        }
    }

    async function updateUser() {
        if (!validateForm()) return;

        const data = {
            username: username,
            password: password,
            fullname: fullname,
            userType: userType
        };

        try {
            await instance.put(`/users/${userId}`, data, config);
            Swal.fire({
                title: "Success!",
                text: "User updated successfully",
                icon: "success",
                confirmButtonText: "OK"
            });
            getUsers();
            clear();
        } catch (error) {
            console.log(error);
            setError(error.response?.data?.message || "Failed to update user");
        }
    }

    async function deleteUser(user) {
        if (user.userType.includes("admin") && usertype?.includes("manager")) {
            setError("You are not authorized to delete admin user.");
            return;
        }

        if(user.userType.includes("admin") && usertype?.includes("admin")) {
            const adminCount = users.filter(u => u.userType.includes("admin")).length;
            if(adminCount <= 1){
                setError("Can't delete the last admin user in the system");
                return;
            }
        }

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await instance.delete(`/users/${user.id}`, config);
                Swal.fire(
                    'Deleted!',
                    'User has been deleted.',
                    'success'
                );
                getUsers();
                clear();
            } catch (error) {
                console.log(error);
                Swal.fire({
                    title: "Error!",
                    text: "Failed to delete user",
                    icon: "error",
                    confirmButtonText: "OK"
                });
            }
        }
    }

    function validateForm() {
        if (!fullname || !username || !password || !userType) {
            setError("All fields are required");
            return false;
        }

        if (!checkUsernameDuplication()) {
            setError("Username already exists");
            return false;
        }

        return true;
    }

    function checkUsernameDuplication() {
        return !users.some(user => 
            user.username === username && 
            user.id !== userId
        );
    }

    function clear() {
        setFullName("");
        setUsername("");
        setPassword("");
        setUserType("");
        setUserId(0);
        setIsEditing(false);
        setError("");
    }

    function startEditing(user) {
        setIsEditing(true);
        setFullName(user.fullname);
        setUsername(user.username);
        setPassword("");
        setUserType(user.userType);
        setUserId(user.id);
        setError("");
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 to-blue-50">
            <div className="sticky top-0 z-50">
                <Navbar page="user" />
            </div>
            
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-violet-800 mb-8 text-center">User Management</h1>
                
                {/* Add/Edit User Card */}
                <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
                    <h2 className="text-xl font-semibold text-violet-700 mb-6 pb-2 border-b-2 border-lime-400">
                        {isEditing ? "Edit User" : "Add New User"}
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-violet-700 mb-2">Full Name</label>
                            <input 
                                type="text" 
                                value={fullname} 
                                onChange={(e) => setFullName(e.target.value)} 
                                className="w-full px-4 py-2 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition"
                                placeholder="Enter Full Name" 
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-violet-700 mb-2">Username</label>
                            <input 
                                type="text" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                                className="w-full px-4 py-2 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition"
                                placeholder="Enter Username" 
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-violet-700 mb-2">Password</label>
                            <input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                className="w-full px-4 py-2 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition"
                                placeholder="Enter Password" 
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-violet-700 mb-2">User Type</label>
                            <select 
                                value={userType} 
                                onChange={(e) => setUserType(e.target.value)} 
                                className="w-full px-4 py-2 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition"
                            >
                                <option value="">Select User Type</option>
                                {usertype?.includes("admin") && <option value="admin">Admin</option>}
                                <option value="manager">Manager</option>
                                <option value="User">User</option>
                            </select>
                        </div>
                    </div>
                    
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                            {error}
                        </div>
                    )}
                    
                    <div className="flex justify-end space-x-4">
                        {isEditing && (
                            <button 
                                onClick={clear}
                                className="px-6 py-2 border border-violet-600 text-violet-600 font-medium rounded-lg hover:bg-violet-50 transition-colors"
                            >
                                Cancel
                            </button>
                        )}
                        <button 
                            onClick={isEditing ? updateUser : addUser}
                            className="px-6 py-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-medium rounded-lg hover:from-violet-700 hover:to-blue-700 transition-all shadow-md"
                        >
                            {isEditing ? "Update User" : "Add User"}
                        </button>
                    </div>
                </div>
                
                {/* Users List Card */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold text-violet-700 mb-6 pb-2 border-b-2 border-lime-400">Users List</h2>
                    
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-violet-200">
                            <thead className="bg-violet-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-violet-700 uppercase tracking-wider">
                                        Full Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-violet-700 uppercase tracking-wider">
                                        Username
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-violet-700 uppercase tracking-wider">
                                        User Type
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-violet-700 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-violet-200">
                                {users.length > 0 ? (
                                    users.map(user => (
                                        <tr key={user.id} className="hover:bg-violet-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-violet-900">
                                                {user.fullname}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-violet-700">
                                                {user.username}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-violet-700">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                    user.userType === 'admin' ? 'bg-purple-100 text-purple-800' :
                                                    user.userType === 'manager' ? 'bg-blue-100 text-blue-800' :
                                                    user.userType === 'store' ? 'bg-green-100 text-green-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {user.userType}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-2">
                                                    <button
                                                        onClick={() => startEditing(user)}
                                                        className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => deleteUser(user)}
                                                        className="text-red-600 hover:text-red-800 px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                                            No users found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default User;