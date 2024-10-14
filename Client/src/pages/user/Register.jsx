import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [register, setRegister] = useState({ email: "", password: "", first_name: "", last_name: "", DOB: "", address: "", phone_number: "" });
  const [regerr, setRegerr] = useState("");
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    if (e.target.id == "phone_number") {
        var regex = /^(?:|\d+)$/;
        if (!regex.test(e.target.value)) {
          return;
        }
      }
    setRegister({ ...register, [e.target.id]: e.target.value });
    document.getElementById(e.target.id).style.borderColor = "#ccc";
    console.log(register);
  };

  const url = `${process.env.REACT_APP_API_URL}/api/signup`;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formValidation())
    {
    axios
      .post(url, register)
      .then((response) => {
        console.log(response.status, response.data);
        navigate("/login");
      })
      .catch((error) => {
        setRegerr(error.response.data.message);
        console.log(error);
      });
    }
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const formValidation = () => {
    let flag = true;
    Object.keys(register).forEach((key) => {
      const value = register[key];
      if (value === "") {
        document.getElementById(key).style.borderColor = "#ff0000";
        flag = false;
      }
      if (key == ("email")) {
        if (!validateEmail(value)) {
          document.getElementById(key).style.borderColor = "#ff0000";
          flag = false;
        }
      }
      if (key == ("phone_number")) {
        if (value.length != 10) {
          document.getElementById(key).style.borderColor = "#ff0000";
          flag = false;
        }
      }
      
      //console.log(`Key: ${key}, Value: ${value}`);
    });

    return flag;
  };

  return (
    <div
      style={{ maxWidth: "500px", margin: "50px auto" }}
      className="container"
    >
      <div className="mb-5 row">
        <h1 className="display-4 text-center fw-semibold">Register</h1>
      </div>
      <div className="mb-3 mx-1 row">
        <input
          type="text"
          className="form-control"
          maxLength={255}
          placeholder="Email Address"
          id="email"
          value={register.email}
          onChange={handleOnChange}
        />
      </div>
      <div className="mb-3 mx-1 row">
        <input
          type="text"
          className="form-control"
          maxLength={255}
          placeholder="First Name"
          id="first_name"
          value={register.first_name}
          onChange={handleOnChange}
        />
      </div>
      <div className="mb-3 mx-1 row">
        <input
          type="text"
          className="form-control"
          maxLength={255}
          placeholder="Last Name"
          id="last_name"
          value={register.last_name}
          onChange={handleOnChange}
        />
      </div>
      <div className="mb-3 mx-1 row">
        <input
          type="date"
          className="form-control"
          placeholder="Date Of Birth"
          id="DOB"
          value={register.DOB}
          onChange={handleOnChange}
        />
      </div>
      <div className="mb-3 mx-1 row">
        <input
          type="text"
          className="form-control"
          maxLength={255}
          placeholder="Address"
          id="address"
          value={register.address}
          onChange={handleOnChange}
        />
      </div>
      <div className="mb-3 mx-1 row">
        <input
          type="text"
          className="form-control"
          maxLength={10}
          placeholder="Phone Number"
          id="phone_number"
          value={register.phone_number}
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
          value={register.password}
          onChange={handleOnChange}
        />
      </div>
      

      <div className="mb-3 row">
        <button
          className="btn btn-primary mt-2"
          style={{ maxWidth: "200px", margin: "auto" }}
          onClick={handleSubmit}
        >
          Register
        </button>
        <p className="text-danger text-center ">
          <small>{regerr}</small>
        </p>
      </div>
      <div className="mb-3 row text-center">
        <p>
          Already a member?{" "}
          <Link to="/login" className="text-decoration-none">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
