import { Link } from "react-router-dom";

import { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { UserContext } from "./UserContext";

function NavBar(props) {
  const { pathname } = useLocation();
  const { user } = useContext(UserContext);

  // Automatically scrolls to top whenever pathname changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container px-5 fw-bold">
          <Link to="/" className="navbar-brand fs-2 text-primary">
            {props.data.storeName}
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/products" className="nav-link">
                  Products
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">
                  About
                </Link>
              </li>
            </ul>
            {/* <form className="d-flex" role="search">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn btn-outline-success" type="submit">
                Search
              </button>
            </form> */}
            <div className="d-flex">
              {/* <Link to="/cart" className="btn">
                <i className="bi bi-cart-fill"></i>
              </Link>
              <Link to="/wish-list" className="btn">
                <i className="bi bi-heart-fill"></i>
              </Link> */}

              {user.c_id == null && (
                <Link to="/login" className="btn btn-primary">
                  {" "}
                  Login / Register{" "}
                </Link>
              )}
              {user.c_id != null && user.shop == false && (
                <Link to="/profile" className="btn text-decoration-none">
                  <i className="bi bi-person-circle"></i> {user.fname}{" "}
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavBar;
