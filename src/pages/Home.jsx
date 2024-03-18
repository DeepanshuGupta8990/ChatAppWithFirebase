import React, { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import SideBar from '../component/SideBar';
import Chats from '../component/Chats';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { setUserInRedux } from '../features/counter/userSlice';

export default function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const auth = getAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch(); 

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log(user)
          setIsLoading(false);
          if (user) {
            setIsLoggedIn(true);
            dispatch(setUserInRedux({
                uid: user.uid,
                email: user.email,
              }));
          } else {
            setIsLoggedIn(false);
          }
        });
    
        // Cleanup function
        return () => unsubscribe();
      }, [auth]);
    
      // Show loading spinner or any other loading indicator while checking auth state
      if (isLoading) {
        return <div>Loading...</div>;
      }

      if (!isLoggedIn) {
        navigate('/login');
        return null; // Returning null to prevent rendering anything else while redirecting
      }
  return (
    <>

    <HomeCont style={{width:"100vw"}}>
      <SideBar widthVal={'30%'}/>
      <Chats widthVal={'70%'}/>
    </HomeCont>
    </>
  )
}

const HomeCont = styled.div`
    display: flex;
    flex-direction: row;
    width: 95vw;
    height: 95vh;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    padding: 10px;
`