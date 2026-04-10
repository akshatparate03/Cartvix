import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import AdminProduct from "./pages/AdminProduct";

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const location = useLocation();

  // When navigated from ProductDetail category badge, pick up the state
  useEffect(() => {
    if (location.state?.category) {
      setSelectedCategory(location.state.category);
      // Clear the state so it doesn't re-trigger on re-renders
      window.history.replaceState({}, "");
    }
  }, [location.state]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--surface)",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />
      <div
        className="lg:pl-64 pt-16"
        style={{ flex: 1, display: "flex", flexDirection: "column" }}
      >
        <main
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "2rem 1rem",
            width: "100%",
            flex: 1,
          }}
        >
          <Routes>
            <Route
              path="/"
              element={<Home selectedCategory={selectedCategory} />}
            />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin/add-product" element={<AdminProduct />} />
            <Route path="/admin/edit-product/:id" element={<AdminProduct />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "rgba(20,20,22,0.95)",
                color: "#f0ede8",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(20px)",
                fontFamily: '"Cabinet Grotesk", sans-serif',
                fontSize: 13,
                borderRadius: 12,
                boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
              },
              success: {
                iconTheme: { primary: "#ff3621", secondary: "white" },
              },
              duration: 3000,
            }}
          />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/*" element={<AppLayout />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
