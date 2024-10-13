import { useContext, useEffect, useState } from "react";
import { UserContext } from "../components/UserContext";
import { useNavigate, Link } from "react-router-dom";

import axios from "axios";

function Profile() {
    const { user } = useContext(UserContext);

    const navigate = useNavigate();
  
    const [clientData, setClientData] = useState(null);
  
    const url = `${process.env.REACT_APP_API_URL}/api/user_details/${user.c_id}`;
  
    const getClientDetails = () => {
      axios.get(url).then((response) => {
        setClientData(response.data);
        console.log(response.status, response.data);
      });
    }
  
    useEffect(() => {
      if (!user.c_id) {
        navigate("/login");
      } else {
        getClientDetails();
      }
    }, []);
    return ( 
        <div className="container my-5">
            <h1 className="text-center fw-bold fs-1 mb-5">My Profile</h1>
            {clientData && (
                <div className="container-fluid">
                    <table style={{width: "50%", minWidth: "300px", margin: "auto"}}>
                        <tr>
                            <td className="pb-3 text-start fw-bold">First Name</td>
                            <td className="pb-3 text-end">{clientData.first_name}</td>
                        </tr>
                        <tr>
                            <td className="pb-3 text-start fw-bold">Last Name</td>
                            <td className="pb-3 text-end">{clientData.last_name}</td>
                        </tr>
                        <tr>
                            <td className="pb-3 text-start fw-bold">Email</td>
                            <td className="pb-3 text-end">{clientData.email}</td>
                        </tr>
                        <tr>
                            <td className="pb-3 text-start fw-bold">Phone Number</td>
                            <td className="pb-3 text-end">{clientData.phone_number}</td>
                        </tr>
                        <tr>
                            <td className="pb-3 text-start fw-bold">Date Of Birth</td>
                            <td className="pb-3 text-end">{clientData.DOB.slice(0,10)}</td>
                        </tr>
                        <tr>
                            <td className="pb-3 text-start fw-bold">Address</td>
                            <td className="pb-3 text-end">{clientData.address}</td>
                        </tr>
                        
                    </table>
                </div>
            )
            }
        </div>
     );
}

export default Profile;