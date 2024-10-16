import React, { useState, useContext, createContext, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../components/UserContext";
import axios from "axios";
import Category from "../../components/Category";


const ShopDashboard = () => {
  const { user } = useContext(UserContext); // Get the shop_id from context
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!user.c_id) {
      navigate("/shop-login");
    }
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/api/item_details_by_shop/${user.c_id}`
      )
      .then((response) => {
        console.log(response.status, response.data);
        setProducts(response.data);
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  }, []);

  const categories = [
    "Electronics",
    "Clothing",
    "Furniture",
    "Groceries",
    "Beauty",
    "Toys",
    "Sports",
    "Jewelry",
    "Footwear",
    "Appliances"
  ];

  // Form state for adding a new product
  const [newProduct, setNewProduct] = useState({
    item_name: "",
    image_url: "",
    unit_price: 0,
    description: "",
    category: "",
    keywords: "",
    shop_id: user.c_id,
  });

  // Modal visibility state
  const [showModal, setShowModal] = useState(false);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleKeywordsChange = (e) => {
    const value = e.target.value;
    // Split the input by commas and trim each keyword to avoid unnecessary spaces
    const keywordsArray = value.split(',').map((keyword) => keyword.trim());
    setNewProduct({ ...newProduct, keywords: keywordsArray.toString() });
  };

  // Handle adding a new product
  const addProduct = (e) => {
    e.preventDefault();
    setProducts((prevProducts) => [
      ...prevProducts,
      { ...newProduct, id: prevProducts.length + 1 },
    ]);
    const product = newProduct;
    product.unit_price = parseFloat(product.unit_price);
    console.log(product);
    axios
      .post(`${process.env.REACT_APP_API_URL}/api/item`, product)
      .then((response) => {
        console.log(response.status, response.data);
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
    setShowModal(false); // Close the modal
    // Clear form
    setNewProduct({
      item_name: "",
      image_url: "",
      unit_price: 0,
      description: "",
      category: "",
      keywords: "",
      shop_id: user.c_id,
    });
  };

  // Handle deleting a product
  const deleteProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  return (
    <div className="container mt-5">
      <h2>Shop Dashboard</h2>

      {/* Product List */}
      <div className="mt-4">
        <h3>Products</h3>
        {products.length > 0 ? (
          <div className="row">
            {products.map((product) => (
              <div className="col-md-4 mb-3" key={product.id}>
                <div className="card">
                  <img
                    src={product.image_url}
                    className="card-img-top"
                    alt={product.item_name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.item_name}</h5>
                    <p className="card-text">{product.category}</p>
                    <p className="card-text">{product.description}</p>
                    <p className="card-text">
                      <strong>Price: </strong>
                      {Intl.NumberFormat('en-IN', { style: 'currency', currency: 'LKR' }).format(product.unit_price)}
                    </p>
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteProduct(product.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No products available</p>
        )}
      </div>

      {/* Button to trigger the modal */}
      <button
        className="btn btn-primary mt-4"
        data-bs-toggle="modal"
        data-bs-target="#addProductModal"
      >
        Add New Product
      </button>

      {/* Modal for adding a new product */}
      <div
        className="modal fade"
        id="addProductModal"
        tabIndex="-1"
        aria-labelledby="addProductModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addProductModalLabel">
                Add a New Product
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={addProduct}>
                <div className="mb-3">
                  <label className="form-label">Item Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="item_name"
                    value={newProduct.item_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Image URL</label>
                  <input
                    type="text"
                    className="form-control"
                    name="image_url"
                    value={newProduct.image_url}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Unit Price</label>
                  <input
                    type="number"
                    className="form-control"
                    name="unit_price"
                    value={newProduct.unit_price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={newProduct.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <select
                    className="form-control"
                    name="category"
                    value={newProduct.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Keywords (comma-separated)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="keywords"
                    placeholder="Enter keywords separated by commas"
                    value={newProduct.keywords}
                    onChange={handleInputChange}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                >
                  Add Product
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



const App = () => (
    <ShopDashboard />
);

export default App;
