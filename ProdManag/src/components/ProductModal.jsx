import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner, Image } from 'react-bootstrap';

const ProductModal = ({ 
  show, 
  handleClose, 
  handleAddProduct,
  productToEdit = null,
  handleUpdateProduct,
  handleDeleteProduct
}) => {
  const isEditMode = !!productToEdit;
  const [formData, setFormData] = useState({
    name: '',
    banner: '',
    description: '',
    price: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (isEditMode && productToEdit) {
      setFormData({
        name: productToEdit.name || '',
        banner: productToEdit.banner || '',
        description: productToEdit.description || '',
        price: productToEdit.price?.toString() || ''
      });
    } else {
      setFormData({
        name: '',
        banner: '',
        description: '',
        price: ''
      });
    }
    setError('');
    setImageError(false);
  }, [productToEdit, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'banner') setImageError(false);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Product name is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      setError('Please enter a valid price');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const productData = {
        name: formData.name.trim(),
        banner: formData.banner.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price)
      };

      if (isEditMode) {
        await handleUpdateProduct({ ...productData, id: productToEdit.id });
      } else {
        await handleAddProduct(productData);
      }
      handleClose();
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    setLoading(true);
    try {
      await handleDeleteProduct(productToEdit.id);
      handleClose();
    } catch (err) {
      setError(err.message || 'Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{isEditMode ? 'Edit Product' : 'Add New Product'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

        <Form>
          <Form.Group controlId="productName" className="mb-3">
            <Form.Label>Product Name *</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
              minLength={3}
              maxLength={100}
            />
          </Form.Group>

          <Form.Group controlId="productBanner" className="mb-3">
            <Form.Label>Banner URL</Form.Label>
            <Form.Control
              type="url"
              name="banner"
              value={formData.banner}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              isInvalid={imageError}
            />
            {formData.banner && (
              <div className="mt-2 text-center">
                <Image
                  src={formData.banner}
                  alt="Preview"
                  fluid
                  style={{ maxHeight: '150px' }}
                  onError={() => setImageError(true)}
                  onLoad={() => setImageError(false)}
                />
                {imageError && (
                  <small className="text-danger">Could not load image from this URL</small>
                )}
              </div>
            )}
          </Form.Group>

          <Form.Group controlId="productDescription" className="mb-3">
            <Form.Label>Description *</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              required
              minLength={10}
              maxLength={500}
            />
            <Form.Text muted>10-500 characters</Form.Text>
          </Form.Group>

          <Form.Group controlId="productPrice" className="mb-3">
            <Form.Label>Price *</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
              min="0.01"
              step="0.01"
              required
            />
            <Form.Text muted>Minimum $0.01</Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {isEditMode && (
          <Button 
            variant="outline-danger" 
            onClick={handleDelete}
            disabled={loading}
            className="me-auto"
          >
            Delete
          </Button>
        )}
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              <span className="ms-2">
                {isEditMode ? 'Saving...' : 'Adding...'}
              </span>
            </>
          ) : (
            isEditMode ? 'Save Changes' : 'Add Product'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductModal;