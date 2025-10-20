import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import Protected from "./components/Protected.jsx";
import AdminOrders from "./pages/admin/Orders.jsx";
import FreeShippingPage from "./pages/FreeShippingPage";
import EasyReturnsPage from "./pages/EasyReturnsPage";
import PaymentsPage from "./pages/PaymentsPage";
import SupportPage from "./pages/SupportPage";
import AdminGuard from "./components/AdminGuard.jsx";
import AdminProducts from "./pages/admin/Products.jsx";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/checkout"
          element={
            <Protected>
              <Checkout />
            </Protected>
          }
        />
        <Route path="/admin/orders" element={<AdminOrders />} />

        <Route
          path="/profile"
          element={
            <Protected>
              <Profile />
            </Protected>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/admin/products"
          element={
            <AdminGuard>
              <AdminProducts />
            </AdminGuard>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/deals/free-shipping" element={<FreeShippingPage />} />
        <Route path="/deals/easy-returns" element={<EasyReturnsPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/support" element={<SupportPage />} />
      </Routes>
    </Layout>
  );
}
