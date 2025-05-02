import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import instance from "../Service/AxiosHolder/AxiosHolder";
import Swal from 'sweetalert2';

function Stock() {
    const { isAuthenticated, jwtToken, usertype } = useAuth();
    const navigate = useNavigate();

    const [newProduct, setNewProduct] = useState(false);
    const [extProduct, setExtProduct] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [stockId, setStockId] = useState(0);
    const [productId, setProductId] = useState(0);
    const [qty, setQty] = useState(0);
    const [products, setProducts] = useState([]);
    const [stockAvailable, setStockAvailable] = useState([]);
    const [newProducts, setNewProducts] = useState([]);
    const [stockOrder, setStockOrder] = useState([]);
    const [stockDtos, setStockDtos] = useState([]);
    const [error, setError] = useState("");

    const config = {
        headers: {
            Authorization: `Bearer ${jwtToken}`
        }
    };

    useEffect(function () {
        if (isAuthenticated) {
            if (usertype?.includes("chashier")) {
                navigate("/");
            }
            getStockAvailable();
            getProducts();
        }
    }, [isAuthenticated]);

    useEffect(function () {
        if (isAuthenticated) {
            setNewProducts(filterNewProducts());
        }
    }, [stockAvailable, products]);

    async function getStockAvailable() {
        try {
            const response = await instance.get("/stock", config);
            setStockAvailable(response.data);
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: "Error!",
                text: "Failed to fetch stock data",
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

    async function createStock() {
        if (qty <= 0) {
            setError("Quantity must be greater than 0");
            return;
        }

        const data = {
            id: productId,
            qty: qty
        };

        try {
            await instance.post("/stock", data, config);
            Swal.fire({
                title: "Success!",
                text: "Stock created successfully",
                icon: "success",
                confirmButtonText: "OK"
            });
            getStockAvailable();
            setQty(0);
            setProductId(0);
        } catch (error) {
            console.log(error);
            setError(error.response?.data?.message || "Failed to create stock");
        }
    }

    async function updateStock() {
        if (usertype?.includes("admin")) {
            if (qty <= 0) {
                setError("Quantity must be greater than 0");
                return;
            }

            const data = {
                id: stockId,
                qty: qty
            };

            try {
                await instance.put("/stock", data, config);
                Swal.fire({
                    title: "Success!",
                    text: "Stock updated successfully",
                    icon: "success",
                    confirmButtonText: "OK"
                });
                getStockAvailable();
                setQty(0);
                setIsUpdating(false);
            } catch (error) {
                console.log(error);
                setError(error.response?.data?.message || "Failed to update stock");
            }
        } else {
            setError("You are not authorized to update stock");
            setQty(0);
            setIsUpdating(false);
        }
    }

    async function addToStock() {
        if (stockOrder.length === 0) {
            setError("No items in stock order");
            return;
        }

        try {
            await instance.put("/stock/addto", stockDtos, config);
            Swal.fire({
                title: "Success!",
                text: "Stock updated successfully",
                icon: "success",
                confirmButtonText: "OK"
            });
            setStockDtos([]);
            setStockOrder([]);
            getStockAvailable();
            setExtProduct(false);
        } catch (error) {
            console.log(error);
            setError(error.response?.data?.message || "Failed to update stock");
        }
    }

    function filterNewProducts() {
        return products.filter(product => 
            !stockAvailable.some(stock => stock.item.id === product.id)
        );
    }

    function addToStockOrder(stock) {
        if (qty <= 0) {
            setError("Quantity must be greater than 0");
            return;
        }

        const updatedStock = { ...stock, qoh: qty };
        const updatedOrder = [...stockOrder, updatedStock];
        setStockOrder(updatedOrder);

        const stockDto = {
            id: stock.id,
            qty: qty
        };
        setStockDtos([...stockDtos, stockDto]);

        setQty(0);
        setProductId(0);
    }

    function removeFromStockOrder(stock) {
        const updatedOrder = stockOrder.filter(item => item.id !== stock.id);
        setStockOrder(updatedOrder);

        const updatedDtos = stockDtos.filter(dto => dto.id !== stock.id);
        setStockDtos(updatedDtos);
    }

    function resetForms() {
        setNewProduct(false);
        setExtProduct(false);
        setIsUpdating(false);
        setQty(0);
        setProductId(0);
        setStockId(0);
        setError("");
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 to-blue-50">
            <div className="sticky top-0 z-50">
                <Navbar page="stock" />
            </div>
            
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-violet-800 mb-8 text-center">Stock Management</h1>
                
                {/* Main Control Card */}
                <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
                    {!newProduct && !extProduct ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button 
                                onClick={() => {
                                    setNewProduct(true);
                                    setExtProduct(false);
                                    setError("");
                                }}
                                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-medium rounded-lg hover:from-violet-700 hover:to-blue-700 transition-all shadow-md"
                            >
                                Add New Products to Stock
                            </button>
                            <button 
                                onClick={() => {
                                    setExtProduct(true);
                                    setNewProduct(false);
                                    setError("");
                                }}
                                className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-teal-700 transition-all shadow-md"
                            >
                                Update Existing Stock
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={resetForms}
                            className="px-6 py-2 border border-violet-600 text-violet-600 font-medium rounded-lg hover:bg-violet-50 transition-colors"
                        >
                            Back to Main Menu
                        </button>
                    )}
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                        {error}
                    </div>
                )}

                {/* Add New Products Section */}
                {newProduct && (
                    <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
                        <h2 className="text-xl font-semibold text-violet-700 mb-6 pb-2 border-b-2 border-lime-400">
                            Add New Products to Stock
                        </h2>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-violet-200">
                                <thead className="bg-violet-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-violet-700 uppercase tracking-wider">
                                            Product Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-violet-700 uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-violet-700 uppercase tracking-wider w-48">
                                            Add to Stock
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-violet-200">
                                    {newProducts.length > 0 ? (
                                        newProducts.map(product => (
                                            <tr key={product.id} className="hover:bg-violet-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-violet-900">
                                                    {product.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-violet-700">
                                                    {product.description}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end space-x-2">
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={productId === product.id ? qty : 0}
                                                            onChange={(e) => {
                                                                setQty(parseInt(e.target.value));
                                                                setProductId(product.id);
                                                                setError("");
                                                            }}
                                                            className="w-20 px-2 py-1 border border-violet-300 rounded focus:ring-violet-500 focus:border-violet-500"
                                                            placeholder="Qty"
                                                        />
                                                        <button
                                                            onClick={() => createStock()}
                                                            className="px-3 py-1 bg-gradient-to-r from-green-600 to-teal-600 text-white text-sm font-medium rounded hover:from-green-700 hover:to-teal-700 transition-all shadow-sm"
                                                        >
                                                            Add
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                                                No new products available to add
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Update Existing Stock Section */}
                {extProduct && (
                    <div className="space-y-6">
                        {/* Available Stock to Update */}
                        <div className="bg-white p-6 rounded-xl shadow-lg">
                            <h2 className="text-xl font-semibold text-violet-700 mb-6 pb-2 border-b-2 border-lime-400">
                                Available Stock
                            </h2>
                            
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-violet-200">
                                    <thead className="bg-violet-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-violet-700 uppercase tracking-wider">
                                                Product Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-violet-700 uppercase tracking-wider">
                                                Description
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-violet-700 uppercase tracking-wider">
                                                Current Qty
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-violet-700 uppercase tracking-wider w-48">
                                                Add to Order
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-violet-200">
                                        {stockAvailable.length > 0 ? (
                                            stockAvailable.map(stock => (
                                                !stockOrder.some(item => item.id === stock.id) && (
                                                    <tr key={stock.id} className="hover:bg-violet-50 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-violet-900">
                                                            {stock.item.name}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-violet-700">
                                                            {stock.item.description}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-violet-700">
                                                            {stock.qoh}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <div className="flex justify-end space-x-2">
                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    value={productId === stock.id ? qty : ""}
                                                                    onChange={(e) => {
                                                                        setQty(parseInt(e.target.value));
                                                                        setProductId(stock.id);
                                                                        setError("");
                                                                    }}
                                                                    className="w-20 px-2 py-1 border border-violet-300 rounded focus:ring-violet-500 focus:border-violet-500"
                                                                    placeholder="Add Qty"
                                                                />
                                                                <button
                                                                    onClick={() => addToStockOrder(stock)}
                                                                    className="px-3 py-1 bg-gradient-to-r from-green-600 to-teal-600 text-white text-sm font-medium rounded hover:from-green-700 hover:to-teal-700 transition-all shadow-sm"
                                                                >
                                                                    Add
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                                                    No stock available
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Stock Order Section */}
                        <div className="bg-white p-6 rounded-xl shadow-lg">
                            <h2 className="text-xl font-semibold text-violet-700 mb-6 pb-2 border-b-2 border-lime-400">
                                Stock Order
                            </h2>
                            
                            {stockOrder.length > 0 ? (
                                <>
                                    <div className="overflow-x-auto mb-4">
                                        <table className="min-w-full divide-y divide-violet-200">
                                            <thead className="bg-violet-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-violet-700 uppercase tracking-wider">
                                                        Product Name
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-violet-700 uppercase tracking-wider">
                                                        Description
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-violet-700 uppercase tracking-wider">
                                                        Qty to Add
                                                    </th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-violet-700 uppercase tracking-wider w-24">
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-violet-200">
                                                {stockOrder.map(stock => (
                                                    <tr key={stock.id} className="hover:bg-violet-50 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-violet-900">
                                                            {stock.item.name}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-violet-700">
                                                            {stock.item.description}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-violet-700">
                                                            {stock.qoh}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <button
                                                                onClick={() => removeFromStockOrder(stock)}
                                                                className="text-red-600 hover:text-red-800 px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
                                                            >
                                                                Remove
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <button
                                        onClick={addToStock}
                                        className="w-full py-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-medium rounded-lg hover:from-violet-700 hover:to-blue-700 transition-all shadow-md"
                                    >
                                        Update Stock
                                    </button>
                                </>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    No items in stock order
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Current Stock Overview (shown when not in add/update mode) */}
                {!newProduct && !extProduct && (
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h2 className="text-xl font-semibold text-violet-700 mb-6 pb-2 border-b-2 border-lime-400">
                            Current Stock Overview
                        </h2>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-violet-200">
                                <thead className="bg-violet-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-violet-700 uppercase tracking-wider">
                                            Product Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-violet-700 uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-violet-700 uppercase tracking-wider">
                                            Current Quantity
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-violet-700 uppercase tracking-wider w-48">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-violet-200">
                                    {stockAvailable.length > 0 ? (
                                        stockAvailable.map(stock => (
                                            <tr key={stock.id} className="hover:bg-violet-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-violet-900">
                                                    {stock.item.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-violet-700">
                                                    {stock.item.description}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-violet-700">
                                                    {isUpdating && stockId === stock.id ? (
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={qty}
                                                            onChange={(e) => setQty(parseInt(e.target.value))}
                                                            className="w-20 px-2 py-1 border border-violet-300 rounded focus:ring-violet-500 focus:border-violet-500"
                                                            autoFocus
                                                        />
                                                    ) : (
                                                        stock.qoh
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    {isUpdating && stockId === stock.id ? (
                                                        <div className="flex justify-end space-x-2">
                                                            <button
                                                                onClick={() => {
                                                                    setIsUpdating(false);
                                                                    setQty(0);
                                                                }}
                                                                className="px-3 py-1 border border-violet-600 text-violet-600 text-sm font-medium rounded hover:bg-violet-50 transition-colors"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                onClick={updateStock}
                                                                className="px-3 py-1 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-medium rounded hover:from-violet-700 hover:to-blue-700 transition-all shadow-sm"
                                                            >
                                                                Save
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => {
                                                                setIsUpdating(true);
                                                                setStockId(stock.id);
                                                                setQty(stock.qoh);
                                                            }}
                                                            className="px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium rounded hover:from-purple-700 hover:to-indigo-700 transition-all shadow-sm"
                                                        >
                                                            Update
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                                                No stock available
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Stock;