import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Importing uuid
import { useDispatch } from 'react-redux';
import { getFirestore, doc, updateDoc,getDoc } from 'firebase/firestore';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

const InputContainer = styled.div`
  display: flex;
  margin-bottom: 10px;
`;

const InputField = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
`;

const SendButton = styled.button`
  padding: 8px 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #0056b3;
  }
`;

export default function InputElement() {
  const [inputValue, setInputValue] = useState('');
  const currentUser = useSelector(state => state.userRdx.user); 
  let chatId = useSelector(state => state.chatRdx.chatId); 
  const currentUserChatInfo = useSelector(state => state.userRdx.currentChatInfo);
  const currentUserDocumentId = useSelector(state => state.userRdx.currentUserDocumentId);
  // console.log(currentUserChatInfo,'sdsd',currentUser,currentUserDocumentId) 
  // Handler function to update the input value
  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  // Handler function to send the message
  const firestore = getFirestore();
  const sendMessage = async () => {
    if (inputValue.trim() === '') return; // Don't send empty messages

    // Generate unique message ID using uuid()
    const messageId = uuidv4();

    // Add the message to the Firestore chat document
    const chatDocRef = doc(firestore, 'chats', chatId);

    try {
      // Get the current messages array from the document
      const chatDocSnapshot = await getDoc(chatDocRef);
      let currentMessages = chatDocSnapshot.data().messages || []; // Initialize as empty array if undefined

      // Ensure currentMessages is an array
      if (!Array.isArray(currentMessages)) {
        currentMessages = [];
      }

      // Construct the new message object
      const newMessage = {
        text: inputValue,
        timestamp: new Date().toISOString(),
        messageId: messageId,
        senderId : currentUser.uid,
        messageStatus: "sent",
      };

      // Update the messages array by appending the new message
      const updatedMessages = [...currentMessages, newMessage];

      // Update the chat document with the updated messages array
      await updateDoc(chatDocRef, { messages: updatedMessages });
      updateLastMessage(currentUserDocumentId,{
        [currentUserChatInfo.id] : {lastMez : inputValue, by : 'me'}
      })
      updateLastMessage(currentUserChatInfo.id,{
        [currentUserDocumentId] : {lastMez : inputValue, by : 'otherUser'}
      })
    } catch (error) {
      console.error('Error adding message to Firestore:', error);
    }

    // Clear the input field after sending the message
    setInputValue('');
  };

  // Handler function to send the message when Enter key is pressed
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

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

  return (
    <InputContainer>
      <InputField 
        type="text" 
        value={inputValue} 
        onChange={handleChange} 
        onKeyPress={handleKeyPress}
        placeholder="Enter something..." 
      />
      <SendButton onClick={sendMessage}>Send</SendButton>
    </InputContainer>
  );
}
