import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";


const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '400px',
};
const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

function Register() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyD47tgfGBWU0eZol01gO3Nz0TyFObCojL8", 
    libraries,
  });

  const [register, setRegister] = useState({
    email: "",
    password: "",
    name: "",
    image_url:"",
    
    location: "",
    description:"" 
  });
  const [regerr, setRegerr] = useState("");
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState({
    lat: 6.927079,
    lng: 79.861244,
  });
  
  

  
  const handleSelect = async (value) => {
    setAddress(value);
    try {
      const results = await geocodeByAddress(value);
      const latLng = await getLatLng(results[0]);
      setCoordinates(latLng);
      setRegister({
        ...register,
        location: `${latLng.lat},${latLng.lng}`, // store lat,lng as a comma-separated string
        
      });
      console.log(register.location);
    } catch (error) {
      console.error("Error fetching geolocation: ", error);
    }
  };

  if (!isLoaded) return <div>Loading Maps...</div>;
  
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

  const url = `${process.env.REACT_APP_API_URL}/api/shop_signup`;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formValidation())
    {
    axios
      .post(url, register)
      .then((response) => {
        console.log(response.status, response.data);
        navigate("/shop-login");
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
      const inputElement = document.getElementById(key);

      if (!inputElement) {
        console.warn(`No element found with id: ${key}`);
        return;
      }
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
          placeholder="Shop Name"
          id="name"
          value={register.name}
          onChange={handleOnChange}
        />
      </div>
      <div className="mb-3 mx-1 row">
        <input
          type="url"
          className="form-control"
          maxLength={255}
          placeholder="Image Url"
          id="image_url"
          value={register.image_url}
          onChange={handleOnChange}
        />
      </div>
      <div className="mb-3 mx-1 row">
        <textarea
          className="form-control"
          maxLength={255}
          placeholder="Description"
          id="description"
          
          onChange={handleOnChange}
        >{register.description}
            </textarea>
      </div>
       {/* Location Autocomplete Input */}
       <div className="mb-3 mx-1 row">
        <p>Find a Location</p>
        <PlacesAutocomplete value={address} onChange={setAddress} onSelect={handleSelect}>
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div>
              <input
                {...getInputProps({
                  placeholder: "Type an address",
                })}
                className="address-input form-control"
                style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
              />
              <div>
                {loading && <div>Loading suggestions...</div>}
                {suggestions.map((suggestion) => {
                  const style = {
                    backgroundColor: suggestion.active ? "#41b6e6" : "#fff",
                    cursor: "pointer",
                    padding: "10px",
                  };
                  return (
                    <div {...getSuggestionItemProps(suggestion, { style })} key={suggestion.placeId}>
                      {suggestion.description}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>

        {/* Google Map showing the selected location */}
        <GoogleMap mapContainerStyle={mapContainerStyle} zoom={12} center={coordinates} options={options}>
          <Marker position={coordinates} />
        </GoogleMap>
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
