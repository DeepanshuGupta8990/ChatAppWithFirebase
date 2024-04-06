import React, { useEffect, useRef, useState,memo  } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { getFirestore, doc, updateDoc,getDoc, setDoc, collection } from 'firebase/firestore';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import Tooltip from '@mui/material/Tooltip';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Modal from '@mui/material/Modal';
import { v4 as uuidv4 } from 'uuid'; 
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import MyImageZoomComponent from './MyImageZoomComponent ';
import Chip from '@mui/material/Chip';
import ZoomPinch from './ZoomPinch';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import OtherUserProfile from './OtherUserProfile';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import Prismjs from './prismjs';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import CallIcon from '@mui/icons-material/Call';
import IconButton from '@mui/material/IconButton';


const ChatSectionContainer = styled.div`
  height: 86%;
  background-color: #f0f0f0; /* Example background color */
  border-radius: 8px; /* Example border radius */
  padding: 20px; /* Example padding */
  overflow-y: auto; /* Add scrollbar for vertical overflow */
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 50px;
  .css-i9fmh8-MuiBackdrop-root-MuiModal-backdrop{
    background-color: red !important;
  }
  background-image: url('/images/background2.jpg');
  overflow-x: hidden;
`;

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 400,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  p: 4,
};


const ChatSection = memo (({chatData,widthVal}) => {
  const [open, setOpen] = useState(false);
    const chatConatinerRef = useRef(null);
    const currentUser = useSelector(state => state.userRdx.user); 
    const currentUserChatInfo = useSelector(state => state.userRdx.currentChatInfo);
    const [showArrow,setShowArrow] = useState(false);
    const [modalImageUrl,setModalImageUrl] = useState('');
    const currentUserImageUrl = useSelector(state => state.userRdx.userImageUrl); 
    const currentChatUserInfo = useSelector(state => state.userRdx.currentChatUserInfo);
    const currentUserDocumentId = useSelector(state => state.userRdx.currentUserDocumentId);
    let chatId = useSelector(state => state.chatRdx.chatId); 
    // console.log(currentUserChatInfo,'sdsd',currentUser,currentUserDocumentId) 
    // console.log(currentChatUserInfo,'currentChatUserInfo',currentUserDocumentId)
console.log(chatData,'chatData')
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClickPop = (event) => {
      if (event && event.currentTarget) {
        setAnchorEl(event.currentTarget);
      } else {
        console.error("Event or currentTarget is undefined:", event);
      }
    };
    
   const handleClosePopOver = () => {
     setAnchorEl(null);
   };
 
   const openPop = Boolean(anchorEl);
   const id = openPop ? 'simple-popover' : undefined;

    const handleOpen = (imageUrl) => {
      if(imageUrl){
        setModalImageUrl(imageUrl);
      }
      setOpen(true);
    }
    const handleClose = () => {
      setOpen(false);
      setModalImageUrl("")
    }

    const openHalfSizeWindow = (id) => {
      // Get the current window's width and height
      const fullWidth = window.innerWidth;
      const fullHeight = window.innerHeight;
  
      // Calculate half of the width and height
      const halfWidth = fullWidth / 2;
      const halfHeight = fullHeight / 2;
  
      // Calculate the centered position
      const leftPosition = (fullWidth - halfWidth) / 2;
      const topPosition = (fullHeight - halfHeight) / 2;
  
      // Open a new window with half the size and centered position
      // window.open(`http://localhost:3000/videoCall?myId=${id}`, 'New Window', `width=${halfWidth},height=${halfHeight},left=${leftPosition},top=${topPosition}`);
      // window.open(`https://66114cc746501de76539b843--glistening-salamander-daf1be.netlify.app/index.html?room=${id}&password=123`, 'New Window', `width=${halfWidth},height=${halfHeight},left=${leftPosition},top=${topPosition}`);
      window.open(`https://66114cc746501de76539b843--glistening-salamander-daf1be.netlify.app/index.html?room=123&password=123`, 'New Window', `width=${halfWidth},height=${halfHeight},left=${leftPosition},top=${topPosition}`);
  };
  

    function scrollToBottom(){
      const chatContainer = chatConatinerRef.current;
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    const firestore = getFirestore();

    const updateLastMessage = async ( documentId, newData) => {
      try {
        // Construct the document reference using the document ID
        const docRef = doc(firestore, 'users', documentId);
        
        // Update the document with the new data
        await updateDoc(docRef, newData);
    
        // console.log(`Document with ID ${documentId} updated successfully.`);
      } catch (error) {
        console.error('Error updating document:', error);
      }
    };

 const sendMessage = async (messagetype) => {
  // Generate unique message ID using uuid()
  const callIdForVideoCall = Math.floor(Math.random()*1000000)+'WQeE32';
  openHalfSizeWindow(callIdForVideoCall);
  const messageId = uuidv4();

  // Add the message to the Firestore chat document
  const chatDocRef = doc(firestore, 'chats', chatId);
  const otherUserCallRef = doc(firestore, 'calls', currentUserChatInfo.id);
  const currentUserCallRef = doc(firestore, 'calls', currentUserDocumentId);

  try {
    // Get the current messages array from the document
    const chatDocSnapshot = await getDoc(chatDocRef);
    let otherUserCallRefSnapShot = await getDoc(otherUserCallRef);
    let currentUserCallRefSnapShot = await getDoc(currentUserCallRef);
    if (!otherUserCallRefSnapShot.exists()) {
      console.log('Document does not exist for other user');
      const userDocRef = doc(collection(firestore, 'calls'), currentUserChatInfo.id);
      await setDoc(userDocRef, {
        calls: []
      });
    }
    
    if (!currentUserCallRefSnapShot.exists()) {
      console.log('Document does not exist for current user');
      const userDocRef = doc(collection(firestore, 'calls'), currentUserDocumentId);
      await setDoc(userDocRef, {
        calls: []
      });
    }
    
    let currentMessages = chatDocSnapshot.data().messages || []; // Initialize as empty array if undefined
    let otherUserCallsArray = otherUserCallRefSnapShot.data().calls || [];
    let curretnUserCallsArray = currentUserCallRefSnapShot.data().calls || [];

    // Ensure currentMessages is an array
    if (!Array.isArray(currentMessages)) {
      currentMessages = [];
    }
    if (!Array.isArray(otherUserCallsArray)) {
      otherUserCallsArray = [];
    }
    if (!Array.isArray(curretnUserCallsArray)) {
      curretnUserCallsArray = [];
    }

    // Construct the new message object
    const newMessage = {
      text: "call",
      timestamp: new Date().toISOString(),
      messageId: messageId,
      senderId: currentUser.uid,
      messageStatus: "sent",
      messagetype: messagetype,
      callIdForVideoCall: callIdForVideoCall
    };
    
    // Update the messages array by appending the new message
    const updatedMessages = [...currentMessages, newMessage];
    const updatedCallsForOtherUser = [...otherUserCallsArray,newMessage];
    const updatedCallsForCurrentUser = [...curretnUserCallsArray,newMessage];

    const currentUserDocRef = doc(firestore, 'users', currentUserDocumentId);
    const otherUserDocRef = doc(firestore, 'users', currentUserChatInfo.id);

    const [currentUserDoc, otherUserDoc] = await Promise.all([
      getDoc(currentUserDocRef),
      getDoc(otherUserDocRef)
    ]);

    if (currentUserDoc.exists() && otherUserDoc.exists()) {
      // Both documents exist, you can now update them
      const otherUserData = otherUserDoc.data();

      const unreadMessageCountForOtherUser = otherUserData[currentUserDocumentId]?.unreadMezCount || 0;
      // Update the chat document with the updated messages array
      const currentTime = Date.now();
      await updateDoc(chatDocRef, { messages: updatedMessages });
      await updateDoc(otherUserCallRef, { calls: updatedCallsForOtherUser });
      await updateDoc(currentUserCallRef, { calls: updatedCallsForCurrentUser });
      updateLastMessage(currentUserDocumentId,{
        [currentUserChatInfo.id] : {lastMez : "Call", by : 'me',  time: currentTime}
      })
      updateLastMessage(currentUserChatInfo.id,{
        [currentUserDocumentId] : {lastMez :  "Call", by : 'otherUser',unreadMezCount:  (unreadMessageCountForOtherUser+1), time: currentTime}
      })
    }
  } catch (error) {
    console.error('Error adding message to Firestore:', error);
  }
};

    useEffect(() => {
      const chatContainer = chatConatinerRef.current;
      if (chatContainer) {
        const scrollHeight = chatContainer.scrollHeight;
        const clientHeight = chatContainer.clientHeight;
        const scrollTop = chatContainer.scrollTop;
  
        if (scrollHeight - clientHeight - scrollTop <= 1) {
          // Already scrolled to the bottom, do nothing
          return;
        }
  
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, [chatData, currentUserChatInfo]);

    useEffect(() => {
      const handleScroll = () => {
        const container = chatConatinerRef.current;
        if (container) {
          const scrollHeight = container.scrollHeight;
          const clientHeight = container.clientHeight;
          const scrollTop = container.scrollTop;
  
          if (scrollHeight - clientHeight - scrollTop > 10) {
            // console.log('Scroll position is not at the bottom');
            setShowArrow(true);
          }else{
            setShowArrow(false);
          }
        }
      };
  
      const container = chatConatinerRef.current;
      if (container) {
        container.addEventListener('scroll', handleScroll);
      }
  
      return () => {
        if (container) {
          container.removeEventListener('scroll', handleScroll);
        }
      };
    }, []);
  
  return (
    <ChatSectionContainer ref={chatConatinerRef}>
      
       <Modal
                 open={open}
                 onClose={handleClose}
                 aria-labelledby="modal-modal-title"
                 aria-describedby="modal-modal-description"
                 >
                  <Box sx={style}>
                  {/* <img src={currentChatUserInfo.imageUrl} height='400px'/> */}
                  {/* <MyImageZoomComponent src={currentChatUserInfo.imageUrl}/> */}
                  <ZoomPinch src={modalImageUrl}/>
                      <h2>{currentChatUserInfo.name}</h2>
                 </Box>
               </Modal>
        <PopOverElement
        id={id}
        open={openPop}
        anchorEl={anchorEl}
        onClose={handleClosePopOver}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <OtherUserProfile handleOpen={handleOpen}/>
      </PopOverElement>       
       <OtherUserInfoHeader style={{width: '100%',left: `${100 - parseInt(widthVal.split("%")[0])}%`}}>
       {
         currentChatUserInfo.imageUrl ? (<ImageBlock3  onClick={()=>{handleOpen(currentChatUserInfo.imageUrl)}}><img src={currentChatUserInfo.imageUrl} height='30px'/></ImageBlock3>) : ( <ImageBlock3><AccountCircleIcon sx={{fontSize:'30px'}}/></ImageBlock3>)
        }
         <H2El onClick={(e)=>{handleClickPop(e)}}>{currentChatUserInfo.name}</H2El>
        <Chip sx={{background:`${currentChatUserInfo.onlineStatus==='online' ? "#aae2aa" : ""}`}} label={currentChatUserInfo.onlineStatus ? currentChatUserInfo.onlineStatus : "offline"}/>
        <MediaBox>
        <VideoCallButton color="primary"  onClick={()=>{sendMessage('vdieoCall');}}>
        <VideoCallIcon sx={{ fontSize: 30,color:'#6d6868' }}/>
       </VideoCallButton>
        <AudioCallButton color="primary" onClick={()=>{sendMessage('audioCall');}}>
        <CallIcon sx={{ fontSize: 30, color:'#6d6868' }}/>
       </AudioCallButton>
        </MediaBox>
        </OtherUserInfoHeader>        
     {
        chatData &&
       chatData.messages && 
       chatData.messages.map((message)=>{
        return(
            <>
            { !message?.isCode && message.messagetype !=="vdieoCall" && message.messagetype !=="audioCall" &&
               (
                
                  currentUser.uid === message.senderId ? (<><ChatP key={message.messageId}>
                    {message?.messagetype==='image' ? (
                       <ImageBlock4  onClick={()=>{handleOpen(message.imageUrl)}}><img src={message.imageUrl} width='120px'/></ImageBlock4>
                    ) : (message.text)}
                    <MessageStatus style={{backgroundColor:`${message.messageStatus !== 'sent' ? "#69b8d2" : ""}`}}>
                    {
                      message.messageStatus === 'sent' ?     <Tooltip title="Unseen"><DoneIcon sx={{width:'16px'}}/></Tooltip> : <Tooltip title="Seen"><DoneAllIcon sx={{width:'16px'}}/></Tooltip>
                    }
                  </MessageStatus>
                  {
                    currentUserImageUrl ? (<ImageBlock><img src={currentUserImageUrl} height='30px'/></ImageBlock>) : ( <ImageBlock style={{right:"-30px"}}><AccountCircleIcon sx={{fontSize:'30px'}}/></ImageBlock>)
                    }
                    </ChatP>
                     </>)  : 
                     <ChatPother key={message.messageId}>
                      {message?.messagetype==='image' ? (
                        <ImageBlock4  onClick={()=>{handleOpen(message.imageUrl)}}><img src={message.imageUrl} width='120px'/></ImageBlock4>
                      ) : (message.text)}
                      {
                    currentChatUserInfo.imageUrl ? (<ImageBlock2 onClick={()=>{handleOpen(currentChatUserInfo.imageUrl)}}><img src={currentChatUserInfo.imageUrl} height='30px'/></ImageBlock2>) : ( <ImageBlock2 style={{right:"-30px"}}><AccountCircleIcon sx={{fontSize:'30px'}}/></ImageBlock2>)
                    }
                      </ChatPother>
                
               )
            }
            {
              message?.isCode &&  message.messagetype !=="vdieoCall" && message.messagetype !=="audioCall" && (
                currentUser.uid === message.senderId ? (<><ChatPCode key={message.messageId}>
                  <Prismjs message={message.text}/>
                  <MessageStatus style={{backgroundColor:`${message.messageStatus !== 'sent' ? "#69b8d2" : ""}`}}>
                  {
                    message.messageStatus === 'sent' ?     <Tooltip title="Unseen"><DoneIcon sx={{width:'16px'}}/></Tooltip> : <Tooltip title="Seen"><DoneAllIcon sx={{width:'16px'}}/></Tooltip>
                  }
                </MessageStatus>
                {
                  currentUserImageUrl ? (<ImageBlock><img src={currentUserImageUrl} height='30px'/></ImageBlock>) : ( <ImageBlock style={{right:"-30px"}}><AccountCircleIcon sx={{fontSize:'30px'}}/></ImageBlock>)
                  }
                  </ChatPCode>
                   </>)  : 
                   <ChatPotherCode key={message.messageId}>
                    <Prismjs message={message.text}/>
                    {
                  currentChatUserInfo.imageUrl ? (<ImageBlock2 onClick={()=>{handleOpen(currentChatUserInfo.imageUrl)}}><img src={currentChatUserInfo.imageUrl} height='30px'/></ImageBlock2>) : ( <ImageBlock2 style={{right:"-30px"}}><AccountCircleIcon sx={{fontSize:'30px'}}/></ImageBlock2>)
                  }
                    </ChatPotherCode>
              )
            }
            {
              ( message.messagetype ==="vdieoCall" || message.messagetype ==="audioCall" ) && 
               <CallElement>{message.senderId === currentUserChatInfo.userId ? currentChatUserInfo.name : "You"}{" called "}{message.senderId === currentUserChatInfo.userId ? "you" : currentChatUserInfo.name}</CallElement>
            }
            </>
        )
    })
     }
   {
    showArrow &&   
    <Arrow onClick={()=>{scrollToBottom()}}>
    <ArrowDownwardIcon/>
   </Arrow>
   }
    </ChatSectionContainer>
  );
});

export default ChatSection;

const Arrow = styled.div`
  position: absolute;
  right: 10px;
  bottom: 10%;
  border: 2px solid black;
  border-radius: 100%;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`

const ChatP = styled.div`
    margin-left: 75%;
    width: 20%;
    text-align: right;
    border-radius: 4px;
    background-color: #d3cece;
    height: max-content !important;
    padding: 6px;
    white-space: normal;
    overflow-wrap: break-word;
    position: relative;
    padding-bottom: 20px;
    @media screen and (max-width: 700px) {
      margin-left: 70%;
    }
`;
const ChatPCode = styled.div`
    margin-left: 45%;
    width: 50%;
    text-align: right;
    border-radius: 4px;
    background-color: #d3cece;
    height: max-content !important;
    padding: 6px;
    white-space: normal;
    overflow-wrap: break-word;
    position: relative;
    padding-bottom: 20px;
    @media screen and (max-width: 700px) {
      width: 90%;
      margin-left: 0%;
    }
`;


const ChatPother = styled.div`
    width: 20%;
    margin-left: 5%;
    height: max-content !important;
    /* overflow: hidden; */
    word-break: break-all;
    text-align: left;
    border-radius: 4px;
    background-color: #dbb5b5;
    padding: 6px;
    position: relative;
`
const ChatPotherCode = styled.div`
    width: 50%;
    margin-left: 5%;
    height: max-content !important;
    /* overflow: hidden; */
    word-break: break-all;
    text-align: left;
    border-radius: 4px;
    background-color: #dbb5b5;
    padding: 6px;
    position: relative;
    @media screen and (max-width: 700px) {
      width: 90%;
    }
`

const MessageStatus = styled.div`
  position: absolute;
  bottom: -2px;
  right: 2px;
  border: 1.5px solid #5c5959;
  border-radius: 100%;
  padding: 0px;
  margin: 0px;
  width: 16px;
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
`
const ImageBlock = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    border-radius: 100%;
    overflow: hidden;
    position: absolute;
    right: -40px;
    bottom: 8px;
`
const ImageBlock2 = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    border-radius: 100%;
    overflow: hidden;
    position: absolute;
    left: -40px;
    bottom: 0px;
`
const ImageBlock3 = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    border-radius: 100%;
    overflow: hidden;
`
const ImageBlock4 = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 120px;
    /* height: 150px; */
    /* border-radius: 100%; */
    overflow: hidden;
`
const OtherUserInfoHeader = styled.div`
  width: 100%;
  height: 50px;
  background-color: #f3f3f3;
  position: absolute;
  top: 0px;
  z-index: 103;
  padding-left: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  left: 0% !important;
    top: -3.5%;
`

const PopOverElement = styled(Popover)`
  .css-17ffvgn-MuiTypography-root{
    height: 450px;
    width: 400px;
  }
`
const H2El = styled.h2`
  cursor: pointer;
`
const MediaBox = styled.div`
  border: 2px solid #eaedea;
  height:35px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  position: absolute;
  right: 50px;
  &:hover{
    border: 2px solid #c7cdc7;
  }
`
const VideoCallButton = styled(IconButton)`
  border-radius: 4px !important;
  height: 35px !important;
`
const AudioCallButton = styled(IconButton)`
    border-radius: 4px !important;
    height: 35px !important;
`
const CallElement = styled.div`
  color: #000000;
  background-color: grey;
  margin-inline: auto;
  padding: 5px 10px;
  border-radius: 4px;
`