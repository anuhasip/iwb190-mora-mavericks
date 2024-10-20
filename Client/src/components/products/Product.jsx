import { Link } from "react-router-dom";

function Product(props) {
  return (
    <div className="col-lg-3 col-md-4 col-6 d-flex align-items-stretch">
    <Link to={"/product/" + props.p_id} className="card text-decoration-none mt-4">
      <img src={props.img_link} className="card-img-top" alt="..." />
      <div className="card-body">
        <h6 className="card-title">{props.p_name}</h6>
        <p className="card-text fw-bold fs-5 text-primary">
          {Intl.NumberFormat('en-IN', { style: 'currency', currency: 'LKR' }).format(props.price)}
        </p>
      </div>
    </Link>
    </div>
  );
}

export default Product;
