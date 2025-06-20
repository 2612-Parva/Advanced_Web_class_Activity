import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Spinner, Form, InputGroup, Dropdown } from 'react-bootstrap';
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
  const [error, setError] = useState('');
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

      setProducts(response.data.rows);
      setPagination(prev => ({ 
        ...prev, 
        count: response.data.count,
        totalPages: Math.ceil(response.data.count / limit)
      }));
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch products');
      if (err.response?.status === 401) navigate('/login');
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
      const response = await axios.post('http://localhost:5000/api/products', newProduct, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(prev => [response.data, ...prev]);
      return true;
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to add product');
      return false;
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 })); 
    fetchProducts();
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleSortChange = (value, label) => {
    setFilters({ ...filters, sort: value, sortLabel: label });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  return (
    <>
      <section>
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
            <div className="alert alert-danger">{error}</div>
          ) : products.length === 0 ? (
            <div className='d-flex justify-content-center align-items-center' style={{ minHeight: "200px" }}>
              <EmptyComponent message="No products found" />
            </div>
          ) : (
            <>
              <Row className="g-4">
                {products.map(product => (
                  <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
                    <ProductCard 
                      product={{
                        id: product.id,
                        name: product.title,
                        description: product.description,
                        price: product.price
                      }} 
                    />
                  </Col>
                ))}
              </Row>

              {pagination.totalPages > 1 && (
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

                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.page <= 3) {
                          pageNum = i + 1;
                        } else if (pagination.page >= pagination.totalPages - 2) {
                          pageNum = pagination.totalPages - 4 + i;
                        } else {
                          pageNum = pagination.page - 2 + i;
                        }

                        return (
                          <li 
                            key={pageNum}
                            className={`page-item ${pageNum === pagination.page ? 'active' : ''}`}
                          >
                            <button 
                              className="page-link" 
                              onClick={() => handlePageChange(pageNum)}
                            >
                              {pageNum}
                            </button>
                          </li>
                        );
                      })}

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
              )}
            </>
          )}
        </Container>
      </section>
    </>
  );
};

export default Product;