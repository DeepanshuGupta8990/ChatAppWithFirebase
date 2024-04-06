import React, { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';

export default function VideoCall() {
  const [peerId, setPeerId] = useState('');
  const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const currentUserVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerInstance = useRef(null);

  const callUser = (remotePeerId) => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        setLocalStream(mediaStream);
        currentUserVideoRef.current.srcObject = mediaStream;
        // currentUserVideoRef.current.play();
       console.log(remotePeerId,mediaStream,'media')
        const callU = peerInstance.current.call(remotePeerId, mediaStream);
        console.log(callU)
        callU.on('stream', (remoteStream) => {
          setRemoteStream(remoteStream);
          remoteVideoRef.current.srcObject = remoteStream;
          // remoteVideoRef.current.play();
        });
      })
      .catch(error => {
        console.error('Error accessing media devices:', error);
      });
  }

  useEffect(()=>{
    const urlParams = new URLSearchParams(window.location.search);
    const callId = urlParams.get("callId");
    if(callId){
      console.log(callId,'callId')
      setTimeout(()=>{
        // callUser(callId);
      },1000)
    }
  },[])

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
  
    const myId = urlParams.get('myId');
    console.log(myId,'myId')
  
    if (myId) {
      const peer = new Peer(Math.floor(Math.random()*1000000)+'WQeE32');
  // const peer = new Peer(`${myId.slice(0,7)}`);
  // const peer = new Peer(myId);
      peer.on('open', (id) => {
        console.log(id)
        setPeerId(id)
      });
  
      peer.on('call', (call) => {
        console.log('calllllll')
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          .then((mediaStream) => {
            setLocalStream(mediaStream);
            currentUserVideoRef.current.srcObject = mediaStream;
  
            call.answer(mediaStream);
  
            call.on('stream', async(remoteStream) => {
              setRemoteStream(remoteStream);
              remoteVideoRef.current.srcObject = remoteStream;
              if(remoteVideoRef.current){
                //  await remoteVideoRef.current.play();
              }
            });
          })
          .catch(error => {
            console.error('Error accessing media devices:', error);
          });
      });
  
      peerInstance.current = peer;
    } else {
      console.error('myId is null or undefined');
    }
  
    return () => {
      // Cleanup on component unmount
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (remoteStream) {
        remoteStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [])
  

  return (
    <div className="App">
      <h1>Current user id is {peerId}</h1>
      <input type="text" value={remotePeerIdValue} onChange={e => setRemotePeerIdValue(e.target.value)} />
      <button onClick={() => callUser(remotePeerIdValue)}>Call</button>
      <div>
        <video ref={currentUserVideoRef} autoPlay/>
      </div>
      <div>
        <video ref={remoteVideoRef} autoPlay/>
      </div>
    </div>
  );
}
