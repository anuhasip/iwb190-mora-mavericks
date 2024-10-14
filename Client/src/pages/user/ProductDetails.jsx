import { UserContext } from "../../components/UserContext";

import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";

function ProductDetails() {
    const {user} = useContext(UserContext);
    const navigate = useNavigate();

    const { id } = useParams();

    const url = `${process.env.REACT_APP_API_URL}/api/item_details/${id}`;
    const urlwl = `${process.env.REACT_APP_API_URL}/api/client/wish-list`;
    const urlc = `${process.env.REACT_APP_API_URL}/api/client/cart/`;
    
    const [product, setProduct] = useState(null);

    const [iswishitem, setIswishitem] = useState(false);

    const [isaddedcart, setIsaddedcart] = useState(false);

    useEffect(() => {
        if (!user.c_id)
        {
            navigate("/login");
        }
        
        axios.get(url).then((res) => setProduct(res.data));
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
        axios.post(urlwl, {
            c_id: user.c_id,
            p_id: id,
            type: iswishitem ? 1 : 0
          })
          .then((res) => {
            setIswishitem(prevstate => prevstate ? false : true);
        });
    }

    const handleCart = () => {
        axios.post(urlc, {
            c_id: user.c_id,
            p_id: id,
            qty: 1,
            type: isaddedcart ? 1 : 0
          })
          .then((res) => {
            setIsaddedcart(prevstate => prevstate ? false : true);
        });
    }

    return ( 
        <div className="container px-5 mt-5">
        <div className="row border rounded-5 p-1 d-flex justify-content-evenly">
            <div className="col-md-4 p-2 text-center">
                <img src={product && product.image_url} className="img-fluid " alt="..." />
                <button className="btn rounded-pill text-muted" onClick={handleWishList}><i className="bi bi-heart-fill " style={iswishitem ? {color: "red"} : {}}></i></button>
            </div>
            <div className="col-md-5 p-2 d-flex align-self-center">
                <div className="">
                    <h6 className="fs-5">{product && product.item_name}</h6>
                    <p className="fw-bold fs-4 text-primary">
                        Rs.{product && product.unit_price.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                    </p>
                    
                    <p>{product && product.description}</p>
                    <button className="btn btn-primary rounded-pill fw-bold px-4" onClick={handleCart}>{isaddedcart ? "Added" : "Add To Cart"} <i className="bi bi-cart-fill"></i></button>
                    
                </div>
            </div>
        </div>
        </div>
     );
}

export default ProductDetails;