import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '/src/assets/logo.png';

const Signup = () => {
  const navigate = useNavigate();

  const SignupSchema = Yup.object().shape({
    fullname: Yup.string().required('Fullname is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string()
      .matches(/^[0-9]{10,15}$/, 'Phone must be 10-15 digits')
      .required('Phone is required'),
    password: Yup.string()
      .min(6, 'Minimum 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm your password'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name: values.fullname,
        email: values.email,
        phone: values.phone,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });
      
      localStorage.setItem('token', response.data.token);
      alert('Registration successful!');
      navigate('/login'); 
    } catch (error) {
      alert(error.response?.data?.msg || 'Registration failed');
    } finally {
      setSubmitting(false);
      resetForm();
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
          <h3 className="mt-3" style={{ color: '#343a40' }}>Sign Up</h3>
          <p className="text-muted">Create your account</p>
        </div>
        
        <Formik
          initialValues={{
            fullname: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
          }}
          validationSchema={SignupSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-3">
                <label className="form-label fw-medium">Full Name</label>
                <Field 
                  type="text" 
                  name="fullname" 
                  className="form-control" 
                  style={{ border: '1px solid #ced4da' }}
                />
                <ErrorMessage
                  name="fullname"
                  component="div"
                  className="text-danger small mt-1"
                />
              </div>

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

              <div className="mb-3">
                <label className="form-label fw-medium">Phone</label>
                <Field 
                  type="text" 
                  name="phone" 
                  className="form-control" 
                  style={{ border: '1px solid #ced4da' }}
                />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="text-danger small mt-1"
                />
              </div>

              <div className="mb-3">
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

              <div className="mb-4">
                <label className="form-label fw-medium">Confirm Password</label>
                <Field
                  type="password"
                  name="confirmPassword"
                  className="form-control"
                  style={{ border: '1px solid #ced4da' }}
                />
                <ErrorMessage
                  name="confirmPassword"
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
                {isSubmitting ? 'Signing up...' : 'Sign Up'}
              </button>
            </Form>
          )}
        </Formik>

        <div className="text-center mt-3">
          <p>Already have an account? <a href="/login">Login</a></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
