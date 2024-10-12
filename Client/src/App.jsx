import React, { useState, useEffect } from "react";

import NavBar from './components/NavBar';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Footer from './components/Footer';

import JsonData from './data.json';
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Register from "./pages/Register";
import Login from "./pages/Login";



import { UserContext } from "./components/UserContext";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import About from "./pages/About";
import Profile from "./pages/Profie";
import NotFound from "./pages/NotFound";


function App() {

  const [pageData, setPageData] = useState({});

  const [user, setUser] = useState({c_id: null, fname: null})

  useEffect(() => {
    setPageData(JsonData);
  }, []);

  return (
    <>
    <UserContext.Provider value={{ user, setUser }}>
    <BrowserRouter>
      <NavBar data={pageData}/>
          <Routes>
            <Route
              path="/"
              element={<Home/>}
            />
            <Route
              path="/products"
              element={<Products />}
            />
            <Route
              path="/product/:id"
              element={<ProductDetails />}
            />
            <Route
              path="/register"
              element={<Register />}
            />
            <Route
              path="/login"
              element={<Login />}
            />
            <Route
              path="/cart"
              element={<Cart />}
            />
            <Route
              path="/wish-list"
              element={<Wishlist />}
            />
            <Route
              path="/about"
              element={<About />}
            />
            <Route
              path="/profile"
              element={<Profile />}
            />
            <Route
              path="*"
              element={<NotFound />}
            />
          </Routes>
          <Footer data={pageData}/>
      </BrowserRouter>
      </UserContext.Provider>
    </>
  );
}

export default App;
