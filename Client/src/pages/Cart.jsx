import { useContext, useEffect, useState } from "react";
import { UserContext } from "../components/UserContext";
import { useNavigate, Link } from "react-router-dom";

import axios from "axios";

function Cart() {
  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  const [cartData, setCartData] = useState(null);
  const [cartTotal, setCartTotal] = useState(0);

  const url = `${process.env.REACT_APP_API_URL}/api/client/cart`;

  const getCart = () => {
    axios.get(url, {params: { c_id: user.c_id }}).then((response) => {
      setCartData(response.data.data);
      let tot = 0;
      response.data.data.forEach(p => {
          tot += p.price * p.qty;
      });
      setCartTotal(tot);
      console.log(response.status, response.data);
    });
  }

  useEffect(() => {
    if (!user.c_id) {
      navigate("/login");
    } else {
      getCart();
    }
  }, []);

  const handleCartQty = (op, p_id, qty) => {
    if (op == false) {
      qty = qty>1 ? qty-1: qty;
    }
    else {
      qty++;
    }
      axios.post(url, {
        c_id: user.c_id,
        p_id: p_id,
        qty: qty,
        type: 2
      })
      .then((res) => {
        getCart();
    });
    
  }

  const handleRemoveCartItem = (p_id) => {
    axios.post(url, {
      c_id: user.c_id,
      p_id: p_id,
      type: 1
    })
    .then((res) => {
      getCart();
  });
  }

  return (
    <>
      <div className="container my-5">
      <h1 className="text-center fw-bold fs-1 mb-5">My Cart</h1>
        {cartTotal > 0 ? (
          cartData.map((p) => {
            return (
              <div className="my-3 p-3 border rounded-3 row d-flex justify-content-evenly">
                <div className="col-3">
                    <img className="img-fluid" src={p.img_link} alt="" />
                </div>
                <div className="col-5 d-flex align-items-center justify-content-end text-end">
                <div>
                <h6 className="">{p.p_name}</h6>
                
                <p className=" fw-bold fs-5 text-primary">
                Rs.{(p.price * p.qty).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                </p>
                <div>
                    <div className="btn-group" role="group" aria-label="Basic example">
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => handleCartQty(false, p.p_id,  p.qty)}>-</button>
                    <button type="button" className="btn btn-outline-primary btn-sm">{ p.qty }</button>
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => handleCartQty(true,  p.p_id, p.qty)}>+</button>
                    </div>
                </div>
                <button className="btn btn-outline-danger mt-3 me-4" onClick={() => handleRemoveCartItem(p.p_id)}><i className="bi bi-trash3-fill"></i></button>
                <Link className="text-decoration-none btn btn-primary mt-3" to={"/product/" + p.p_id}>View Item</Link>
                </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="my-5 py-5 text-center">Cart is Empty</p>
        )}
        {cartTotal > 0 && 
        <div className="row mt-5 d-flex justify-content-evenly">
          <hr/>
            <div className="col-3 fw-bold fs-3 text-primary">Total:</div>
            
            <div className="col-5 d-flex justify-content-end text-end">
            {cartData && <p className=" fw-bold fs-3 text-primary">Rs.{cartTotal.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</p>}
            </div>
        </div>
        }
        
      </div>
    </>
  );
}

export default Cart;
