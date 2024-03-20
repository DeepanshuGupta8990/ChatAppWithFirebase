import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { getFirestore, doc, updateDoc,getDoc } from 'firebase/firestore';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import Tooltip from '@mui/material/Tooltip';

const ChatSectionContainer = styled.div`
  height: 90%;
  background-color: #f0f0f0; /* Example background color */
  border-radius: 8px; /* Example border radius */
  padding: 20px; /* Example padding */
  overflow-y: auto; /* Add scrollbar for vertical overflow */
  display: flex;
  flex-direction: column;
  gap: 10px;
`;


const ChatSection = ({chatData}) => {
    const currentUser = useSelector(state => state.userRdx.user); 
    // const currentUserChatInfo = useSelector(state => state.userRdx.currentChatInfo);
    // const currentUserDocumentId = useSelector(state => state.userRdx.currentUserDocumentId);
    // console.log(currentUserChatInfo,'sdsd',currentUser,currentUserDocumentId) 
    // console.log(chatData,currentUser)

  return (
    <ChatSectionContainer>
     {
        chatData &&
       chatData.messages && 
       chatData.messages.map((message)=>{
        return(
            <>
            {
                currentUser.uid === message.senderId ? <ChatP key={message.messageId}>
                  {message.text}
                  <MessageStatus style={{backgroundColor:`${message.messageStatus !== 'sent' ? "#69b8d2" : ""}`}}>
                  {
                    message.messageStatus === 'sent' ?     <Tooltip title="Unseen"><DoneIcon sx={{width:'16px'}}/></Tooltip> : <Tooltip title="Seen"><DoneAllIcon sx={{width:'16px'}}/></Tooltip>
                  }
                </MessageStatus>
                  </ChatP> : <ChatPother key={message.messageId}>{message.text}</ChatPother>
            }
            </>
        )
    })
     }
    </ChatSectionContainer>
  );
};

export default ChatSection;


const ChatP = styled.div`
    margin-left: 77%;
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
    min-height: max-content;
    overflow: hidden;
    word-break: break-all;
    text-align: left;
    border-radius: 4px;
    background-color: #dbb5b5;
    min-height: 30px;
    padding: 6px;
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