function Carousel() {
    return ( 

        <div id="carouselExampleAutoplaying" className="carousel slide carousel-fade" data-bs-ride="carousel">
  <div className="carousel-inner">
    <div className="carousel-item active">
      <img src="car1.png" className="d-block w-100 rounded-5" alt="..." style={{minHeight:"500px"}}/>
      <div className="carousel-caption d-block">
        <h5 style={{fontSize: "8vw"}} className="opacity-50">Find Shops Online</h5>
        <p>Find everything you need at one place.</p>
      </div>
    </div>
    <div className="carousel-item">
      <img src="car2.png" className="d-block w-100 rounded-5" alt="..." style={{minHeight:"500px"}}/>
      <div className="carousel-caption d-block">
        <h5 style={{fontSize: "8vw"}} className="opacity-50">Buy Desired Products</h5>
        <p>Explore everything at one place.</p>
      </div>
    </div>
    <div className="carousel-item">
      <img src="car3.png" className="d-block w-100 rounded-5" alt="..." style={{minHeight:"500px"}}/>
      <div className="carousel-caption d-block">
        <h5 style={{fontSize: "8vw"}} className="opacity-50">Never Get Lost</h5>
        <p>Get the exact locations and never waste your time</p>
      </div>
    </div>
  </div>
  <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Previous</span>
  </button>
  <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Next</span>
  </button>
</div>

     );
}

export default Carousel;