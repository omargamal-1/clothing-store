import StyleAssistant from './components/StyleAssistant';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProductPage from './pages/ProductPage';
import Dashboard from './pages/Dashboard';
import WishlistPage from './pages/WishlistPage';
import OrderTracking from './pages/OrderTracking';
import SpinWheel from './components/SpinWheel';

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/shop"       element={<Shop />} />
          <Route path="/cart"       element={<Cart />} />
          <Route path="/checkout"   element={<Checkout />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/dashboard"  element={<Dashboard />} />
          <Route path="/order-tracking" element={<OrderTracking />} />
          <Route path="/wishlist" element={<WishlistPage />} />
        </Routes>
        <Footer />
        <SpinWheel />
        <StyleAssistant />
      </BrowserRouter>
      </WishlistProvider>
    </CartProvider>
    
  );
}

export default App;
