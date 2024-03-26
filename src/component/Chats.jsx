import React, { useEffect, useRef, useState } from 'react';
import { getFirestore, doc, onSnapshot,updateDoc } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import InputElement from './InputElement';
import ChatSection from './ChatSection';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setLoadingBar, setLoadingPercentage } from '../features/counter/userSlice';


export default function Chats({ widthVal }) {
    let chatID = useSelector(state => state.chatRdx.chatId); 
    const currentUser = useSelector(state => state.userRdx.user); 
    const [chatData, setChatData] = useState(null);
    // const countRef = useRef(0);
    const dispatch = useDispatch();
    const firestore = getFirestore();
    const isLoadingtrue = useSelector(state => state.userRdx.isLoadingtrue); 
    const loadingPercatnge = useSelector(state => state.userRdx.loadingPercentage); 
    useEffect(() => {
        const chatDocRef = doc(firestore, 'chats', chatID);
        
        const unsubscribe = onSnapshot(chatDocRef, async(doc) => {
            // console.log(countRef.current++)
            if (doc.exists()) {
                // console.log(doc.data().messages,currentUser);
                setChatData(doc.data());
                if(isLoadingtrue){
                    // console.log(isLoadingtrue)
                    dispatch(setLoadingBar({val : false}));
                }
                let entry = false;
                const newMessagesArray = doc.data().messages.map((message)=>{
                    if(message.senderId !== currentUser.uid){
                       if(message.messageStatus === 'sent'){
                        entry = true;
                       }
                        return {
                           ...message,
                           messageStatus : "received"
                        }
                    }else{
                        return message
                    }
                })
                // console.log(newMessagesArray);
                if(entry){
                    console.log('updating message status',entry);
                    updateDoc(chatDocRef, { messages: newMessagesArray });
                }
            } else {
                dispatch(setLoadingBar({val : false}));
                setChatData(null); // Document doesn't exist
            }
        });

        return () => unsubscribe();
    }, [chatID]);

    return (
        <div style={{ width: widthVal,height:"100%" }}>
         {/* <Link to="/videoCall">VideoCall</Link> */}
            {
                chatID === '1' 
                ? (
                    <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100%',borderLeft:"2px solid grey"}}>
                        <p>Please select user to chat </p>
                    </div>
                ) :
                (
                    <>
                        <ChatSection chatData={chatData}/>
                        <InputElement/>
                    </>
                )
            }
        </div>
    );
}
