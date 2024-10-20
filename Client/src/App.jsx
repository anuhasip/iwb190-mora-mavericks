import React, { useState, useEffect } from "react";

import NavBar from './components/NavBar';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/user/Home';
import Footer from './components/Footer';

import JsonData from './data.json';
import Products from "./pages/user/Products";
import ProductDetails from "./pages/user/ProductDetails";
import Register from "./pages/user/Register";
import Login from "./pages/user/Login";



import { UserContext } from "./components/UserContext";
import Cart from "./pages/user/Cart";
import Wishlist from "./pages/user/Wishlist";
import About from "./pages/user/About";
import Profile from "./pages/user/Profie";
import NotFound from "./pages/NotFound";
import ShopLogin from "./pages/shop/Login";
import ShopRegister from "./pages/shop/Register";
import Shop from "./pages/shop/Shop";
import ProductsByShop from "./pages/user/ProductsByShop";


function App() {

  const [pageData, setPageData] = useState({});

  const [user, setUser] = useState({c_id: null, fname: null, shop:false})

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
              path="/products/:shop_id"
              element={<ProductsByShop />}
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
              path="/shop-login"
              element={<ShopLogin />}
            />
            <Route
              path="/shop-register"
              element={<ShopRegister />}
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
              path="/shop"
              element={<Shop />}
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
