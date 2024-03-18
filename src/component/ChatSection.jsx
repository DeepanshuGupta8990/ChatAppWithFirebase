import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

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
    console.log(chatData,currentUser)
  return (
    <ChatSectionContainer>
     {
        chatData &&
       chatData.messages && 
       chatData.messages.map((message)=>{
        return(
            <>
            {
                currentUser.uid === message.senderId ? <ChatP key={message.messageId}>{message.text}</ChatP> : <ChatPother key={message.messageId}>{message.text}</ChatPother>
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