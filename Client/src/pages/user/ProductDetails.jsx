import { UserContext } from "../../components/UserContext";

import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import axios from "axios";
import { Link } from "react-router-dom";

function ProductDetails() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const { id } = useParams();

  const url = `${process.env.REACT_APP_API_URL}/api/item_details/${id}`;
  const urlwl = `${process.env.REACT_APP_API_URL}/api/client/wish-list`;
  const urlc = `${process.env.REACT_APP_API_URL}/api/client/cart/`;

  const [product, setProduct] = useState(null);

  const [shop, setShop] = useState(null);

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: `${process.env.REACT_APP_GOOGLE_MAP}`,
  });

  const [iswishitem, setIswishitem] = useState(false);

  const [isaddedcart, setIsaddedcart] = useState(false);

  useEffect(() => {
    if (!user.c_id) {
      navigate("/login");
    }

    axios.get(url).then((res) => {
      setProduct(res.data);
      const shop_id = res.data.shop_id;
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/shop_details/${shop_id}`)
        .then((res) => {
          setShop(res.data);

          // Parse location (latitude, longitude) from shop.location
          const [lat, lng] = res.data.location.split(",");
          setLatitude(parseFloat(lat));
          setLongitude(parseFloat(lng));
        });
    });

    // axios.post(urlwl, {
    //     c_id: user.c_id,
    //     p_id: id,
    //     type: 3
    // })
    // .then((res) => setIswishitem(res.data.data.length > 0));
    // axios.post(urlc, {
    //     c_id: user.c_id,
    //     p_id: id,
    //     type: 3
    // })
    // .then((res) => setIsaddedcart(res.data.data.length > 0));
  }, []);

  const handleWishList = () => {
    axios
      .post(urlwl, {
        c_id: user.c_id,
        p_id: id,
        type: iswishitem ? 1 : 0,
      })
      .then((res) => {
        setIswishitem((prevstate) => (prevstate ? false : true));
      });
  };

  const handleCart = () => {
    axios
      .post(urlc, {
        c_id: user.c_id,
        p_id: id,
        qty: 1,
        type: isaddedcart ? 1 : 0,
      })
      .then((res) => {
        setIsaddedcart((prevstate) => (prevstate ? false : true));
      });
  };

  return (
    <div className="container px-5 mt-5">
      <div className="row border rounded-5 py-5 d-flex justify-content-evenly">
        <div className="col-md-4 p-2 text-center">
          <img
            src={product && product.image_url}
            className="img-fluid "
            alt="..."
          />
          {/* <button
            className="btn rounded-pill text-muted"
            onClick={handleWishList}
          >
            <i
              className="bi bi-heart-fill "
              style={iswishitem ? { color: "red" } : {}}
            ></i>
          </button> */}
        </div>
        <div className="col-md-5 p-2 d-flex align-self-center">
          <div className="">
            <h1 className="fs-1">{product && product.item_name}</h1>
            <p className="fw-bold fs-4 text-primary">
              {product &&
                Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "LKR",
                }).format(product.unit_price)}
            </p>

            <p>{product && product.description}</p>
            {/* <button
              className="btn btn-primary rounded-pill fw-bold px-4"
              onClick={handleCart}
            >
              {isaddedcart ? "Added" : "Add To Cart"}{" "}
              <i className="bi bi-cart-fill"></i>
            </button> */}
          </div>
        </div>

        {/* Shop details section */}
        
      {shop && (
        <div className="pt-4 mt-4 border-top">
          
          <div className="row justify-content-evenly">
            <div className="col-md-4 text-center">
              <img src={shop.image_url} className="img-fluid" alt="Shop" />
            </div>
            <div className="col-md-5">
            <h4 className="fs-4">{shop.name}</h4>
              <p>
                <strong>Email:</strong> {shop.email}
              </p>
              <p>
                <strong>Description:</strong> {shop.description}
              </p>
              <Link
                to={{
                  pathname: `/products/${product.shop_id}`
                }}
                className="btn btn-primary rounded-pill fw-bold px-4"
              >
                Browse Products
              </Link>

              
            </div>
            <div className="px-5">
                {/* Google Map */}
              {isLoaded && latitude && longitude && (
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
        </div>
      )}

      </div>

      
    </div>
  );
}

export default ProductDetails;
