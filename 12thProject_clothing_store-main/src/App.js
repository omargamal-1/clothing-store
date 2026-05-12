import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
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
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/shop"       element={<Shop />} />
          <Route path="/cart"       element={<Cart />} />
          <Route path="/checkout"   element={<Checkout />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/dashboard"  element={<Dashboard />} />
        </Routes>
        <Footer />
        <SpinWheel />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
