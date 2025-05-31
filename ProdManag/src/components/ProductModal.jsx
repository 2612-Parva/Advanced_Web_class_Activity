// src/components/ProductModal.jsx
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ProductModal = ({ show, handleClose, handleAddProduct }) => {
  const [formData, setFormData] = useState({
    name: '',
    banner: '',
    description: '',
    price: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = () => {
    handleAddProduct(formData);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="productName" className="mb-3">
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
            />
          </Form.Group>
          <Form.Group controlId="productBanner" className="mb-3">
            <Form.Label>Banner URL</Form.Label>
            <Form.Control
              type="text"
              name="banner"
              value={formData.banner}
              onChange={handleChange}
              placeholder="Enter image URL"
            />
          </Form.Group>
          <Form.Group controlId="productDescription" className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </Form.Group>
          <Form.Group controlId="productPrice" className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button variant="primary" onClick={onSubmit}>Add Product</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductModal;