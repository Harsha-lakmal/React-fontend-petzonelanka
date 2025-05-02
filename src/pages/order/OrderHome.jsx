import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";

function OrderHome() {
    const { isAuthenticated, usertype } = useAuth();
    const navigate = useNavigate();

    useEffect(function () {
        if (isAuthenticated) {
            if (usertype?.includes("store")) {
                navigate("/");
            }
        }
    }, [isAuthenticated]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 to-blue-50">
            <div className="sticky top-0 z-50">
                <Navbar page="order" />
            </div>
            
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-violet-800 mb-8 text-center">Order Management</h1>
                
                <div className="max-w-md mx-auto">
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h2 className="text-xl font-semibold text-violet-700 mb-6 pb-2 border-b-2 border-lime-400 text-center">
                            Order Options
                        </h2>
                        
                        <div className="grid grid-cols-1 gap-4">
                            <Link 
                                to="/order/orders" 
                                className="block px-6 py-4 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-medium rounded-lg hover:from-violet-700 hover:to-blue-700 transition-all shadow-md text-center"
                            >
                                View All Orders
                            </Link>
                            
                            <Link 
                                to="/order/createorder"
                                className="block px-6 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-teal-700 transition-all shadow-md text-center"
                            >
                                Create New Order
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderHome;