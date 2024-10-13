import Product from "../components/products/Product";

import { UserContext } from "../components/UserContext";

import { useSearchParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

function Products() {

    const {user} = useContext(UserContext);
    const navigate = useNavigate();

    const [categoryParams] = useSearchParams();

    const category = categoryParams.get('category');

    const url = `${process.env.REACT_APP_API_URL}/api/products/`;
    const [products, setProducts] = useState(null);

    const fetchInfo = () => {
        return axios.get(url, {params : {category: category}}).then((res) => setProducts(res.data));
    };

    useEffect(() => {
        if (!user.c_id)
        {
            navigate("/login");
        }
        else{
            fetchInfo();
        }
    }, [category]);


    return ( 
        <>
        <div className="container px-md-5 mt-3">
            <h1 className="text-center fw-bold fs-1">Our Products</h1>
            <p className="text-secondary text-center">Explore Our Products</p>
            <p className="text-secondary mb-0">Products / { category }</p>
            
            <div className="row">
            {products ? products.map((product) => {
                return (
                    <Product 
                        key={product.p_id}
                        p_id={product.p_id}
                        p_name={product.p_name}
                        price={product.price}
                        img_link={product.img_link}
                    />
                );
            }) : "Loading..."}
            </div>
        </div>
        </>
     );
}

export default Products;