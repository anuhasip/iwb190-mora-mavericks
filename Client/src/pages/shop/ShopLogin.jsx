import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../components/UserContext";

function ShopLogin() {
  const {setUser} = useContext(UserContext)
  const [login, setLogin] = useState({ email: "", password: "" });
  const [logerr, setLogerr] = useState("");
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    setLogin({ ...login, [e.target.id]: e.target.value });
  };

  const url = `${process.env.REACT_APP_API_URL}/api/login`;

  const handleSubmit = (e) => {
    if (login.email == "" || login.password.length < 8)
    {
      setLogerr("Please Enter valid Email or Password");
      return ;
    }
    e.preventDefault();
    axios
      .post(url, login)
      .then((response) => {
        console.log(response.status, response.data);
        if (!response.data.login) {
          setLogerr(response.data.message);
        } else {
          setUser({c_id: response.data.c_id, fname: response.data.user_name});
          navigate("/");
        }
      })
      .catch((error) => {
        setLogerr(error.response.data.message);
        console.log(error.response.data.message);
      });
  };

  return (
    <div
      style={{ maxWidth: "500px", margin: "50px auto" }}
      className="container"
    >
      <div className="mb-5 row">
        <h1 className="display-4 text-center fw-semibold">Shop Login</h1>
      </div>
      <div className="mb-3 mx-1 row">
        <input
          type="text"
          className="form-control"
          maxLength={255}
          placeholder="Email Address"
          id="email"
          value={login.email}
          onChange={handleOnChange}
        />
      </div>
      <div className="mb-3 mx-1 row">
        <input
          type="password"
          className="form-control"
          maxLength={16}
          placeholder="Password"
          id="password"
          value={login.password}
          onChange={handleOnChange}
        />
      </div>
      <div className="row mb-4">
        <div className="col">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              value=""
              id="form2Example31"
            />
            <label className="form-check-label" htmlFor="form2Example31">
              {" "}
              Remember me{" "}
            </label>
          </div>
        </div>

        <div className="col text-end">
          <Link to="/forgot-password" className="text-decoration-none">
            Forgot password?
          </Link>
        </div>
      </div>

      <div className="mb-3 row">
        <button
          className="btn btn-primary"
          style={{ maxWidth: "200px", margin: "auto" }}
          onClick={handleSubmit}
        >
          Login
        </button>
        <p className="text-danger text-center ">
          <small>{logerr}</small>
        </p>
      </div>
      <div className="mb-3 row text-center">
        <p>
          Not a member?{" "}
          <Link to="/shop-register" className="text-decoration-none">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ShopLogin;
