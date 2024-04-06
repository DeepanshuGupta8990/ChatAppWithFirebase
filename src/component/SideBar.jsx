import React, { useContext, useEffect, useRef, useState } from 'react';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { doc, getDoc, setDoc,updateDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { setChatId } from '../features/counter/chatSlice';
import Logout from './Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { setCurrentChatInfo, setCurrentUserDocumentID, setCurretnChatUSerInfo, setLoadingBar, setUserImageUrl, setUserName } from '../features/counter/userSlice';
import UploadImage from './UploadImage';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SideBarOptions from './SideBarOptions';
import { ThemeContext } from '../ThemeContext';

export default function SideBar({ widthVal }) {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [open, setOpen] = useState(false);
    const firestore = getFirestore();
    const dispatch = useDispatch(); 
    const entry = useRef(false);
    const currentUser = useSelector(state => state.userRdx.user); 
    const currentUserImageUrl = useSelector(state => state.userRdx.userImageUrl); 
    const userName = useSelector(state => state.userRdx.name); 
    const currentUserDocumentId = useSelector(state => state.userRdx.currentUserDocumentId);
    const isLoadingtrue = useSelector(state => state.userRdx.isLoadingtrue); 
    const currentChatUserInfo = useSelector(state => state.userRdx.currentChatUserInfo);
    // console.log(currentUserImageUrl,'currentUser')
    // console.log(theme,'theme valaue.......')
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        minWidth: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        display: 'flex',
        justifyContent:"center",
        alignItems:"center",
        flexDirection:"column"
    };
    
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    async function searchAndCreateDocument(customDocId1, customDocId2, data, otherUserDocID) {
        try {
            const customId1 = customDocId1 + "_" + customDocId2;
            const customId2 = customDocId2 + "_" + customDocId1;

            const customDocRef1 = doc(firestore, 'chats', customId1);
            const customDocRef2 = doc(firestore, 'chats', customId2);

            const docSnapshot1 = await getDoc(customDocRef1);
            const docSnapshot2 = await getDoc(customDocRef2);

            if (docSnapshot1.exists() || docSnapshot2.exists()) {
                // console.log(`Document with ID '${customId1}' or ${customId2}' already exists.`);
                if (docSnapshot1.exists()) {
                    dispatch(setChatId({ id: customId1 }));
                }
                if (docSnapshot2.exists()) {
                    dispatch(setChatId({ id: customId2 }));
                }
                const currentUserDocRef = doc(firestore, 'users', currentUserDocumentId);
                const currentUserDocSnapshot = await getDoc(currentUserDocRef);
                // console.log(currentUserDocSnapshot.data()[otherUserDocID],'data...');
                const currentUserData = currentUserDocSnapshot.data();
                if(currentUserData[otherUserDocID]){
                    currentUserData[otherUserDocID].unreadMezCount = 0;
                    await setDoc(currentUserDocRef, currentUserData);
                }
            } else {
                const customDocId = `${customDocId1}_${customDocId2}`;
                const customDocRef = doc(firestore, 'chats', customDocId);
                await setDoc(customDocRef, data);
                dispatch(setChatId({ id: customDocId }));
                console.log(`Document with ID '${customDocId}' created successfully!`);
            }
        } catch (error) {
            console.error('Error searching for document:', error);
        }
    }

    async function startChat(user) {
        // console.log(user);
        if(!isLoadingtrue && user.userId !== selectedUser){
            dispatch(setLoadingBar({val: true}))
        }
        setSelectedUser(user.userId);
        setTimeout(()=>{
            dispatch(setCurretnChatUSerInfo({val:user}))
            dispatch(setCurrentChatInfo({obj:user}))
            searchAndCreateDocument(user.userId, currentUser.uid, { messages: [] },user.id);
        },400)
    }

    function getLastMessageTime(timeStamp) {
        const messageTime = new Date(timeStamp);
        const currentTime = new Date();
        
        const diffTime = currentTime - messageTime;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            // Today
            return `${messageTime.getHours()}:${messageTime.getMinutes()}`;
        } else if (diffDays === 1) {
            // Yesterday
            return 'Yesterday';
        } else {
            // Older than yesterday
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const month = months[messageTime.getMonth()];
            const date = messageTime.getDate();
            return `${date} ${month}`;
        }
    }

    const openHalfSizeWindow = (id,callId) => {
        // Get the current window's width and height
        const fullWidth = window.innerWidth;
        const fullHeight = window.innerHeight;
    
        // Calculate half of the width and height
        const halfWidth = fullWidth / 2;
        const halfHeight = fullHeight / 2;
    
        // Calculate the centered position
        const leftPosition = (fullWidth - halfWidth) / 2;
        const topPosition = (fullHeight - halfHeight) / 2;
    console.log(callId,'calliddsmmdnasdnaskldaskdnj')
        // Open a new window with half the size and centered position
        window.open(`http://localhost:3000/videoCall?myId=${id}&callId=${callId}`, 'New Window', `width=${halfWidth},height=${halfHeight},left=${leftPosition},top=${topPosition}`);
    };
    

    useEffect(()=>{
       async function func(){
        const currentUserCallRef = doc(firestore, 'calls', currentUserDocumentId);
        let currentUserCallRefSnapShot = await getDoc(currentUserCallRef);
        if (!currentUserCallRefSnapShot.exists()) {
            console.log('Document does not exist for current user');
            const userDocRef = doc(collection(firestore, 'calls'), currentUserDocumentId);
            await setDoc(userDocRef, {
              calls: []
            });
          }
       }
       if(currentUserDocumentId !== ""){
           func();
        }
    },[currentUserDocumentId])

    useEffect(() => {
        async function func() {
            const userDocRef = doc(firestore, 'calls', currentUserDocumentId); // Create document reference
            const unsubscribe = onSnapshot(userDocRef, snapshot => { // Subscribe to document changes
                if (snapshot.exists()) {
                    const userData = snapshot.data().calls;
                    // Do something with the data
                    console.log(userData);
                    if(entry.current && userData[userData.length-1].senderId !== currentUserDocumentId){
                        const callIdForVideoCall = Math.floor(Math.random()*1000000)+'WQeE32';
                        console.log(userData[userData.length-1].callIdForVideoCall,'userData[userData.length-1].callIdForVideoCall')
                        openHalfSizeWindow(callIdForVideoCall,userData[userData.length-1].callIdForVideoCall)
                    }
                    entry.current = true;
                } else {
                    console.log("Document does not exist");
                }
            });
            return unsubscribe;
        }
    
        if (currentUserDocumentId !== "") {
            func();
        }
    }, [currentUserDocumentId]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersCollection = collection(firestore, 'users');
                const unsubscribe = onSnapshot(usersCollection, snapshot => {
                    const userList = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));

                    const currentUserUid = currentUser.uid;
                    const filteredUsers = userList.filter((user) => {
                        if(user.userId === currentUserUid){
                          dispatch(setUserName({
                            name : user.name
                          }));
                          dispatch(setUserImageUrl({
                            val: user.imageUrl || null
                          }));
                          dispatch(setCurrentUserDocumentID({
                            val : user.id
                          }))
                        }
                       return( user.userId !== currentUserUid );
                    });
                    // console.log(filteredUsers)
                    // setUsers(filteredUsers);
                    const chatUser = filteredUsers.filter((user)=>{
                        if(currentChatUserInfo.userId === user.userId ){
                          return user;
                        }
                    })
                    // console.log(chatUser,'chatuser.....')
                    // console.log(filteredUsers,'filteredUsers')
                    filteredUsers.sort((a, b) => {
                        const timeA = a[currentUserDocumentId]?.time || 0;
                        const timeB = b[currentUserDocumentId]?.time || 0;
                        return timeB - timeA; // Sort in descending order of time
                    });
                    
                    // console.log(filteredUsers);
                    setUsers(filteredUsers);
                    if(chatUser.length>0){
                        dispatch(setCurretnChatUSerInfo({val:chatUser[0]}))
                    }
                });

                return unsubscribe;
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, [firestore, currentUser,currentUserDocumentId]);

    return (
        <SideBarContainer style={{ width: widthVal }} onClick={()=>{toggleTheme(34234)}}>
            <SideBarOptions/>
            {/* <HeadingSidebar> */}
                {/* <h2>User List</h2> */}
                {/* <Logout /> */}
            {/* </HeadingSidebar> */}
             <UserListDiv>
                <UserHeader/>
             <UserListContainer>
                {users.map((user,index) => (
                    <UserItem 
                        key={user.id} 
                        onClick={() => startChat(user)} 
                        selected={selectedUser === user.userId}
                        style={{transform: `translateY(${index * 80}px)`}}
                    >
                        <UserDiv>
                        {
                            user.imageUrl ? (<ImageBlock><img src={user.imageUrl} height='40px'/></ImageBlock>) : (<AccountCircleIcon fontSize='large' sx={{fontSize:"40px"}}/>)
                        }
                        </UserDiv>
                       <div style={{display:'flex',flexDirection:'column'}}>
                       <Typography variant="h5" component="h2" sx={{color:`${selectedUser === user.userId ? "white" : "black"}`}} style={{padding:'0px',margin:'0px'}}>{user.name}</Typography>
                        {
                           user[currentUserDocumentId] && <LastMez widthVal={widthVal}>{user[currentUserDocumentId].lastMez}</LastMez>
                        }
                       </div>
                       {user[currentUserDocumentId]?.time && <LastMezTime>{getLastMessageTime(user[currentUserDocumentId].time)}</LastMezTime>}
                    </UserItem>
                ))}
            </UserListContainer>
             </UserListDiv>
               <Modal
                 open={open}
                 onClose={handleClose}
                 aria-labelledby="modal-modal-title"
                 aria-describedby="modal-modal-description"
               >
                 <Box sx={style}>
                {
            currentUserImageUrl ? (<img src={currentUserImageUrl} width='200px'/>) : ( <AccountCircleIcon fontSize='large'/>)
        }
                   <UserName>{userName.toUpperCase()}</UserName>
                   <UploadImage collectionName={'users'} documentId={currentUser.uid}/>
                 </Box>
               </Modal>
          {/* <UserDetails onClick={handleOpen}>
          {
            currentUserImageUrl ? (<ImageBlock><img src={currentUserImageUrl} height='50px'/></ImageBlock>) : ( <AccountCircleIcon fontSize='large'/>)
          }
          <UserName>{userName.toUpperCase()}</UserName>
          </UserDetails> */}
        </SideBarContainer>
    );
}

