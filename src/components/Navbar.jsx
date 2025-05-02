import { useState } from "react";
import logo from "../assets/magamarketlk.png";
import { useAuth } from "../context/AuthContext";

function Navbar(data) {
    const { logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="sticky top-0 bg-gray-900 border-gray-200">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img className="w-10 h-10" src={logo} alt="" />
                    <span className="self-center text-xl font-bold whitespace-nowrap text-white hover:text-blue-500 transition-colors duration-300 font-sans">
                        MegaMart - Lanka
                    </span>


                </a>
                <button
                    onClick={() => { setIsOpen(!isOpen) }}
                    type="button"
                    className="m-1 inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg md:hidden hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-700"
                    aria-controls="navbar-default"
                    aria-expanded="false"
                >
                    <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                    </svg>
                </button>
                <div className="hidden w-full md:block md:w-auto">
                    <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-700 rounded-lg bg-gray-800 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-gray-900">
                        <li className="md:pt-2">
                            {data.page.includes("home") ? (
                                <a href="#" className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-400 md:p-0">Home</a>
                            ) : (
                                <a href="/home" className="block py-2 px-3 text-white rounded hover:bg-gray-700 md:hover:bg-transparent md:border-0 md:hover:text-blue-400 md:p-0">Home</a>
                            )}
                        </li>
                        <li className="md:pt-2">
                            {data.page.includes("category") ? (
                                <a href="#" className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-400 md:p-0">Category</a>
                            ) : (
                                <a href="/category" className="block py-2 px-3 text-white rounded hover:bg-gray-700 md:hover:bg-transparent md:border-0 md:hover:text-blue-400 md:p-0">Category</a>
                            )}
                        </li>
                        <li className="md:pt-2">
                            {data.page.includes("product") ? (
                                <a href="#" className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-400 md:p-0">Products</a>
                            ) : (
                                <a href="/product" className="block py-2 px-3 text-white rounded hover:bg-gray-700 md:hover:bg-transparent md:border-0 md:hover:text-blue-400 md:p-0">Products</a>
                            )}
                        </li>
                        <li className="md:pt-2">
                            {data.page.includes("stock") ? (
                                <a href="/stock" className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-400 md:p-0">Stock</a>
                            ) : (
                                <a href="/stock" className="block py-2 px-3 text-white rounded hover:bg-gray-700 md:hover:bg-transparent md:border-0 md:hover:text-blue-400 md:p-0">Stock</a>
                            )}
                        </li>
                        <li className="md:pt-2">
                            {data.page.includes("user") ? (
                                <a href="#" className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-400 md:p-0">User</a>
                            ) : (
                                <a href="/user" className="block py-2 px-3 text-white rounded hover:bg-gray-700 md:hover:bg-transparent md:border-0 md:hover:text-blue-400 md:p-0">User</a>
                            )}
                        </li>
                        <li className="md:pt-2">
                            {data.page.includes("order") ? (
                                <a href="/order" className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-400 md:p-0">Order</a>
                            ) : (
                                <a href="/order" className="block py-2 px-3 text-white rounded hover:bg-gray-700 md:hover:bg-transparent md:border-0 md:hover:text-blue-400 md:p-0">Order</a>
                            )}
                        </li>
                        <li>
                            <button
                                onClick={logout}
                                type="button"
                                className="text-white bg-gradient-to-br from-blue-600 to-blue-800 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>

                {isOpen && (
                    <div className="flex-col md:hidden w-full">
                        <ul className="font-medium flex flex-col p-4 mt-4 border border-gray-700 rounded-lg bg-gray-800">
                            <li>
                                {data.page.includes("home") ? (
                                    <a href="#" className="block py-2 px-3 text-white bg-blue-700 rounded">Home</a>
                                ) : (
                                    <a href="/" className="block py-2 px-3 text-white rounded hover:bg-gray-700">Home</a>
                                )}
                            </li>
                            <li>
                                {data.page.includes("category") ? (
                                    <a href="#" className="block py-2 px-3 text-white bg-blue-700 rounded">Category</a>
                                ) : (
                                    <a href="/category" className="block py-2 px-3 text-white rounded hover:bg-gray-700">Category</a>
                                )}
                            </li>
                            <li>
                                {data.page.includes("product") ? (
                                    <a href="#" className="block py-2 px-3 text-white bg-blue-700 rounded">Products</a>
                                ) : (
                                    <a href="/product" className="block py-2 px-3 text-white rounded hover:bg-gray-700">Products</a>
                                )}
                            </li>
                            <li>
                                {data.page.includes("stock") ? (
                                    <a href="/stock" className="block py-2 px-3 text-white bg-blue-700 rounded">Stock</a>
                                ) : (
                                    <a href="/stock" className="block py-2 px-3 text-white rounded hover:bg-gray-700">Stock</a>
                                )}
                            </li>
                            <li>
                                {data.page.includes("user") ? (
                                    <a href="#" className="block py-2 px-3 text-white bg-blue-700 rounded">User</a>
                                ) : (
                                    <a href="/user" className="block py-2 px-3 text-white rounded hover:bg-gray-700">User</a>
                                )}
                            </li>
                            <li>
                                {data.page.includes("order") ? (
                                    <a href="/order" className="block py-2 px-3 text-white bg-blue-700 rounded">Order</a>
                                ) : (
                                    <a href="/order" className="block py-2 px-3 text-white rounded hover:bg-gray-700">Order</a>
                                )}
                            </li>
                            <li className="mt-2">
                                <button
                                    onClick={logout}
                                    type="button"
                                    className="w-full text-white bg-gradient-to-br from-blue-600 to-blue-800 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                >
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar;