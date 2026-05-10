import { createContext, useContext, useState, useEffect } from "react";
import axios from "../utils/axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const { token, user } = useAuth();

  useEffect(() => {
    if (user && token) fetchCart();
  }, [user, token]);

  useEffect(() => {
    setCartCount(cartItems.reduce((sum, i) => sum + i.quantity, 0));
  }, [cartItems]);

  const fetchCart = async () => {
    try {
      const res = await axios.get("/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data || []);
    } catch {
      setCartItems([]);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      await axios.post(
        "/cart/add",
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      await fetchCart();
    } catch (e) {
      throw e;
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    // Optimistic update — UI changes instantly
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === cartItemId ? { ...item, quantity } : item,
      ),
    );
    try {
      await axios.put(
        `/cart/update/${cartItemId}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } catch (e) {
      // Rollback on failure
      await fetchCart();
      throw e;
    }
  };

  const removeFromCart = async (cartItemId) => {
    // Optimistic update
    setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
    try {
      await axios.delete(`/cart/remove/${cartItemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (e) {
      // Rollback on failure
      await fetchCart();
      throw e;
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete("/cart/clear", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems([]);
    } catch {}
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
