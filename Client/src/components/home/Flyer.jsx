import { Link } from "react-router-dom";

function Flyer() {
    return ( 
        <div className="row bg-primary bg-gradient rounded-5 py-2 px-5" >
            <div className="col-md-4">
            <img
                src="flyer.svg"
                className="img-fluid my-5"
                alt="..."
            />
            </div>
            <div className="col-md-8 text-light mt-5 text-end">
                <h1 className="fw-bold" style={{fontSize: "7vw"}}>30% Off</h1>
                <p className="text-end">Revolutionize your tech arsenal with our state-of-the-art devices, now available at an incredible 30% discount! Dive into a world of innovation and savings as you explore our curated selection of laptops, smartphones, and more. Upgrade your digital lifestyle today and seize the opportunity to save big. Don't wait, shop now and transform the way you connect and create!</p>
                <Link to="/products" className="btn btn-light rounded-pill px-5 fw-bold text-primary">Explore</Link>
            </div>
        </div>
     );
}

export default Flyer;