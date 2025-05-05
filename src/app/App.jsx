import { Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Home from "../pages/HomePage/Home";
import Type from "../pages/TypePage/Type";
import Pets from "../pages/PetsPage/Pets";
import Stock from "../pages/StockPage/Stock";
import User from "../pages/UserPage/User";
import Order from "../pages/OderPage/Order";
import Login from "../pages/loginPage/Login";

function App() {
  return (
    <Routes>
      <Route path="/*" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/type" element={<Type />} />
      <Route path="/pets" element={<Pets />} />
      <Route path="/stock" element={<Stock />} />
      <Route path="/user" element={<User />} />
      <Route path="/order" element={<Order />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
