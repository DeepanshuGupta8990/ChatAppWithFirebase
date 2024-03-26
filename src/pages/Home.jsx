import React, { useEffect, useRef, useState } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import SideBar from '../component/SideBar';
import Chats from '../component/Chats';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { setLoadingPercentage, setUserInRedux } from '../features/counter/userSlice';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

export default function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const auth = getAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userRef = useRef('');
    const [progress, setProgress] = React.useState(0);
    const isLoadingtrue = useSelector(state => state.userRdx.isLoadingtrue); 
    const loadingPercatnge = useSelector(state => state.userRdx.loadingPercentage); 
    const currentUserChatInfo = useSelector(state => state.userRdx.currentChatInfo);
    const timerRef = useRef(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log(user)
          setIsLoading(false);
          if (user) {
            userRef.current = user;
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

      function func(){
         timerRef.current = setInterval(() => {
          if(isLoadingtrue || loadingPercatnge > 0){
            setProgress((oldProgress) => {
            const diff = Math.random() * 100;
            return Math.min(oldProgress + diff, 100);
        });
      }
        }, 100);
      }

      useEffect(()=>{
      if(isLoadingtrue){
        func();
      }
        return () => {
          dispatch(setLoadingPercentage({val : 0}));
            setProgress(0);
            clearInterval(timerRef.current);
        };
      },[isLoadingtrue])

      useEffect(()=>{
        console.log(isLoadingtrue,'isLoadingtrue',loadingPercatnge,progress,'progress')
      },[progress])
    
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
    <Box sx={{ width: '100%' }}>
      {
        isLoadingtrue ? <LinearProgress variant="determinate" value={progress} /> : (<FakeBlock></FakeBlock>) 
      }
    <HomeCont style={{width:"100vw"}}>
      <SideBar widthVal={'30%'}/>
      <Chats widthVal={'70%'}/>
    </HomeCont>
    </Box>
    {
      isLoadingtrue &&  <LoadingBox/>
    }
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
const FakeBlock = styled.div`
 background-color: white;
 height: 4px;
 width: 100vw;
`

const LoadingBox = styled.div`
    width: 100vw;
    height: 100vh;
    opacity: 0.5;
    background-color: white;
    position: absolute;
    top: 4px;
`