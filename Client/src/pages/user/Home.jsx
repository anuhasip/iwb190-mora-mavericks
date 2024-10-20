import Carousel from "../../components/home/Carousel";
import Category from "../../components/Category";
import Services from "../../components/home/Services";
import Flyer from "../../components/home/Flyer";
// "Electronics done",
// "Clothing done",
// "Furniture done",
// "Groceries",
// "Beauty done",
// "Toys done",
// "Sports done",
// "Jewelry",
// "Footwear",
// "Appliances"

function Home() {
    return ( 
        <div className="container px-5 mt-3">

        <Carousel/>
        <div className="row mt-3">
        <div className="col-lg-3 col-md-6">
        <Category img="category1.png" bgcolor="bg-dark bg-gradient" txt="Electronics"/>
        </div>
        <div className="col-lg-3 col-md-6">
        <Category img="category2.png" bgcolor="bg-warning bg-gradient" txt="Clothing"/>
        </div>
        <div className="col-lg-6">
        <Category img="category3.png" bgcolor="bg-danger bg-gradient" txt="Furniture"/>
        </div>
        </div>

        <div className="row"> 
        <div className="col-lg-6">
        <Category img="category4.png" bgcolor="bg-secondary bg-gradient" txt="Toys"/>
        </div>
        <div className="col-lg-3 col-md-6">
        <Category img="category5.png" bgcolor="bg-success bg-gradient" txt="Beauty"/>
        </div>
        <div className="col-lg-3 col-md-6">
        <Category img="category6.png" bgcolor="bg-primary bg-gradient" txt="Sports"/>
        </div>
        </div>

        <div className="row mt-3">
        <div className="col-lg-3 col-md-6">
        <Category img="category7.png" bgcolor="bg-dark bg-gradient" txt="Groceries"/>
        </div>
        <div className="col-lg-3 col-md-6">
        <Category img="category9.png" bgcolor="bg-warning bg-gradient" txt="Footware"/>
        </div>
        <div className="col-lg-6">
        <Category img="category8.png" bgcolor="bg-danger bg-gradient" txt="Jewellery"/>
        </div>
        </div>


        {/* <div className="my-5 pt-2">
        <Services />
        </div> */}

        <div className="pt-5">
        <Flyer />
        </div>
        

        </div>
     );
}

export default Home;