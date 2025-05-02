import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Category from './pages/category';
import Product from './pages/product';
import OrderHome from './pages/order/OrderHome';
import Orders from './pages/order/Orders';
import CreateOrder from './pages/order/CreateOrder';
import Stock from './pages/stock';
import User from './pages/user';
import Login from './pages/login/Login';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoute />}>
          <Route path='/*' element={<Login />} />
            <Route path='/home' element={<Home />} />
            <Route path='/category' element={<Category />} />
            <Route path='/product' element={<Product />} />
            <Route path='/order' element={<OrderHome />} />
            <Route path='/order/orders' element={<Orders />} />
            <Route path='/order/createorder' element={<CreateOrder />} />
            <Route path='/stock' element={<Stock />} />
            <Route path='/user' element={<User />} />
            <Route path='/error' element={<NotFoundPage />} />
          </Route>
          <Route path='/login' element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>

  );
}

export default App;