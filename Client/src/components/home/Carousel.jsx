function Carousel() {
    return ( 

        <div id="carouselExampleAutoplaying" className="carousel slide carousel-fade" data-bs-ride="carousel">
  <div className="carousel-inner">
    <div className="carousel-item active">
      <img src="carousel1.svg" className="d-block w-100 rounded-5" alt="..." style={{minHeight:"500px"}}/>
      <div className="carousel-caption d-block">
        <h5 style={{fontSize: "8vw"}} className="opacity-50">Smartphones</h5>
        <p>Explore Various SmartPhones</p>
      </div>
    </div>
    <div className="carousel-item">
      <img src="carousel2.svg" className="d-block w-100 rounded-5" alt="..." style={{minHeight:"500px"}}/>
      <div className="carousel-caption d-block">
        <h5 style={{fontSize: "8vw"}} className="opacity-50">Laptops</h5>
        <p>Explore Various Laptops</p>
      </div>
    </div>
    <div className="carousel-item">
      <img src="carousel3.svg" className="d-block w-100 rounded-5" alt="..." style={{minHeight:"500px"}}/>
      <div className="carousel-caption d-block">
        <h5 style={{fontSize: "8vw"}} className="opacity-50">Various Tech Gadgets</h5>
        <p>Explore</p>
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