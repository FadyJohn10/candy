import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import CartPage from './pages/CartPage';
import SiteNavbar from './components/SiteNavbar';
import SiteFooter from './components/SiteFooter';

export default function App() {
  return (
    <>
      <SiteNavbar />
      <div className="container my-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </div>
      <SiteFooter />
    </>
  );
}
