import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import { WishlistProvider } from './context/WishlistContext';
import WishlistPage from './pages/WishlistPage';
import OrderTracking from './pages/OrderTracking';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProductPage from './pages/ProductPage';
import Dashboard from './pages/Dashboard';
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
          <Route path="/dashboard"  element={<Dashboard />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/order-tracking" element={<OrderTracking />} />
        </Routes>
        <Footer />
        <SpinWheel />
      </BrowserRouter>
      </WishlistProvider>
    </CartProvider>
    
  );
}

export default App;
