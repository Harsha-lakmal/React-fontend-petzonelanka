import { Routes, Route } from "react-router-dom";
import Home from "../pages/HomePage/Home";
import Type from "../pages/TypePage/Type";
import Pets from "../pages/PetsPage/Pets";
import Stock from "../pages/StockPage/Stock";
import User from "../pages/UserPage/User";
import Login from "../pages/loginPage/Login";
import Vlogs from "../pages/VlogPage/Vlog";

function App() {
  return (
    <Routes>
      <Route path="/*" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/type" element={<Type />} />
      <Route path="/pets" element={<Pets />} />
      <Route path="/stock" element={<Stock />} />
      <Route path="/user" element={<User />} />
      <Route path="/vlog" element={<Vlogs />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
