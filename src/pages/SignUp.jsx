import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { useState } from "react";
import styled from 'styled-components';
import { useNavigate,Link  } from "react-router-dom";

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const auth = getAuth();
  const firestore = getFirestore();
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      setIsSigningUp(true);
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log(userCredential)
      // Get the newly created user's ID
      const userId = userCredential.user.uid;

      // Create user document in Firestore
      await addDoc(collection(firestore, 'users'), {
        userId,
        name, // Add name to Firestore document
        email
        // Add any other user data you want to store in the document
      });

      // Clear input fields and reset error state
      setName('');
      setEmail('');
      setPassword('');
      setError(null);

      // Signup successful
      setIsSigningUp(false);
      console.log('User created successfully!');
      navigate('/'); // Navigate to home page after successful signup
    } catch (error) {
      // Handle errors
      setError(error.message);
      console.error('Signup Error:', error.message);
      setIsSigningUp(false);
    }
  };

  return (
    <Container>
      <SignupCont>
        <h2>Sign Up</h2>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <SignUpForm onSubmit={handleSignUp}>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
          />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <SignUpButton type="submit" disabled={isSigningUp}>{isSigningUp ? 'Signing Up...' : 'Sign Up'}</SignUpButton>
        <LoginLink to="/login">Already have an account? Login</LoginLink>
        </SignUpForm>
      </SignupCont>
    </Container>
  );
};

export default SignUp;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const LoginLink = styled(Link)`
  margin-top: 10px;
  color: #007bff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const SignupCont = styled.div`
  background-color: #ffffff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 10px;
`;

const SignUpForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Input = styled.input`
  width: 300px;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

const SignUpButton = styled.button`
  width: 300px;
  padding: 10px;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 16px;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;
