import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Modal, Form, Alert, Spinner } from 'react-bootstrap';

const ProductCard = ({ product, onUpdate, onDelete }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [cardImageError, setCardImageError] = useState(false);

  // Initialize edit form data when product changes
  useEffect(() => {
    if (product) {
      setEditFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        image: product.image || ''
      });
    }
  }, [product]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (name === 'image') setImageError(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validation
      if (!editFormData.name.trim() || !editFormData.description.trim()) {
        throw new Error('Name and description are required');
      }
      const price = parseFloat(editFormData.price);
      if (isNaN(price) || price <= 0) {
        throw new Error('Please enter a valid price');
      }

      const updatedProduct = {
        ...product,
        name: editFormData.name.trim(),
        description: editFormData.description.trim(),
        price: price,
        image: editFormData.image.trim()
      };

      await onUpdate(updatedProduct);
      setShowEditModal(false);
    } catch (err) {
      setError(err.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete(product.id);
      setShowDeleteConfirm(false);
    } catch (err) {
      setError(err.message || 'Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="h-100 shadow-sm" data-testid="product-card">
        {/* Product Image - Only shows if URL exists and loads successfully */}
        <div className="position-relative" style={{ 
          height: '200px', 
          overflow: 'hidden',
          backgroundColor: '#f8f9fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {product.image && !cardImageError ? (
            <img
              src={product.image}
              alt={product.name}
              style={{
                height: '100%',
                width: '100%',
                objectFit: 'cover'
              }}
              onError={() => setCardImageError(true)}
            />
          ) : (
            <div className="text-muted">No image available</div>
          )}
          {product.isNew && (
            <Badge bg="success" className="position-absolute top-0 end-0 m-2">
              New
            </Badge>
          )}
        </div>

        <Card.Body className="d-flex flex-column">
          <div className="mb-2">
            <Card.Title className="mb-1">{product.name}</Card.Title>
            {product.category && (
              <Badge bg="info" className="mb-2">
                {product.category}
              </Badge>
            )}
          </div>

          <Card.Text 
            className="flex-grow-1" 
            style={{ 
              minHeight: "60px",
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {product.description}
          </Card.Text>

          <div className="mt-auto">
            <h5 className="text-primary mb-3">${product.price?.toFixed(2)}</h5>
            
            <div className="d-flex justify-content-between gap-2">
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => setShowEditModal(true)}
              >
                Edit
              </Button>
              <Button 
                variant="outline-danger" 
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditSubmit}>
          <Modal.Body>
            {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

            <Form.Group className="mb-3">
              <Form.Label>Product Name *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={editFormData.name}
                onChange={handleEditChange}
                required
                minLength={3}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={editFormData.description}
                onChange={handleEditChange}
                required
                minLength={10}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price *</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={editFormData.price}
                onChange={handleEditChange}
                min="0.01"
                step="0.01"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="url"
                name="image"
                value={editFormData.image}
                onChange={handleEditChange}
                placeholder="Paste image URL from any website"
                isInvalid={imageError}
              />
              {editFormData.image && !imageError && (
                <div className="mt-2 text-center">
                  <img 
                    src={editFormData.image} 
                    alt="Preview" 
                    style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'contain' }}
                    onError={() => setImageError(true)}
                    onLoad={() => setImageError(false)}
                  />
                </div>
              )}
              {imageError && (
                <Form.Text className="text-danger">Could not load image from this URL</Form.Text>
              )}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" /> Saving...
                </>
              ) : 'Save Changes'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete "{product.name}"? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={loading}>
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" /> Deleting...
              </>
            ) : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProductCard;