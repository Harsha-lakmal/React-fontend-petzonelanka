import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import instance from "../Service/AxiosHolder/AxiosHolder";
import Swal from 'sweetalert2';

function Category() {
    const { isAuthenticated, jwtToken, usertype } = useAuth();
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [catName, setCatName] = useState("");
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const config = {
        headers: {
            Authorization: `Bearer ${jwtToken}`
        }
    }

    useEffect(function () {
        if (isAuthenticated) {
            if(usertype?.includes("chashier")) {
                navigate("/");
            }
            getCategory();
        }
    }, [isAuthenticated])

    async function getCategory() {
        try {
            const response = await instance.get("/category", config);
            setCategories(response.data);
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: "Error!",
                text: "Failed to fetch categories",
                icon: "error",
                confirmButtonText: "OK"
            });
        }
    }

    async function deleteCategory(id) {
        console.log(id);
        
        try {
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
                await instance.delete(`/category/deelete/${id}`, config);
                await Swal.fire(
                    'Deleted!',
                    'Category has been deleted.',
                    'success'
                );
                getCategory();
            }
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: "Error!",
                text: "Failed to delete category",
                icon: "error",
                confirmButtonText: "OK"
            });
        }
    }

    function startEditing(category) {
        setCatName(category.name);
        setEditingId(category.id);
        setIsEditing(true);
        setError("");
    }

    function cancelEditing() {
        setCatName("");
        setEditingId(null);
        setIsEditing(false);
        setError("");
    }

    async function updateCategory() {
        if(catName === "") {
            setError("Category Name can't be Empty.");
            return;
        }

        const data = {
            name: catName
        }

        try {
            await instance.put(`/update/category/${editingId}`, data, config);
            Swal.fire({
                title: "Success!",
                text: "Category updated successfully",
                icon: "success",
                confirmButtonText: "OK"
            });
            getCategory();
            cancelEditing();
        } catch (error) {
            console.log(error);
            setError(error.response?.data?.message || "Failed to update category");
        }
    }

    async function submitCategory() {
        if(catName === "") {
            setError("Category Name can't be Empty.");
            return;
        }

        const data = {
            name: catName
        }

        try {
            await instance.post("/category", data, config);
            Swal.fire({
                title: "Success!",
                text: "Category added successfully",
                icon: "success",
                confirmButtonText: "OK"
            });
            getCategory();
            setCatName("");
            setError("");
        } catch (error) {
            console.log(error);
            setError(error.response?.data?.message || "Failed to add category");
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 to-blue-50">
            <div className="sticky top-0 z-50">
                <Navbar page="category" />
            </div>
            
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-violet-800 mb-8 text-center">Category Management</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* Add/Edit Category Card */}
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h2 className="text-xl font-semibold text-violet-700 mb-6 pb-2 border-b-2 border-lime-400">
                            {isEditing ? "Edit Category" : "Add New Category"}
                        </h2>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-violet-700 mb-2">Category Name</label>
                                <input 
                                    onChange={(e) => { 
                                        setCatName(e.target.value); 
                                        setError(""); 
                                    }} 
                                    value={catName} 
                                    type="text" 
                                    className="w-full px-4 py-2 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition"
                                    placeholder="Enter Category Name" 
                                />
                            </div>
                            
                            {error && (
                                <div className="text-sm text-red-600 p-2 bg-red-50 rounded-lg">
                                    {error}
                                </div>
                            )}
                            
                            <div className="flex space-x-4">
                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={cancelEditing}
                                        className="flex-1 px-4 py-2 border border-violet-600 text-violet-600 font-medium rounded-lg hover:bg-violet-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button 
                                    type="button" 
                                    onClick={isEditing ? updateCategory : submitCategory}
                                    className={`flex-1 bg-gradient-to-r from-violet-600 to-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:from-violet-700 hover:to-blue-700 transition-all shadow-md`}
                                >
                                    {isEditing ? "Update Category" : "Create Category"}
                                </button>
                            </div>
                        </form>
                    </div>
                    
                    {/* Category List Card */}
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h2 className="text-xl font-semibold text-violet-700 mb-6 pb-2 border-b-2 border-lime-400">Available Categories</h2>
                        <div className="space-y-3">
                            {categories.length > 0 ? (
                                categories.map((category) => (
                                    <div 
                                        key={category.id} 
                                        className="flex items-center justify-between p-3 bg-violet-50 rounded-lg border border-violet-200 hover:bg-violet-100 transition-colors"
                                    >
                                        <span className="font-medium text-violet-700">{category.name}</span>
                                        <div className="flex space-x-2">
                                            <button 
                                                onClick={() => startEditing(category)}
                                                className="text-blue-600 hover:text-blue-800 p-1 rounded-md hover:bg-blue-50 transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                </svg>
                                            </button>
                                            <button 
                                                onClick={() => deleteCategory(category.id)}
                                                className="text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-red-50 transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    No categories found
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Category;