import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState('testing11234512sd6@gmail.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setIsLoggingIn(true); // Start login process
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setIsLoggingIn(false); // Login process completed
      setError(null); // Clear any previous errors
      console.log(userCredential);
      navigate('/'); // Navigate to home page after successful login
    } catch (error) {
      setError(error.message); // Set error message
      console.error('Login Error:', error.message);
      setIsLoggingIn(false); // Login process completed with error
    }
  };

  return (
    <Container>
      <LoginForm onSubmit={handleLogin}>
        <Title>Login</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          disabled={isLoggingIn} // Disable input field during login process
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          disabled={isLoggingIn} // Disable input field during login process
        />
        <SubmitButton type="submit" disabled={isLoggingIn}>
          {isLoggingIn ? 'Logging In...' : 'Login'}
        </SubmitButton>
        <SignupLink to="/signup">Don't have an account? Sign Up</SignupLink>
      </LoginForm>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const LoginForm = styled.form`
  background-color: #ffffff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 30vw;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 90%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 10px;
`;

const SignupLink = styled(Link)`
  text-decoration: none;
  color: #007bff;
  margin-top: 10px;
`;

export default Login;
