import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function Products() {
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    getProducts();
  }, []);

  // ✅ Use your Render backend URL here
  const BASE_URL = 'https://inventory-backend-x29y.onrender.com';

  const getProducts = async () => {
    try {
      const res = await fetch(`${BASE_URL}/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (res.status === 201) {
        console.log('Data Retrieved.');
        setProductData(data);
      } else {
        console.log('Something went wrong. Please try again.');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/deleteproduct/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const deletedata = await response.json();
      console.log(deletedata);

      if (response.status === 422 || !deletedata) {
        console.log('Error');
      } else {
        console.log('Product deleted');
        getProducts(); // refresh list
      }
    } catch (err) {
      console.log('Delete error:', err);
    }
  };

  return (
    <div className="container-fluid p-5">
      <h1>Products Inventory</h1>

      <div className="add_button">
        <NavLink to="/insertproduct" className="btn btn-primary fs-5">
          + Add New Product
        </NavLink>
      </div>

      <div className="overflow-auto mt-3" style={{ maxHeight: '38rem' }}>
        <table className="table table-striped table-hover mt-3 fs-5">
          <thead>
            <tr className="tr_color">
              <th scope="col">#</th>
              <th scope="col">Product Name</th>
              <th scope="col">Product Price</th>
              <th scope="col">Product ID</th>
              <th scope="col">Update</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {productData.map((element, id) => (
              <tr key={element._id}>
                <th scope="row">{id + 1}</th>
                <td>{element.ProductName}</td>
                <td>{element.ProductPrice}</td>
                <td>{element.ProductBarcode}</td>
                <td>
                  <NavLink to={`/updateproduct/${element._id}`} className="btn btn-primary">
                    <i className="fa-solid fa-pen-to-square"></i>
                  </NavLink>
                </td>
                <td>
                  <button className="btn btn-danger" onClick={() => deleteProduct(element._id)}>
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
