import { Link } from "react-router-dom";

function Category(props) {
  return (
    <div className={props.bgcolor + " card text-white rounded-5 mt-4"} style={{height: "320px"}}>
      <img
        src={props.img}
        className="img-fluid card-img rounded-5"
        alt="..."
        style={{height: "320px"}}
      />
      <div className="card-img-overlay">
        <div className="card-title position-absolute bottom-0 start-0 ms-3 mb-5">
        <p className="fs-6 opacity-50 mb-0">Enjoy</p>
        <p className="fs-4 mb-0">With</p>
        <p className="fs-1 fw-bold opacity-50 mb-1">{props.txt}</p>
        <Link to={{pathname: '/products' ,search: `?category=${props.txt}`,}} className="btn btn-light rounded-pill fw-bold px-4">
          Browse
        </Link>
        </div>
        
      </div>
    </div>
  );
}

export default Category;
