import React, { useEffect, useState } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';

export default function UpdateProduct() {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productBarcode, setProductBarcode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  const BASE_URL = 'https://inventory-backend-x29y.onrender.com';

  const setName = (e) => setProductName(e.target.value);
  const setPrice = (e) => setProductPrice(e.target.value);
  const setBarcode = (e) => {
    const value = e.target.value.slice(0, 12);
    setProductBarcode(value);
  };

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await fetch(`${BASE_URL}/products/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await res.json();

        if (res.status === 201) {
          setProductName(data.ProductName);
          setProductPrice(data.ProductPrice);
          setProductBarcode(data.ProductBarcode);
        } else {
          console.log('Failed to fetch product');
        }
      } catch (err) {
        console.log('Fetch error:', err);
      }
    };

    getProduct();
  }, [id]);

  const updateProduct = async (e) => {
    e.preventDefault();

    if (!productName || !productPrice || !productBarcode) {
      setError('*Please fill in all the required fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${BASE_URL}/updateproduct/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ProductName: productName,
          ProductPrice: productPrice,
          ProductBarcode: productBarcode,
        }),
      });

      await response.json();

      if (response.status === 201) {
        alert('Product Updated Successfully');
        navigate('/products');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-5">
      <h1>Update Product Information</h1>

      <div className="mt-5 col-lg-6 col-md-6 col-12">
        <label htmlFor="product_name" className="form-label fs-4 fw-bold">
          Product Name
        </label>
        <input
          type="text"
          onChange={setName}
          value={productName}
          className="form-control fs-5"
          id="product_name"
          placeholder="Enter Product Name"
          required
        />
      </div>

      <div className="mt-3 col-lg-6 col-md-6 col-12">
        <label htmlFor="product_price" className="form-label fs-4 fw-bold">
          Product Price
        </label>
        <input
          type="number"
          onChange={setPrice}
          value={productPrice}
          className="form-control fs-5"
          id="product_price"
          placeholder="Enter Product Price"
          required
        />
      </div>

      <div className="mt-3 mb-5 col-lg-6 col-md-6 col-12">
        <label htmlFor="product_barcode" className="form-label fs-4 fw-bold">
          Product Barcode
        </label>
        <input
          type="number"
          onChange={setBarcode}
          value={productBarcode}
          maxLength={12}
          className="form-control fs-5"
          id="product_barcode"
          placeholder="Enter Product Barcode"
          required
        />
      </div>

      <div className="d-flex justify-content-center col-lg-6 col-md-6">
        <NavLink to="/products" className="btn btn-secondary me-5 fs-4">
          Cancel
        </NavLink>
        <button
          type="submit"
          onClick={updateProduct}
          className="btn btn-primary fs-4"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update'}
        </button>
      </div>

      <div className="col text-center col-lg-6">
        {error && <div className="text-danger mt-3 fs-5 fw-bold">{error}</div>}
      </div>
    </div>
  );
}
