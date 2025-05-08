import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import logo from "../../assets/petzonlk.png";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [activePage, setActivePage] = useState("home");
  const navigate = useNavigate();

  useEffect(() => {
    const currentPath = location.pathname.split("/")[1] || "home";
    setActivePage(currentPath);
  }, [location]);

  const handleNavClick = (page) => {
    setActivePage(page);
    setIsOpen(false);
  };

  const logout = () => {
    console.log("Logging out...");

    localStorage.removeItem("authToken");

    navigate("/login");
  };

  const navItems = [
    { name: "Home", path: "/home", page: "home" },
    { name: "Type", path: "/type", page: "type" }, // Fixed typo in "Type"
    { name: "Pets", path: "/pets", page: "pets" },
    { name: "Stock", path: "/stock", page: "stock" },
    { name: "User", path: "/user", page: "user" },
    { name: "Vlog", path: "/vlog", page: "vlog" },
  ];

  return (
    <nav className="sticky top-0 bg-gray-900 border-gray-200 z-50">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
          onClick={() => handleNavClick("home")}
        >
          <img
            className="w-10 h-10"
            src={logo}
            alt="PetZone Logo"
            style={{ borderRadius: 50 }}
          />
          <span className="self-center text-xl font-bold whitespace-nowrap text-white hover:text-blue-500 transition-colors duration-300 font-sans">
            PetZone - Lanka
          </span>
        </a>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg md:hidden hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded={isOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>

        <div className="hidden w-full md:block md:w-auto">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-700 rounded-lg bg-gray-800 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-gray-900">
            {navItems.map((item) => (
              <li key={item.page}>
                <a
                  href={item.path}
                  onClick={() => handleNavClick(item.page)}
                  className={`block py-2 px-3 rounded md:border-0 md:p-0 ${
                    activePage === item.page
                      ? "text-blue-400"
                      : "text-white hover:text-blue-400"
                  } transition-colors duration-200`}
                >
                  {item.name}
                </a>
              </li>
            ))}
            <li>
              <button
                onClick={logout}
                type="button"
                className="text-white bg-gradient-to-br from-blue-600 to-blue-800 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-200"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>

        {isOpen && (
          <div className="w-full md:hidden">
            <ul className="font-medium flex flex-col p-4 mt-4 border border-gray-700 rounded-lg bg-gray-800">
              {navItems.map((item) => (
                <li key={item.page}>
                  <a
                    href={item.path}
                    onClick={() => handleNavClick(item.page)}
                    className={`block py-2 px-3 rounded ${
                      activePage === item.page
                        ? "bg-blue-700 text-white"
                        : "text-white hover:bg-gray-700"
                    }`}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
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
  );
}

export default Navbar;
