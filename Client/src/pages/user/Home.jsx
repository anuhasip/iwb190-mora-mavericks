import Carousel from "../../components/home/Carousel";
import Category from "../../components/Category";
import Services from "../../components/home/Services";
import Flyer from "../../components/home/Flyer";
import React, { useState } from "react";

function Home() {
    const [filteredProducts, setFilteredProducts] = useState(products);

  const handleSearch = (searchTerm) => {
    const results = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(results);
  };
    return ( 
        <div className="container px-5 mt-3">

        <Carousel/>
        <div className="row mt-3">
        <div className="col-lg-3 col-md-6">
        <Category img="category1.svg" bgcolor="bg-dark bg-gradient" txt="Earphone"/>
        </div>
        <div className="col-lg-3 col-md-6">
        <Category img="category2.svg" bgcolor="bg-warning bg-gradient" txt="Headset"/>
        </div>
        <div className="col-lg-6">
        <Category img="category3.svg" bgcolor="bg-danger bg-gradient" txt="Laptop"/>
        </div>
        </div>

        <div className="row"> 
        <div className="col-lg-6">
        <Category img="category4.svg" bgcolor="bg-secondary bg-gradient" txt="Smartphone"/>
        </div>
        <div className="col-lg-3 col-md-6">
        <Category img="category5.svg" bgcolor="bg-success bg-gradient" txt="Smartwatch"/>
        </div>
        <div className="col-lg-3 col-md-6">
        <Category img="category6.svg" bgcolor="bg-primary bg-gradient" txt="Speaker"/>
        </div>
        </div>

        <div className="my-5 pt-2">
        <Services />
        </div>

        <div className="pt-5">
        <Flyer />
        </div>
        

        </div>
     );
}

export default Home;