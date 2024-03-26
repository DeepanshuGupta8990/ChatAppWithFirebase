import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Importing uuid
import { useDispatch } from 'react-redux';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

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

const FileInput = styled.input`
  display: none;
`;

const UploadButton = styled.button`
  padding: 8px 16px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #218838;
  }
`;

const ImagePreview = styled.img`
  width: 200px; /* Set width as needed */
  height: auto; /* Maintain aspect ratio */
  margin-right: 10px;
`;

const UploadImageCont = styled.div`
  position: absolute;
  bottom: 60px;
  right: 50px;
  display: flex;
  flex-direction: column-reverse;
  justify-content: center;
  align-items: center;
`
const ButtonCont = styled.div`
display: flex;
justify-content: center;
align-items: center;
flex-direction: row;
`

export default function InputElement() {
  const [inputValue, setInputValue] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(''); // State to hold the URL of the selected image
  const inputRef = useRef(null);
  const currentUser = useSelector(state => state.userRdx.user); 
  let chatId = useSelector(state => state.chatRdx.chatId); 
  const currentUserChatInfo = useSelector(state => state.userRdx.currentChatInfo);
  const currentUserDocumentId = useSelector(state => state.userRdx.currentUserDocumentId);
  const storage = getStorage();
  
  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleChange1 = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      const imageUrl = URL.createObjectURL(e.target.files[0]); // Create URL for selected image
      setImageUrl(imageUrl); // Set the URL to state
    }
  };

  const handleUpload = () => {
    if (!image) return; // No image selected
    const storageRef = ref(storage, `images/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Upload progress
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        // Handle unsuccessful uploads
        console.error('Error uploading image:', error);
      },
      () => {
        // Handle successful uploads
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          setImageUrl(null);
          // Do something with the download URL if needed
        });
      }
    );
  };
 // Handler function to send the message
 const firestore = getFirestore();
 const sendMessage = async (messagetype) => {
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
      messagetype: messagetype,
    };

    // Update the messages array by appending the new message
    const updatedMessages = [...currentMessages, newMessage];

    const currentUserDocRef = doc(firestore, 'users', currentUserDocumentId);
    const otherUserDocRef = doc(firestore, 'users', currentUserChatInfo.id);

    const [currentUserDoc, otherUserDoc] = await Promise.all([
      getDoc(currentUserDocRef),
      getDoc(otherUserDocRef)
    ]);

    if (currentUserDoc.exists() && otherUserDoc.exists()) {
      // Both documents exist, you can now update them
      // const currentUserData = currentUserDoc.data();
      const otherUserData = otherUserDoc.data();
      // console.log(otherUserData,'otherUserData');
      // const unreadMessageCountForCurrentUser = currentUserData[currentUserChatInfo.id]?.unreadMezCount || 0;
      const unreadMessageCountForOtherUser = otherUserData[currentUserDocumentId]?.unreadMezCount || 0;
      // console.log(unreadMessageCountForOtherUser,'unreadMessageCountForOtherUser')
      // Update the chat document with the updated messages array
      await updateDoc(chatDocRef, { messages: updatedMessages });
      updateLastMessage(currentUserDocumentId,{
        [currentUserChatInfo.id] : {lastMez : inputValue, by : 'me', }
      })
      updateLastMessage(currentUserChatInfo.id,{
        [currentUserDocumentId] : {lastMez : inputValue, by : 'otherUser',unreadMezCount:  (unreadMessageCountForOtherUser+1)}
      })
    }
  } catch (error) {
    console.error('Error adding message to Firestore:', error);
  }

  // Clear the input field after sending the message
  setInputValue('');
};


  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      sendMessage("text");
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

  useEffect(() => {
// Focus the input field when the component mounts
    inputRef.current.focus();
// console.log(inputRef,'input')
  }, [currentUserChatInfo]);

  return (
    <InputContainer>
      <InputField 
        type="text" 
        value={inputValue} 
        onChange={handleChange} 
        onKeyPress={handleKeyPress}
        placeholder="Enter something..." 
        ref={inputRef}
      />
      <FileInput type="file" onChange={handleChange1} />
      <UploadButton onClick={() => document.querySelector('input[type="file"]').click()}>
        Select Image
      </UploadButton>
      <UploadImageCont>
      <ButtonCont>
      {imageUrl && <UploadButton onClick={handleUpload}>Upload</UploadButton>}
      {imageUrl && <UploadButton onClick={()=>{setImageUrl(null)}}>Discard</UploadButton>}
      </ButtonCont>
      {imageUrl && <ImagePreview src={imageUrl} alt="Selected Image" />} {/* Display the selected image */}
      </UploadImageCont>
      <SendButton onClick={()=>{sendMessage("text")}}>Send</SendButton>
    </InputContainer>
  );
}
