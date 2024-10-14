import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../components/UserContext";
import { useNavigate, Link } from "react-router-dom";

import axios from "axios";

function Cart() {
  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  const [wishListData, setWishListData] = useState([]);

  const url = `${process.env.REACT_APP_API_URL}/api/client/wish-list`;

  useEffect(() => {
    if (!user.c_id) {
      navigate("/login");
    } else {
      axios.get(url, {params: { c_id: user.c_id }}).then((response) => {
        setWishListData(response.data.data);
        console.log(response.status, response.data);
      });
    }
  }, []);

  return (
    <>
      <div className="container my-5">
      <h1 className="text-center fw-bold fs-1 mb-5">Wish List</h1>
      <div className="row">
        {wishListData.length > 0 ? (
          wishListData.map((p) => {
            return (
                <div className="col-lg-3 col-md-4 col-6 ">
                <Link to={"/product/" + p.p_id} className="card text-decoration-none mt-4">
                  <img src={p.img_link} className="card-img-top" alt="..." />
                  <div className="card-body">
                    <h6 className="card-title">{p.p_name}</h6>
                    <p className="card-text fw-bold fs-5 text-primary">
                      Rs.{p.price.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                    </p>
                  </div>
                </Link>
                </div>
            );
          })
        ) : (
          
          <p className="my-5 py-5 text-center">Cart is Empty</p>
          
        )}
      </div>
      </div>
    </>
  );
}

export default Cart;
