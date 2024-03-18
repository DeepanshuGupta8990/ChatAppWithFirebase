import React, { useEffect, useState } from 'react';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { setChatId } from '../features/counter/chatSlice';
import Logout from './Logout';

export default function SideBar({ widthVal }) {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const firestore = getFirestore();
    const dispatch = useDispatch(); 
    const currentUser = useSelector(state => state.userRdx.user); 

    async function searchAndCreateDocument(customDocId1, customDocId2, data) {
        try {
            const customId1 = customDocId1 + "_" + customDocId2;
            const customId2 = customDocId2 + "_" + customDocId1;

            const customDocRef1 = doc(firestore, 'chats', customId1);
            const customDocRef2 = doc(firestore, 'chats', customId2);

            const docSnapshot1 = await getDoc(customDocRef1);
            const docSnapshot2 = await getDoc(customDocRef2);

            if (docSnapshot1.exists() || docSnapshot2.exists()) {
                console.log(`Document with ID '${customId1}' or ${customId2}' already exists.`);
                if (docSnapshot1.exists()) {
                    dispatch(setChatId({ id: customId1 }));
                }
                if (docSnapshot2.exists()) {
                    dispatch(setChatId({ id: customId2 }));
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
        setSelectedUser(user.userId);
        searchAndCreateDocument(user.userId, currentUser.uid, { messages: [] });
    }
      
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
                    const filteredUsers = userList.filter(user => user.userId !== currentUserUid);
                    setUsers(filteredUsers);
                });

                return unsubscribe;
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, [firestore, currentUser]);

    return (
        <SideBarContainer style={{ width: widthVal }}>
            <HeadingSidebar>
                <h2>User List</h2>
                <Logout />
            </HeadingSidebar>
            <UserListContainer>
                {users.map(user => (
                    <UserItem 
                        key={user.id} 
                        onClick={() => startChat(user)} 
                        selected={selectedUser === user.userId}
                    >
                        {user.name}
                    </UserItem>
                ))}
            </UserListContainer>
        </SideBarContainer>
    );
}

const SideBarContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    height: 100%;
`;

const HeadingSidebar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 2px solid grey;
    @media (max-width: 700px) {
     flex-direction: column;
     justify-content: center;
     align-items: center;
    }
`;

const UserListContainer = styled.div`
    margin: 20px;
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

const UserItem = styled.div`
    padding: 10px;
    border-radius: 4px;
    cursor: pointer;
    text-overflow: ellipsis;
    overflow: hidden;
    word-wrap: normal;
    background-color: ${props => props.selected ? '#007bff' : 'transparent'};
    color: ${props => props.selected ? '#fff' : '#000'};
    &:hover {
        background-color: ${props => props.selected ? '#007bff' : '#f2f2f2'};
        color: ${props => props.selected ? '#fff' : '#000'};
    }
`;
