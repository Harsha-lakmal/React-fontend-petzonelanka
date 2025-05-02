import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import back from "../../assets/back.png";
import instance from "../../Service/AxiosHolder/AxiosHolder";
import Swal from 'sweetalert2';

function CreateOrder() {
    const { isAuthenticated, jwtToken, usertype } = useAuth();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [stocks, setStocks] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [order, setOrder] = useState([]);
    const [qty, setQty] = useState(0);
    const [productId, setProductId] = useState(0);
    const [cartList, setCartList] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [stockDtos, setStockDtos] = useState([]);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");

    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [collectingCash, setCollectingCash] = useState(false);
    const [cashCollected, setCashCollected] = useState(false);
    const [cashAmount, setCashAmount] = useState(0);

    const config = {
        headers: {
            Authorization: `Bearer ${jwtToken}`
        }
    };

    useEffect(function () {
        if (isAuthenticated) {
            if (usertype?.includes("store")) {
                navigate("/");
            }
            getProducts();
            getStocks();
        }
    }, [isAuthenticated, cartList]);

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

    async function getStocks() {
        try {
            const response = await instance.get("/stock", config);
            setStocks(response.data);
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: "Error!",
                text: "Failed to fetch stock",
                icon: "error",
                confirmButtonText: "OK"
            });
        }
    }

    async function getFromStock() {
        try {
            await instance.put("/stock/getfrom", stockDtos, config);
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: "Error!",
                text: "Failed to update stock",
                icon: "error",
                confirmButtonText: "OK"
            });
        }
    }

    async function placeOrder() {
        const data = {
            itemIds: order
        };
        try {
            await instance.post("/orders", data, config);
            Swal.fire({
                title: "Success!",
                text: "Order placed successfully",
                icon: "success",
                confirmButtonText: "OK"
            });
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: "Error!",
                text: "Failed to place order",
                icon: "error",
                confirmButtonText: "OK"
            });
        }
    }

    function submitOrder() {
        getFromStock();
        placeOrder();
        resetOrder();
        navigate("/order");
    }

    function addToOrder(product) {
        const stockitem = stocks.find(stock => stock.item.id === product.id);
        const price = product.price * qty;

        if (!stockitem || stockitem.qoh < qty) {
            setError("Not enough stock available");
            return;
        }

        const newOrder = [...order];
        for (let i = 0; i < qty; i++) {
            newOrder.push(product.id);
        }
        setOrder(newOrder);

        const newCartItem = {
            stockId: stockitem.id,
            itemId: product.id,
            name: product.name,
            description: product.description,
            qty: qty,
            price: price,
        };
        setCartList([...cartList, newCartItem]);

        const newStockDto = {
            id: stockitem.id,
            qty: qty,
        };
        setStockDtos([...stockDtos, newStockDto]);

        setTotalPrice(totalPrice + price);
        setQty(0);
        setProductId(0);
    }

    function removeFromCart(cart) {
        const updatedOrder = order.filter(id => id !== cart.itemId);
        setOrder(updatedOrder);

        const updatedCart = cartList.filter(item => item.stockId !== cart.stockId);
        setCartList(updatedCart);

        const updatedStockDtos = stockDtos.filter(dto => dto.id !== cart.stockId);
        setStockDtos(updatedStockDtos);

        setTotalPrice(totalPrice - cart.price);
    }

    function resetOrder() {
        setOrder([]);
        setCartList([]);
        setStockDtos([]);
        setTotalPrice(0);
        setQty(0);
        setProductId(0);
        setIsCheckingOut(false);
        setCollectingCash(false);
        setCashCollected(false);
        setCashAmount(0);
        setError("");
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

            {/* Checkout View */}
            {isCheckingOut ? (
                <div className="container mx-auto px-4 py-8">
                    <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-violet-700">Order Summary</h2>
                            <button 
                                onClick={() => setIsCheckingOut(false)}
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <img className="h-6 w-6" src={back} alt="Back" />
                            </button>
                        </div>

                        <div className="space-y-4 mb-6">
                            {cartList.map(cart => (
                                <div key={cart.stockId} className="p-4 border border-violet-200 rounded-lg">
                                    <div className="flex justify-between">
                                        <h3 className="font-medium text-violet-800">{cart.name}</h3>
                                        <button 
                                            onClick={() => removeFromCart(cart)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <p className="text-sm text-violet-600">{cart.description}</p>
                                    <div className="flex justify-between mt-2">
                                        <span className="text-sm">Qty: {cart.qty}</span>
                                        <span className="font-medium">{formatCurrency(cart.price)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-violet-200 pt-4 space-y-4">
                            <div className="flex justify-between">
                                <span className="font-medium">Subtotal:</span>
                                <span className="font-medium">{formatCurrency(totalPrice)}</span>
                            </div>

                            {collectingCash ? (
                                <div className="flex flex-col space-y-2">
                                    <label className="text-sm font-medium text-violet-700">Enter Cash Amount</label>
                                    <input
                                        type="number"
                                        value={cashAmount}
                                        onChange={(e) => setCashAmount(parseFloat(e.target.value) || 0)}
                                        className="px-4 py-2 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition"
                                        autoFocus
                                    />
                                    <div className="flex space-x-4">
                                        <button
                                            onClick={() => {
                                                setCollectingCash(false);
                                                setCashCollected(true);
                                            }}
                                            className="flex-1 py-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-lg hover:from-violet-700 hover:to-blue-700 transition-all"
                                        >
                                            Confirm
                                        </button>
                                        <button
                                            onClick={() => {
                                                setCollectingCash(false);
                                                setCashAmount(0);
                                            }}
                                            className="flex-1 py-2 border border-violet-600 text-violet-600 rounded-lg hover:bg-violet-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : cashCollected ? (
                                <>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Cash Received:</span>
                                        <span className="font-medium">{formatCurrency(cashAmount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Change Due:</span>
                                        <span className="font-medium">{formatCurrency(cashAmount - totalPrice)}</span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            submitOrder();
                                            setCashCollected(false);
                                        }}
                                        className="w-full py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition-all"
                                    >
                                        Complete Order
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setCollectingCash(true)}
                                    className="w-full py-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-lg hover:from-violet-700 hover:to-blue-700 transition-all"
                                >
                                    Process Payment
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="container mx-auto px-4 py-8">
                    {/* Search and Cart Header */}
                    <div className="bg-white p-4 rounded-xl shadow-lg mb-6 sticky top-20 z-40">
                        <div className="flex items-center justify-between">
                            <div className="flex-1 max-w-md">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-violet-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition"
                                        placeholder="Search products..."
                                    />
                                </div>
                            </div>
                            <button
                                onClick={() => setIsCartOpen(!isCartOpen)}
                                className="ml-4 p-2 bg-gradient-to-r from-blue-600 to-sky-400 rounded-lg hover:from-blue-700 hover:to-sky-500 transition-all relative"
                            >
                                <svg className="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312" />
                                </svg>
                                {cartList.length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                                        {cartList.length}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Products Grid */}
                        <div className={`${isCartOpen ? 'lg:w-2/3' : 'w-full'}`}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {products
                                    .filter(product => 
                                        product.name.toLowerCase().includes(search.toLowerCase()) || 
                                        product.description.toLowerCase().includes(search.toLowerCase())
                                    )
                                    .map(product => {
                                        const stockitem = stocks.find(stock => stock.item.id === product.id);
                                        const qoh = stockitem ? stockitem.qoh : 0;

                                        return (
                                            <div key={product.id} className="bg-white p-4 rounded-xl shadow-md border border-violet-100 hover:shadow-lg transition-shadow">
                                                <h3 className="font-bold text-lg text-violet-800 border-b border-violet-200 pb-2 mb-2">
                                                    {product.name}
                                                </h3>
                                                <p className="text-sm text-violet-600 mb-3">{product.description}</p>
                                                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                                                    <div>
                                                        <span className="font-medium text-violet-700">Price:</span>
                                                        <span className="ml-1">{formatCurrency(product.price)}</span>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-violet-700">Stock:</span>
                                                        <span className="ml-1">{qoh}</span>
                                                    </div>
                                                </div>
                                                {productId === product.id ? (
                                                    <div className="space-y-2">
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            max={qoh}
                                                            value={qty}
                                                            onChange={(e) => {
                                                                const value = parseInt(e.target.value);
                                                                setQty(isNaN(value) ? 0 : value);
                                                                setError("");
                                                            }}
                                                            className="w-full px-3 py-1 border border-violet-300 rounded focus:ring-violet-500 focus:border-violet-500"
                                                            placeholder="Quantity"
                                                        />
                                                        {error && productId === product.id && (
                                                            <p className="text-red-500 text-xs">{error}</p>
                                                        )}
                                                        <button
                                                            onClick={() => qty > 0 && qty <= qoh ? addToOrder(product) : setError("Invalid quantity")}
                                                            className="w-full py-1 bg-gradient-to-r from-green-600 to-lime-500 text-white rounded hover:from-green-700 hover:to-lime-600 transition-all"
                                                        >
                                                            Add to Cart
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            setProductId(product.id);
                                                            setQty(1);
                                                            setError("");
                                                        }}
                                                        className="w-full py-1 bg-gradient-to-r from-violet-600 to-blue-500 text-white rounded hover:from-violet-700 hover:to-blue-600 transition-all"
                                                    >
                                                        Select
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>

                        {/* Cart Sidebar */}
                        {isCartOpen && (
                            <div className="lg:w-1/3">
                                <div className="bg-white p-4 rounded-xl shadow-lg sticky top-40">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-semibold text-lg text-violet-800">Your Cart</h3>
                                        <span className="text-sm text-violet-600">{cartList.length} items</span>
                                    </div>

                                    {cartList.length > 0 ? (
                                        <>
                                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                                {cartList.map(cart => (
                                                    <div key={cart.stockId} className="p-3 border border-violet-100 rounded-lg">
                                                        <div className="flex justify-between">
                                                            <h4 className="font-medium text-violet-700">{cart.name}</h4>
                                                            <button 
                                                                onClick={() => removeFromCart(cart)}
                                                                className="text-red-500 hover:text-red-700 text-sm"
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                        <div className="flex justify-between text-sm text-violet-600 mt-1">
                                                            <span>{cart.qty} × {formatCurrency(cart.price / cart.qty)}</span>
                                                            <span className="font-medium">{formatCurrency(cart.price)}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="border-t border-violet-200 mt-4 pt-4">
                                                <div className="flex justify-between font-medium text-lg">
                                                    <span>Total:</span>
                                                    <span>{formatCurrency(totalPrice)}</span>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        if (cartList.length > 0) {
                                                            setIsCheckingOut(true);
                                                        }
                                                    }}
                                                    className="w-full mt-4 py-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-lg hover:from-violet-700 hover:to-blue-700 transition-all"
                                                >
                                                    Checkout
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            Your cart is empty
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default CreateOrder;