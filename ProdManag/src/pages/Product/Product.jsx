import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Button, 
  Spinner, 
  Form, 
  InputGroup, 
  Dropdown,
  Alert
} from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import AddProduct from '../../pages/Product/AddProduct';
import ProductCard from '../../components/ProductCard';
import EmptyComponent from '../../components/Empty';

const Product = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    count: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState({
    sort: '-createdAt',
    keyword: '',
    sortLabel: 'Newest First'
  });

  const sortOptions = [
    { value: '-createdAt', label: 'Newest First' },
    { value: 'createdAt', label: 'Oldest First' },
    { value: 'price', label: 'Price: Low to High' },
    { value: '-price', label: 'Price: High to Low' }
  ];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const { page, limit } = pagination;
      const { sort, keyword } = filters;

      const response = await axios.get('http://localhost:5000/api/products', {
        params: { 
          page, 
          limit, 
          sort, 
          keyword: keyword.trim() 
        },
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data && Array.isArray(response.data.rows)) {
        // Ensure all products have image field
        const productsWithImages = response.data.rows.map(product => ({
          ...product,
          image: product.image || '' // Default empty string if no image
        }));
        
        setProducts(productsWithImages);
        setPagination(prev => ({ 
          ...prev, 
          count: response.data.count || 0,
          totalPages: Math.ceil((response.data.count || 0) / limit)
        }));
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch products');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [pagination.page, filters.sort]);

  const handleAddProduct = async (newProduct) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/products', 
        {
          ...newProduct,
          image: newProduct.image || undefined // Send undefined if empty
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data) {
        setProducts(prev => [response.data, ...prev]);
        return true;
      }
    } catch (err) {
      console.error('Error adding product:', err);
      alert(err.response?.data?.message || 'Failed to add product');
    }
    return false;
  };
const handleSearch = (e) => {
    e.preventDefault();
    if (pagination.page !== 1) {
      setPagination(prev => ({ ...prev, page: 1 }));
    } else {
      fetchProducts();
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page }));
    }
  };

  const handleSortChange = (value, label) => {
    setFilters({ ...filters, sort: value, sortLabel: label });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage, endPage;

    if (pagination.totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = pagination.totalPages;
    } else {
      const half = Math.floor(maxVisiblePages / 2);
      if (pagination.page <= half + 1) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (pagination.page >= pagination.totalPages - half) {
        startPage = pagination.totalPages - maxVisiblePages + 1;
        endPage = pagination.totalPages;
      } else {
        startPage = pagination.page - half;
        endPage = pagination.page + half;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <li 
          key={i}
          className={`page-item ${i === pagination.page ? 'active' : ''}`}
        >
          <button 
            className="page-link" 
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        </li>
      );
    }
return (
      <div className="d-flex justify-content-center mt-4">
        <nav>
          <ul className="pagination">
            <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => handlePageChange(pagination.page - 1)}
              >
                &laquo;
              </button>
            </li>
            {pages}
            <li className={`page-item ${pagination.page === pagination.totalPages ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => handlePageChange(pagination.page + 1)}
              >
                &raquo;
              </button>
            </li>
          </ul>
        </nav>
      </div>
    );
  };


  return (
    <>
      <Header />
      <Container className="mt-4">
        <div className="d-flex flex-column flex-md-row justify-content-between mb-4 gap-3">
          <Form onSubmit={handleSearch} className="flex-grow-1">
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search by title or description..."
                value={filters.keyword}
                onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
              />
              <Button variant="primary" type="submit">
                Search
              </Button>
            </InputGroup>
          </Form>

          <div className="d-flex gap-2">
            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary">
                {filters.sortLabel}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {sortOptions.map((option) => (
                  <Dropdown.Item 
                    key={option.value}
                    active={filters.sort === option.value}
                    onClick={() => handleSortChange(option.value, option.label)}
                  >
                    {option.label}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            <AddProduct onAdd={handleAddProduct} />
          </div>
        </div>

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Loading products...</p>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : !products || products.length === 0 ? (
          <div className='d-flex justify-content-center align-items-center' style={{ minHeight: "200px" }}>
            <EmptyComponent message="No products found" />
          </div>
        ) : (
          <>
            <Row className="g-4">
              {products.map(product => (
                <Col key={product.id || product._id} xs={12} sm={6} md={4} lg={3}>
                  <ProductCard 
                    product={{
                      id: product.id || product._id,
                      name: product.title,
                      description: product.description,
                      price: product.price,
                      image: product.image // Pass the image URL directly
                    }} 
                  />
                </Col>
              ))}
            </Row>
            {renderPagination()}
          </>
        )}
      </Container>
    </>
  );
};

export default Product;