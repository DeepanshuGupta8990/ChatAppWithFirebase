import React from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setChatId } from '../features/counter/chatSlice';

const Logout = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch(); 

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // After successful logout, redirect to login page or any other route
      dispatch(setChatId({ id: "1" }));
      navigate('/login');
    } catch (error) {
      console.error('Logout Error:', error.message);
    }
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default Logout;
