import Product from "../../components/products/Product";

import { UserContext } from "../../components/UserContext";

import { useSearchParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

function Products() {

    const {user} = useContext(UserContext);
    const navigate = useNavigate();

    const [categoryParams] = useSearchParams();

    const category = categoryParams.get('category');

    const url = category ? `${process.env.REACT_APP_API_URL}/api/item_details_by_category/${category}` : `${process.env.REACT_APP_API_URL}/api/item_details_all/`;
    const [products, setProducts] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchInfo = () => {
        return axios.get(url).then((res) => setProducts(res.data));
    };

    const fetchSearch = (keyword) => {
        return axios
          .get(`${process.env.REACT_APP_API_URL}/api/item_details_by_keyword/${keyword}`)
          .then((res) => {
            // Ensure res.data is an array, or return an empty array if not
            return Array.isArray(res.data) ? res.data : [];
          })
          .catch((err) => {
            console.error("Error fetching search results: ", err);
            return []; // Return an empty array on error
          });
      };
    // const handleSearch = () => {
    //     // Empty function to be filled later
    //     setProducts([]);
    //     console.log("Search button clicked. Query: ", searchQuery);
    //     const keywords = searchQuery.split(" ");
    //     keywords.forEach((keyword) => {
    //         fetchSearch(keyword);  // Pass each keyword to fetchSearch
    //     });

    //     const updatedproducts = products;
        
    // };
    const handleSearch = async () => {
        setProducts([]); // Clear previous products before a new search
        console.log("Search button clicked. Query: ", searchQuery);
    
        const keywords = searchQuery.split(" ");
        let allProducts = [];
    
        for (const keyword of keywords) {
          const fetchedProducts = await fetchSearch(keyword);
          allProducts = [...allProducts, ...fetchedProducts];
        }
    
        // Remove duplicates by item_id
        const uniqueProducts = allProducts.filter(
          (product, index, self) =>
            index === self.findIndex((p) => p.item_id === product.item_id)
        );
    
        setProducts(uniqueProducts); // Update state with unique products
      };

    useEffect(() => {
        if (!user.c_id )
        {
            navigate("/login");
        }
        else{
            fetchInfo();
        }
    }, [category]);


    return ( 
        <>
        <div className="input-group mb-3 container px-md-5 mt-3">
      <input
        type="text"
        className="form-control"
        placeholder="Enter search query"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button className="btn btn-primary" onClick={handleSearch}>
        Search
      </button>
    </div>
        <div className="container px-md-5 mt-3">
            <h1 className="text-center fw-bold fs-1">Our Products</h1>
            <p className="text-secondary text-center">Explore Our Products</p>
            <p className="text-secondary mb-0">Products / { category }</p>
            
            <div className="row">
            {products ? products.map((product) => {
                return (
                    <Product 
                        key={product.item_id}
                        p_id={product.item_id}
                        p_name={product.item_name}
                        price={product.unit_price}
                        img_link={product.image_url}
                    />
                );
            }) : "Loading..."}
            {(products && products.length == 0) && <p className="p-5 text-center">No Products Found!</p> }
            </div>
        </div>
        </>
     );
}

export default Products;