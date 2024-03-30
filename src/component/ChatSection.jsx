import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { getFirestore, doc, updateDoc,getDoc } from 'firebase/firestore';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import Tooltip from '@mui/material/Tooltip';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Modal from '@mui/material/Modal';
import { Box } from '@mui/material';
import MyImageZoomComponent from './MyImageZoomComponent ';
import Chip from '@mui/material/Chip';
import ZoomPinch from './ZoomPinch';

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


const ChatSection = ({chatData,widthVal}) => {
  const [open, setOpen] = useState(false);
    const chatConatinerRef = useRef(null);
    const currentUser = useSelector(state => state.userRdx.user); 
    const currentUserChatInfo = useSelector(state => state.userRdx.currentChatInfo);
    const [showArrow,setShowArrow] = useState(false);
    const [modalImageUrl,setModalImageUrl] = useState('');
    const currentUserImageUrl = useSelector(state => state.userRdx.userImageUrl); 
    const currentChatUserInfo = useSelector(state => state.userRdx.currentChatUserInfo);
    // const currentUserDocumentId = useSelector(state => state.userRdx.currentUserDocumentId);
    // console.log(currentUserChatInfo,'sdsd',currentUser,currentUserDocumentId) 
    console.log(currentChatUserInfo,'currentChatUserInfo')

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

    function scrollToBottom(){
      const chatContainer = chatConatinerRef.current;
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }

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
            console.log('Scroll position is not at the bottom');
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
       <OtherUserInfoHeader style={{width:widthVal,left: `${100 - parseInt(widthVal.split("%")[0])}%`}}>
       {
         currentChatUserInfo.imageUrl ? (<ImageBlock3  onClick={()=>{handleOpen(currentChatUserInfo.imageUrl)}}><img src={currentChatUserInfo.imageUrl} height='30px'/></ImageBlock3>) : ( <ImageBlock3><AccountCircleIcon sx={{fontSize:'30px'}}/></ImageBlock3>)
        }
         <h2>{currentChatUserInfo.name}</h2>
        <Chip sx={{background:`${currentChatUserInfo.onlineStatus==='online' ? "#aae2aa" : ""}`}} label={currentChatUserInfo.onlineStatus ? currentChatUserInfo.onlineStatus : "offline"}/>
        </OtherUserInfoHeader>        
     {
        chatData &&
       chatData.messages && 
       chatData.messages.map((message)=>{
        return(
            <>
            {
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
};

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
`