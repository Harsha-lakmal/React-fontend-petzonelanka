import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import img from "../../assets/pettype.png";
import pro from "../../assets/pet.png";
import sto from "../../assets/stock.png";
import cre from "../../assets/vlog.png";
import use from "../../assets/users.png";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  
  const menuItems = [
    { id: 1, title: "Pet Type", image: img, path: "/type" },
    { id: 2, title: "Pets", image: pro, path: "/pets" },
    { id: 3, title: "Stock", image: sto, path: "/stock" },
    { id: 5, title: "Vlog", image: cre, path: "/vlog" },
    { id: 6, title: "Users", image: use, path: "/user" }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-blue-50 flex flex-col">
      <div className="bg-violet-600 shadow-lg">
        <Navbar page="home" />
      </div>
      
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-violet-800 mb-2">Dashboard</h1>
          <p className="text-lg text-violet-600 font-medium">Manage your inventory and orders</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {menuItems.map((item) => (
            <div 
              key={item.id}
              onClick={() => navigate(item.path)} 
              className="cursor-pointer bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:transform hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center group"
            >
              <div className="mb-6 p-5 bg-violet-100 rounded-full group-hover:bg-violet-200 transition-colors duration-300">
                <img 
                  className="h-20 w-20 object-contain" 
                  src={item.image} 
                  alt={item.title} 
                />
              </div>
              <h2 className="text-2xl font-bold text-violet-800 group-hover:text-violet-900 transition-colors">
                {item.title}
              </h2>
              <p className="mt-3 text-sm text-violet-500 group-hover:text-violet-700 transition-colors">
                Click to access
              </p>
              <div className="mt-6 w-16 h-1.5 bg-violet-300 rounded-full group-hover:bg-violet-400 transition-colors"></div>
            </div>
          ))}
        </div>
      </div>
      
      <footer className="py-6 bg-gradient-to-r from-violet-600 to-violet-800 text-white text-center">
        <div className="container mx-auto px-4">
          <p className="text-sm md:text-base">
            © {new Date().getFullYear()} PetZonLanka. All rights reserved.
          </p>
          <p className="mt-2 text-xs text-violet-200">
            Designed with care for your pet management needs
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;