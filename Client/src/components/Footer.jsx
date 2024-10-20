import { Link } from "react-router-dom";

function Footer(props) {
    return ( 
        <footer className="text-center text-lg-start bg-body-tertiary text-muted">
  
  <section className="border-top pt-1 mt-5">
    <div className="container text-center text-md-start mt-5">
      <div className="row mt-3">
        <div className="col-md-5 col-lg-4 col-xl-3 mx-auto mb-4">
            <h1>
            {props.data.storeName}
            </h1>
          <p>
          FindNShop combines innovative technology with imaginative design to create innovative electrical gadgets that inspire creativity, simplify lives, and empower people. Committed to sustainability, they reimagine possibilities for tomorrow.
          </p>
        </div>
        
        <div className="col-md-4 col-lg-2 col-xl-2 mx-auto mb-4">
          <h6 className="text-uppercase fw-bold mb-4">
            Useful links
          </h6>
          <p>
            <Link to="/" className="text-decoration-none text-muted">Home</Link>
          </p>
          <p>
            <Link to="/products" className="text-decoration-none text-muted">Shop</Link>
          </p>
          <p>
            <Link to="/about" className="text-decoration-none text-muted">About</Link>
          </p>
          <p>
            <Link to="cart" className="text-decoration-none text-muted">Cart</Link>
          </p>
          <p>
            <Link to="wish-list" className="text-decoration-none text-muted">Wish List</Link>
          </p>
        </div>
        <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
          <h6 className="text-uppercase fw-bold mb-4">Contact</h6>
          <p><i className="bi bi-house-fill"></i> UOM, Sri Lanka</p>
          <p>
            <i className="bi bi-envelope-at-fill"></i> e-shop@shop.com
          </p>
          <p><i className="bi bi-telephone-fill"></i> +01 234 567 88</p>
          
        </div>
      </div>
    </div>
  </section>
  <div className="text-center p-4" style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}>
    © 2024 Copyright:
    <Link className="text-decoration-none fw-bold" to="/"> {props.data.storeName}</Link>
    
  </div>
</footer>

     );
}

export default Footer;