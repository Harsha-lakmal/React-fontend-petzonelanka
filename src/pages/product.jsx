import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import instance from "../Service/AxiosHolder/AxiosHolder";
import Swal from 'sweetalert2';

function Product() {
    const { isAuthenticated, jwtToken, usertype } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const [productName, setProductName] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [productPrice, setProductPrice] = useState(0.0);
    const [categoryId, setCategoryId] = useState(0);
    const [error, setError] = useState("");

    const config = {
        headers: {
            Authorization: `Bearer ${jwtToken}`
        }
    };

    useEffect(function () {
        if (isAuthenticated) {
            if(usertype?.includes("chashier")) {
                navigate("/");
            }
            getProducts();
            getCategory();
        }
    }, [isAuthenticated]);

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
  
    async function getProducts() {
        try {
            const response = await instance.get("/items", config);
            setProducts(response.data);
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: "Error!",
                text: "Failed to fetch products",
                icon: "error",
                confirmButtonText: "OK"
            });
        }
    }

    async function handleSubmit() {
        if (!checkEmpty()) return;
        
        if (!selectedFile) {
            setError("Please select an image for the product");
            return;
        }

        const data = {
            name: productName,
            description: productDescription,
            price: productPrice,
            categoryId: categoryId
        };

        try {
            const response = await instance.post("/items", data, config);
            
            const uploadSuccess = await uploadImage(response.data.id);
            
            if (uploadSuccess) {
                Swal.fire({
                    title: "Success!",
                    text: "Product added successfully",
                    icon: "success",
                    confirmButtonText: "OK"
                });
                
                getProducts();
                clear();
            } else {
                await instance.delete(`/items/${response.data.id}`, config);
                setError("Failed to upload image. Product was not added.");
            }
        } catch (error) {
            console.log(error);
            setError(error.response?.data?.message || "Failed to add product");
        }
    }

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    async function uploadImage(productId) {
        if (!selectedFile) {
            setError("Please select an image to upload");
            return false;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await instance.post(`/upload/${productId}`, formData, {
                headers: {
                    ...config.headers,
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            return true;
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: "Error!",
                text: "Failed to upload image",
                icon: "error",
                confirmButtonText: "OK"
            });
            return false;
        }
    }

    async function updateProduct() {
        if (usertype?.includes("store")) {
            setError("You are not authorized to edit product");
            setEditingProduct(null);
            clear();
            return;
        }

        if (!checkEmpty()) return;

        const data = {
            name: productName,
            description: productDescription,
            price: productPrice,
            categoryId: categoryId
        };

        try {
            await instance.put(`/items/${editingProduct?.id}`, data, config);
            
            if (selectedFile) {
                const uploadSuccess = await uploadImage(editingProduct.id);
                if (!uploadSuccess) {
                    setError("Product updated but failed to update image");
                    return;
                }
            }
            
            Swal.fire({
                title: "Success!",
                text: "Product updated successfully",
                icon: "success",
                confirmButtonText: "OK"
            });
            
            getProducts();
            clear();
        } catch (error) {
            console.log(error);
            setError(error.response?.data?.message || "Failed to update product");
        }
    }

    async function deleteProduct(productId) {
        if (usertype?.includes("store")) {
            setError("You are not authorized to delete product");
            return;
        }

        try {
            await instance.delete(`/items/${productId}`, config);
            Swal.fire({
                title: "Success!",
                text: "Product deleted successfully",
                icon: "success",
                confirmButtonText: "OK"
            });
            getProducts();
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: "Error!",
                text: "Failed to delete product",
                icon: "error",
                confirmButtonText: "OK"
            });
        }
    }

    function clear() {
        setCategoryId(0);
        setProductName("");
        setProductDescription("");
        setProductPrice(0.0);
        setEditingProduct(null);
        setSelectedFile(null);
        setError("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    function checkEmpty() {
        if (productName === "" || productDescription === "" || productPrice === 0 || productPrice === 0.0 || categoryId === 0) {
            setError("All fields are required");
            return false;
        }
        return true;
    }

    function handlePrice(e) {
        setProductPrice(e.target.value);
        setError("");
    }

    function getEditProduct(product) {
        setEditingProduct(product);
        setProductName(product.name);
        setProductDescription(product.description);
        setProductPrice(product.price);
        setCategoryId(product.category.id);
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 to-blue-50">
            <div className="sticky top-0 z-50">
                <Navbar page="product" />
            </div>
            
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-violet-800 mb-8 text-center">Product Management</h1>
                
                {/* Add/Edit Product Card */}
                <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
                    <h2 className="text-xl font-semibold text-violet-700 mb-6 pb-2 border-b-2 border-lime-400">
                        {editingProduct ? "Edit Product" : "Add New Product"}
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-violet-700 mb-2">Product Name</label>
                            <input 
                                type="text" 
                                onChange={(e) => { setProductName(e.target.value); setError(""); }} 
                                value={productName} 
                                className="w-full px-4 py-2 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition"
                                placeholder="Product Name" 

                                
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-violet-700 mb-2">Description</label>
                            <input 
                                type="text" 
                                onChange={(e) => { setProductDescription(e.target.value); setError(""); }} 
                                value={productDescription} 
                                className="w-full px-4 py-2 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition"
                                placeholder="Description" 
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-violet-700 mb-2">Price (LKR)</label>
                            <input 
                                type="number" 
                                onChange={handlePrice} 
                                value={productPrice} 
                                className="w-full px-4 py-2 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition"
                                placeholder="Price" 
                                step="0.01"
                                min="0"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-violet-700 mb-2">Category</label>
                            <select 
                                className="w-full px-4 py-2 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition"
                                onChange={(e) => { setCategoryId(parseInt(e.target.value)); setError(""); }} 
                                value={categoryId}
                            >
                                <option value={0}>Select Category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    {/* Image Upload Section - Improved styling */}
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-violet-700 mb-2">
                            {editingProduct ? "Update Product Image" : "Product Image"}
                        </label>
                        <div className="flex items-center space-x-4">
                            <div className="w-full">
                                <label className="flex items-center justify-center w-full px-4 py-2 border border-violet-300 rounded-lg cursor-pointer hover:bg-violet-50 transition-colors">
                                    <span className="font-medium text-violet-600">
                                        {selectedFile ? selectedFile.name : (editingProduct ? "Upload New Image" : "Select Image")}
                                    </span>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                </label>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            {selectedFile ? `Selected file: ${selectedFile.name}` : "Image is required for product"}
                        </p>
                    </div>
                    
                    {error && (
                        <div className="mt-4 text-sm text-red-600 p-2 bg-red-50 rounded-lg">
                            {error}
                        </div>
                    )}
                    
                    <div className="mt-6 flex justify-end space-x-4">
                        {editingProduct && (
                            <button 
                                onClick={clear}
                                className="px-6 py-2 border border-violet-600 text-violet-600 font-medium rounded-lg hover:bg-violet-50 transition-colors"
                            >
                                Cancel
                            </button>
                        )}
                        <button 
                            onClick={editingProduct ? updateProduct : handleSubmit}
                            className="px-6 py-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-medium rounded-lg hover:from-violet-700 hover:to-blue-700 transition-all shadow-md"
                        >
                            {editingProduct ? "Update Product" : "Add Product"}
                        </button>
                    </div>
                </div>
                
                {/* Product List Card - Now showing images */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold text-violet-700 mb-6 pb-2 border-b-2 border-lime-400">Product List</h2>
                    
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-violet-200">
                            <thead className="bg-violet-50">
                                <tr>
                            
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-violet-700 uppercase tracking-wider">
                                        Product Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-violet-700 uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-violet-700 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-violet-700 uppercase tracking-wider">
                                        Price (LKR)
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-violet-700 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-violet-200">
                                {products.length > 0 ? (
                                    products.map((product) => (
                                        <tr key={product.id} className="hover:bg-violet-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-violet-900">
                                                {product.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-violet-700">
                                                {product.description}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-violet-700">
                                                {product.category.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-violet-700">
                                                {product.price.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-2">
                                                    <button
                                                        onClick={() => getEditProduct(product)}
                                                        className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => deleteProduct(product.id)}
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
                                        <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                            No products found
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

export default Product;