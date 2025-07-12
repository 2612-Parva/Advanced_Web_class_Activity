import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Header from '../../components/Header';

const Contact = () => {
  return (
    <>
      <Header />
      <section className="contact-section">
        <Container>
          <h2 className="mb-4 text-center text-primary">Contact Us</h2>
          <Row className="justify-content-center">
            <Col md={6}>
              <Card className="p-4 shadow-sm">
                <Card.Body>
                  <p><strong>Email Address:</strong> info@promanage.com</p>
                  <p><strong>Phone Number:</strong> +1 (123) 456-7890</p>
                  <p><strong>Home Address:</strong> 123 Main Street, Halifax, NS, Canada</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Contact;