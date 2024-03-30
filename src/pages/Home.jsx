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
import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';

export default function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [sideBarWidth, setSideBarWidth] = useState(30);
    const auth = getAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userRef = useRef('');
    const [progress, setProgress] = useState(0);
    const isLoadingtrue = useSelector(state => state.userRdx.isLoadingtrue); 
    const loadingPercatnge = useSelector(state => state.userRdx.loadingPercentage); 
    const currentUserChatInfo = useSelector(state => state.userRdx.currentChatInfo);
    const currentUser = useSelector(state => state.userRdx.user); 
    const timerRef = useRef(null);
    const separatorRef = useRef(null);
    const separatorLeft = useRef(0);

    const distanceCovered = useRef(0);
    const startMovingSeperator = useRef(false);
    function mouseDownFunc(e){
      const rect = separatorRef.current.getBoundingClientRect();
      const positionFromLeft = e.clientX - rect.left;
      separatorLeft.current = positionFromLeft
      startMovingSeperator.current = true;
    }

    function handleMouseMove(e) {
      if(startMovingSeperator.current){
        const movementX = e.clientX; // Calculate movement since mouse down
        distanceCovered.current = movementX;
        console.log(distanceCovered.current)
      }
    }


    function handleMouseUp(e) {
      if(startMovingSeperator.current){

        // Get the screen width
        const screenWidth = window.innerWidth;
        
        // Calculate total distance covered
        const totalDistance = distanceCovered.current;
        
        // Calculate percentage
        const percentage = (totalDistance / screenWidth) * 100;
        
        startMovingSeperator.current = false;
        if (percentage < 70 && percentage > 25) {
          setSideBarWidth(percentage)
        } else if(percentage > 70){
          setSideBarWidth(70)
        }else if(percentage < 25){
          setSideBarWidth(25)
        }
      }
    }


useEffect(()=>{
  if(separatorRef.current){
    dragElement(separatorRef.current);
  }
},[separatorRef.current])


    function dragElement(elmnt) {
      var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
   
        elmnt.onmousedown = dragMouseDown;
    
      function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
      }
    
      function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos3 = e.clientX;
        // set the element's new position:
        const screenWidth = window.innerWidth;
        const percentage = ((elmnt.offsetLeft - pos1) / screenWidth) * 100;
        if (percentage < 70 && percentage > 25) {
          elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        } else if(percentage > 70){
          elmnt.style.left = (screenWidth * 70/100) + "px";
        }else if(percentage < 25){
          elmnt.style.left = (screenWidth * 25/100) + "px";
        }
      }
    
      function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
      }
    }
      
      
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
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

      async function handleWindowClose(){
        const userDocRef = doc(firestore, 'users', currentUser.uid);
        await updateDoc(userDocRef, { onlineStatus: 'offline' });
      }

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

      useEffect(()=>{
        console.log(sideBarWidth);
      },[sideBarWidth])

      useEffect(()=>{
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return ()=>{
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        }
      },[])
      const firestore = getFirestore();

      useEffect(()=>{
          async function func(){
            if(currentUser && currentUser?.uid){
              const userDocRef = doc(firestore, 'users', currentUser.uid);
              const userDocSnapShot = await getDoc(userDocRef);
              let userDocData = userDocSnapShot.data() ;
              console.log(userDocData,'userDoc')
              if(userDocData){
                await updateDoc(userDocRef, { onlineStatus: 'online' });
                window.addEventListener('beforeunload', handleWindowClose);
              }
            }
          }

          func();

          return async()=>{
           if(currentUser && currentUser.uid){
            handleWindowClose();
            window.removeEventListener('beforeunload', handleWindowClose);
           }
          }
      },[currentUser])
      
    
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
    <Box sx={{ width: '100%', height:'100vh', maxHeight:"100vh" }}>
      {
        isLoadingtrue ? <LinearProgress className='asasa' variant="determinate" value={progress} sx={{zIndex:100000}}/> : (<FakeBlock></FakeBlock>) 
      }
    <HomeCont style={{width:"100vw"}}>
      <SideBar widthVal={`${sideBarWidth}%`}/>
      <Separator ref={separatorRef} onMouseDown={mouseDownFunc} style={{left:`${sideBarWidth}%`}}/>
      <Chats widthVal={`${100 - sideBarWidth}%`}/>
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
    justify-content: center;
    align-items: center;
    overflow: hidden;
    padding: 0px;
    /* padding-top: 20px; */
    height: calc(100vh - 4px);
    max-height: calc(100vh - 4px);
`
const FakeBlock = styled.div`
 background-color: #f3f3f3;
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
    cursor: progress;
`
const Separator = styled.div`
 width: 4px;
 height: 100%;
 background-color: #f3f3f3;
 cursor: col-resize;
 position: absolute;
 top: 0px;
 z-index: 104;
`