const SideBarContainer = styled.div`
    display: flex;
    flex-direction: row;
    /* justify-content: ; */
    height: 100%;
`;

// const HeadingSidebar = styled.div`
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     padding: 20px;
//     /* border-bottom: 2px solid grey; */
//     @media (max-width: 700px) {
//      flex-direction: column;
//      justify-content: center;
//      align-items: center;
//     }
// `;

const UserListContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    height: 100%;
    width: 100%;
    padding-top: 50px;
    position: relative;
`;
const UserListDiv = styled.div`
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    height: 90%;
    overflow-y: auto;
    width: 100%;
`;

const UserItem = styled.div`
    padding: 10px;
    border-radius: 4px;
    cursor: pointer;
    min-height: 60px;
    text-overflow: ellipsis;
    overflow: hidden;
    word-wrap: normal;
    display: flex;
    flex-direction: row;
    gap: 10px;
    padding-bottom: 0px;
    background-color: ${props => props.selected ? '#007bff' : '#f8f5f5'};
    color: ${props => props.selected ? '#fff' : '#000'};
    transition: all 0.2s ease; /* Smooth transition effect */
    &:hover {
        background-color: ${props => props.selected ? '#007bff' : '#f2f2f2'};
        color: ${props => props.selected ? '#fff' : '#000'};
    }
    position: absolute;
    width: 90%;
`;


const UserName = styled.h1`
    text-align: center;
    max-height: 100px;
    margin: 0px;
    padding: 6px;
    overflow: hidden;
    text-overflow: ellipsis;
`

const LastMez = styled.div`
    overflow: hidden;
    text-overflow: ellipsis;
    max-height: 25px;
    white-space: nowrap;
    width: ${props =>  parseInt(props?.widthVal.split('%')[0]) - 15 }%;
    min-width: 30px;
`;



const UserDiv = styled.div`
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
`

const UserDetails = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    background-color: #e8e6e6;
    cursor: pointer;
`

const ImageBlock = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    border-radius: 100%;
    overflow: hidden;
`

const UserHeader = styled.div`
  width: 100%;
  height: 50px;
  background-color: #f3f3f3;
  z-index: 100;
  position: absolute;
  top: 0px;
  left: 0px;
`

const LastMezTime = styled.p`
    position: absolute;
    right: 4px;
    bottom: -14px;
`
