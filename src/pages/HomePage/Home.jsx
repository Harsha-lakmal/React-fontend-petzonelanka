import React from "react"
import Navbar from "../../components/Navbar/Navbar";
import img from "../../assets/pettype.png";
import pro from "../../assets/pet.png";
import sto from "../../assets/stock.png";
import ord from "../../assets/orders.png";
import cre from "../../assets/createorder.png";
import use from "../../assets/users.png";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  
  const menuItems = [
    { id: 1, title: "Pet Type", image: img, path: "/type" },
    { id: 2, title: "Pets ", image: pro, path: "/pets" },
    { id: 3, title: "Stock", image: sto, path: "/stock" },
    { id: 4, title: "Orders", image: ord, path: "/order/orders" },
    { id: 5, title: "Create Order", image: cre, path: "/order" },
    { id: 6, title: "Users", image: use, path: "/user" }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-blue-50">
      <div className="bg-violet-600 shadow-lg">
        <Navbar page="home" />
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
           <p className="text-lg text-violet-600">Manage your inventory and orders</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {menuItems.map((item) => (
            <div 
              key={item.id}
              onClick={() => navigate(item.path)} 
              className="cursor-pointer bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:transform hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="mb-4 p-4 bg-violet-100 rounded-full">
                <img 
                  className="h-20 w-20 object-contain" 
                  src={item.image} 
                  alt={item.title} 
                />
              </div>
              <h2 className="text-xl font-semibold text-violet-700">{item.title}</h2>
              <p className="mt-2 text-sm text-violet-500 hover:text-violet-700 transition-colors">
                Click to access
              </p>
              <div className="mt-4 w-12 h-1 bg-violet-300 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
      
     
      <footer className="mt-16 py-6 bg-violet-600 text-white text-center">
        <p>© {new Date().getFullYear()} MagaMarketLK. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;