import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '/src/assets/logo.png';

const Login = () => {
  const navigate = useNavigate();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: values.email,
        password: values.password
      });
      
      localStorage.setItem('token', response.data.token);
      alert('Login successful!');
      navigate('/product'); 
    } catch (error) {
      alert(error.response?.data?.msg || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <div className="bg-white p-4 rounded shadow-lg" style={{ 
        width: '100%', 
        maxWidth: '400px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}>
        <div className="text-center mb-4">
          <img src={logo} alt="logo" style={{ width: "120px" }} />
          <h3 className="mt-3" style={{ color: '#343a40' }}>Login</h3>
          <p className="text-muted">Welcome back</p>
        </div>
        
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-3">
                <label className="form-label fw-medium">Email</label>
                <Field 
                  type="email" 
                  name="email" 
                  className="form-control" 
                  style={{ border: '1px solid #ced4da' }}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-danger small mt-1"
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-medium">Password</label>
                <Field 
                  type="password" 
                  name="password" 
                  className="form-control" 
                  style={{ border: '1px solid #ced4da' }}
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-danger small mt-1"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-medium"
                disabled={isSubmitting}
                style={{ 
                  backgroundColor: '#0d6efd',
                  border: 'none',
                  borderRadius: '4px'
                }}
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </Form>
          )}
        </Formik>

        <div className="text-center mt-3">
          <p>Don't have an account? <a href="/signup">Sign up</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;