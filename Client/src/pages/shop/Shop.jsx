import React, { useState, useContext, createContext, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from 'react-router-dom';

// Create a context for shop ID
const ShopContext = createContext();


const ShopDashboard = () => {
    
    
  const c_id = useContext(ShopContext); // Get the shop_id from context

  const [products, setProducts] = useState([
    {
      id: 1,
      item_name: "Product 1",
      image_url: "https://via.placeholder.com/150",
      unit_price: 100,
      description: "Sample description 1",
      shop_id: c_id,
    },
    {
      id: 2,
      item_name: "Product 2",
      image_url: "https://via.placeholder.com/150",
      unit_price: 200,
      description: "Sample description 2",
      shop_id: c_id,
    },
  ]);

  // Form state for adding a new product
  const [newProduct, setNewProduct] = useState({
    item_name: "",
    image_url: "",
    unit_price: "",
    description: "",
    shop_id: c_id,
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

  // Handle adding a new product
  const addProduct = (e) => {
    e.preventDefault();
    setProducts((prevProducts) => [
      ...prevProducts,
      { ...newProduct, id: prevProducts.length + 1 },
    ]);
    setShowModal(false); // Close the modal
    // Clear form
    setNewProduct({
      item_name: "",
      image_url: "",
      unit_price: "",
      description: "",
      shop_id: c_id,
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
                    <p className="card-text">{product.description}</p>
                    <p className="card-text">
                      <strong>Price: </strong>${product.unit_price}
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

// Sample context provider with shop ID
const ShopProvider = ({ children }) => {
  const c_id = 1; // Example shop ID
  return <ShopContext.Provider value={c_id}>{children}</ShopContext.Provider>;
};

const App = () => (
  <ShopProvider>
    <ShopDashboard />
  </ShopProvider>
);

export default App;
