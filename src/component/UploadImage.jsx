import React, { useState, useRef } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { Button } from '@mui/material';

export default function UploadImage({ collectionName, documentId }) {
    const [image, setImage] = useState(null);
    const firestore = getFirestore();
    const storage = getStorage();
    const fileInputRef = useRef(null);

    const handleChange1 = (e) => {
        if (e.target.files[0]) {
            console.log(e.target.files[0])
            setImage(e.target.files[0]);
            handleUpload(e.target.files[0]);
        }
    };

    const handleUpload = (file) => {
        const storageRef = ref(storage, `images/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                // Handle unsuccessful uploads
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    const newData = { imageUrl: downloadURL };
                    updateDocument(collectionName, documentId, newData);
                });
            }
        );
    };

    const updateDocument = async (collectionName, documentId, newData) => {
        const docRef = doc(firestore, collectionName, documentId);
        try {
            await updateDoc(docRef, newData);
            console.log(`Document with ID ${documentId} updated successfully.`);
        } catch (error) {
            console.error('Error updating document:', error);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div>
            <Button onClick={handleButtonClick} variant="contained">Update DP</Button>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleChange1} />
        </div>
    );
}
