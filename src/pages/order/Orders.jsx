import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import instance from "../../Service/AxiosHolder/AxiosHolder";
import Swal from 'sweetalert2';

function Orders() {
    const { isAuthenticated, jwtToken, usertype } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    
    const config = {
        headers: {
            Authorization: `Bearer ${jwtToken}`
        }
    };

    useEffect(function () {
        if (isAuthenticated) {
            if(usertype?.includes("store") || usertype?.includes("chashier")) {
                navigate("/");
            }
            getOrders();
        }
    }, [isAuthenticated]);

    async function getOrders() {
        try {
            const response = await instance.get("/orders", config);
            setOrders(response.data);
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: "Error!",
                text: "Failed to fetch orders",
                icon: "error",
                confirmButtonText: "OK"
            });
        }
    }

    function formatDateTime(dateTimeString) {
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        return new Date(dateTimeString).toLocaleDateString('en-US', options);
    }

    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'LKR'
        }).format(amount);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 to-blue-50">
            <div className="sticky top-0 z-50">
                <Navbar page="order" />
            </div>
            
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-violet-800 mb-8 text-center">Order Management</h1>
                
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold text-violet-700 mb-6 pb-2 border-b-2 border-lime-400">
                        All Orders
                    </h2>
                    
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-violet-200">
                            <thead className="bg-violet-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-violet-700 uppercase tracking-wider">
                                        Order ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-violet-700 uppercase tracking-wider">
                                        Date & Time
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-violet-700 uppercase tracking-wider">
                                        Total Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-violet-700 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-violet-200">
                                {orders.length > 0 ? (
                                    orders.map(order => (
                                        <tr key={order.id} className="hover:bg-violet-50 transition-colors cursor-pointer">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-violet-900">
                                                #{order.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-violet-700">
                                                {formatDateTime(order.orderDateTime)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-violet-700">
                                                {formatCurrency(order.orderTotal)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                                    Completed
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                                            No orders found
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

export default Orders;