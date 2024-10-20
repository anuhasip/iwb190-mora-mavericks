import Product from "../../components/products/Product";

import { UserContext } from "../../components/UserContext";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

function ProductsByShop() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const { shop_id } = useParams();

  const [products, setProducts] = useState(null);
  const [shop, setShop] = useState(null);

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: `${process.env.REACT_APP_GOOGLE_MAP}`,
  });

  const fetchInfo = () => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/api/item_details_by_shop/${shop_id}`
      )
      .then((res) => setProducts(res.data));
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/shop_details/${shop_id}`)
      .then((res) => {
        setShop(res.data);

        // Parse location (latitude, longitude) from shop.location
        const [lat, lng] = res.data.location.split(",");
        console.log(lat, lng);
        setLatitude(parseFloat(lat));
        setLongitude(parseFloat(lng));
      });;
  };

  useEffect(() => {
    if (!user.c_id) {
      navigate("/login");
    } else {
      fetchInfo();
    }
  }, []);

  return (
    <>
      <div className="container px-md-5 mt-3">
        {/* Shop details section */}
        {shop && (
          <div className="mt-5">
            <h1 className="text-center fw-bold fs-1 mb-5">{shop.name}</h1>
            <div className="row justify-content-center">
              <div className="col-md-4 text-center">
                <img src={shop.image_url} className="img-fluid" alt="Shop" />
              </div>
              <div className="col-md-5">
                <p>
                  <strong>Email:</strong> {shop.email}
                </p>
                <p>
                  <strong>Description:</strong> {shop.description}
                </p>
              </div>
            </div>
          </div>
        )}
        <h1 className="text-center fw-bold fs-1 mt-5">Our Products</h1>
        <p className="text-secondary text-center">Explore Our Products</p>

        <div className="row">
          {products
            ? products.map((product) => {
                return (
                  <Product
                    key={product.item_id}
                    p_id={product.item_id}
                    p_name={product.item_name}
                    price={product.unit_price}
                    img_link={product.image_url}
                  />
                );
              })
            : "Loading..."}
          {products && products.length == 0 && (
            <p className="p-5 text-center">No Products Found!</p>
          )}
        </div>
        <div>
          {/* Google Map */}
          {shop && isLoaded && latitude && longitude && (
            <div className="mt-4">
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "400px" }}
                center={{ lat: latitude, lng: longitude }}
                zoom={15}
              >
                <Marker position={{ lat: latitude, lng: longitude }} />
              </GoogleMap>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ProductsByShop;
