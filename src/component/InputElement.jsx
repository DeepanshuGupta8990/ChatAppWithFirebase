import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Importing uuid
import { useDispatch } from 'react-redux';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import CloseIcon from '@mui/icons-material/Close';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import ImageSlider from './ImageSlider';

const InputContainer = styled.div`
  display: flex;
  margin-bottom: 10px;
  padding-inline: 10px;
`;

const InputField = styled.textarea`
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
  border: 1px solid black;
`;

const UploadImageCont = styled.div`
  position: absolute;
  bottom: 4px;
  /* right: 50px; */
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
const ImageBlocks = styled.div`
     display: flex;
    flex-direction: row;
    gap: 0px;
    width: 691px;
    height: 150px;
    padding-top: 12px;
    overflow: auto;
    padding-left: 10px;
`

export default function InputElement() {
  const [inputValue, setInputValue] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(''); // State to hold the URL of the selected image
  const [imageArray,setImageArray] = useState([]);
  const [open, setOpen] = React.useState(false);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);
  const currentUser = useSelector(state => state.userRdx.user); 
  let chatId = useSelector(state => state.chatRdx.chatId); 
  const currentUserChatInfo = useSelector(state => state.userRdx.currentChatInfo);
  const currentUserDocumentId = useSelector(state => state.userRdx.currentUserDocumentId);
  const storage = getStorage();
  
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: window.innerHeight*0.8,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  function isCodeSnippet(message) {
    // Regular expressions to match common JavaScript syntax patterns
    const codePatterns = [
      /function\s+\w*\s*\([^)]*\)\s*{[^}]*}/, // Function declaration
      /async\s+function\s+\w*\s*\([^)]*\)\s*{[^}]*}/, // Async function declaration
      /const\s+\w+\s*=\s*.*/, // Variable declaration
      /let\s+\w+\s*=\s*.*/, // Variable declaration
      /var\s+\w+\s*=\s*.*/, // Variable declaration
      /\bfor\s*\([^)]*\)\s*{[^}]*}/, // For loop
      /\bwhile\s*\([^)]*\)\s*{[^}]*}/, // While loop
      /\bif\s*\([^)]*\)\s*{[^}]*}/, // If statement
      /\belse\s*{[^}]*}/, // Else statement
    ];
  
    // Check if any of the code patterns match the message
    return codePatterns.some(pattern => pattern.test(message));
  }
  
  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleChange1 = (e) => {
    if (e.target.files[0]) {
      console.log(e.target.files);
      setImageArray(Object.values(e.target.files));
      setImage(e.target.files[0]);
      const imageUrl = URL.createObjectURL(e.target.files[0]); // Create URL for selected image
      setImageUrl(imageUrl); // Set the URL to state
    }
  };

  const handleUpload = () => {
    if (!imageArray || imageArray.length === 0) return; // No images selected
  
    imageArray.forEach((img, index) => {
      const storageRef = ref(storage, `images/${img.name}`);
      const uploadTask = uploadBytesResumable(storageRef, img);
  
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Upload progress
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Image ${index + 1} upload is ${progress}% done`);
        },
        (error) => {
          // Handle unsuccessful uploads
          console.error(`Error uploading image ${index + 1}:`, error);
        },
        () => {
          // Handle successful uploads
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log(`File ${index + 1} available at`, downloadURL);
            sendMessage('image',downloadURL)
            // Do something with the download URL if needed
              fileInputRef.current.value = '';
          });
        }
      );
    });
  
    // Clear the imageArray state after upload
    setImageArray([]);
  };
  
 // Handler function to send the message
 const firestore = getFirestore();

 const sendMessage = async (messagetype,imageUrl) => {
  console.log(imageUrl,'imageurlsdasdasdsadsa.ds.ad.sa.das.d.asd.as.')
  if (inputValue.trim() === '' && messagetype === 'text') return; // Don't send empty messages

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
      senderId: currentUser.uid,
      messageStatus: "sent",
      messagetype: messagetype
    };
    
    if (messagetype === 'image') {
      newMessage.imageUrl = imageUrl;
    }

    const isCode = isCodeSnippet(`${inputValue}`);
    console.log(isCode,'iscodesdsdsd')
    if(isCode){
      newMessage.isCode = true;
    }

    
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
        [currentUserChatInfo.id] : {lastMez : ((messagetype==='image' && inputValue==='') ? 'Image' : (isCode ? "Code" : inputValue)), by : 'me', }
      })
      updateLastMessage(currentUserChatInfo.id,{
        [currentUserDocumentId] : {lastMez :  ((messagetype==='image' && inputValue==='') ? 'Image' : (isCode ? "Code" : inputValue)), by : 'otherUser',unreadMezCount:  (unreadMessageCountForOtherUser+1)}
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

  const clearFileInput = () => {
    // Clear the selected files
    fileInputRef.current.value = '';
    setImage(null);
    setImageUrl('');
    setImageArray([]);
  };

  const removeImage = (imageEle)=>{
    let filteredImageArray = imageArray.filter((imageElement)=>{
       if(imageElement.name !== imageEle.name){
        return imageElement
       }
    })
    setImageArray(filteredImageArray)
    if(filteredImageArray.length === 0){
      fileInputRef.current.value = '';
    }
  }

  useEffect(() => {
// Focus the input field when the component mounts
    inputRef.current.focus();
// console.log(inputRef,'input')
  }, [currentUserChatInfo]);

  return (
    <InputContainer>
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <ImageSlider imageArray={imageArray}/>
        </Box>
      </Modal>
      <InputField 
        type="text" 
        value={inputValue} 
        onChange={handleChange} 
        onKeyPress={handleKeyPress}
        placeholder="Enter something..." 
        ref={inputRef}
        rows="1" // Adjust the number of rows as needed
      />
      <FileInput ref={fileInputRef} type="file" onChange={handleChange1} multiple />
      <UploadButton onClick={() => document.querySelector('input[type="file"]').click()}>
        Select Image
      </UploadButton>
      <UploadImageCont>
      <ButtonCont>
      {imageArray.length > 0 && <UploadButton onClick={handleUpload}>Upload</UploadButton>}
      {imageArray.length > 0 && <UploadButton onClick={()=>{clearFileInput()}}>Discard</UploadButton>}
      </ButtonCont>
      {/* {imageUrl && <ImagePreview src={imageUrl} alt="Selected Image" />}  */}
      {imageArray.length > 0  && <ImageBlocks onClick={handleOpen}>
      {
        imageArray.length > 0 && (
          <>
          {
            imageArray.map((imageElement)=>{
              return  (
                <>
              <ImagePreview src={URL.createObjectURL(imageElement)} alt="Selected Image" />
              <Closeicon onClick={(e)=>{e.stopPropagation(); removeImage(imageElement)}}/>
              </>
              )
            })
          }
          </>
        )
      }
      </ImageBlocks>}
      </UploadImageCont>
      <SendButton onClick={()=>{sendMessage("text")}}>Send</SendButton>
    </InputContainer>
  );
}


const Closeicon = styled(CloseIcon)`
  position: relative;
  left: -34px;
  top: -5px;
  border: 2px solid black;
  background-color: white;
  border-radius: 50%;
  cursor: pointer;
`