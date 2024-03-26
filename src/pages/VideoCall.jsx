// import React, { useEffect,useRef } from 'react'
// import { Peer } from "peerjs";
// import { useSelector } from 'react-redux';

// export default function VideoCall() {
//     const currentUser = useSelector(state => state.userRdx.user); 
//     const localVideoRef = useRef(null);
//     const remoteVideoRef  = useRef(null);
//     const peerRef = useRef(null);
//     useEffect(() => {
//       peerRef.current = new Peer(`${currentUser.uid}`);
  
//         // Listen for the 'open' event to get the assigned Peer ID
//         peerRef.current.on('open', (id) => {
//             console.log("My peer ID is: " + id);
//             // setPeerId(id); // Set the Peer ID in the state
//         });

//      if(currentUser.uid === 'nDp5BI9eE6ea7QFj42ATJxjhJ613' &&  peerRef.current ){
//       console.log( peerRef.current )
//       setTimeout(()=>{
//         const conn =  peerRef.current.connect("SIQrV2j91XdXTkarIlnN9cGQ8w63");
//         conn.on("open", () => {
//         	conn.send("hi!");
//         });

//         navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//         .then((stream) => {
//             localVideoRef.current.srcObject = stream; // Display local stream
//             peerRef.current.call("SIQrV2j91XdXTkarIlnN9cGQ8w63", stream); // Call the other peer and send local stream
//         })
//         .catch((err) => {
//             console.error("Failed to get local stream", err);
//         });
//       },2000)
//      } 
      
//      peerRef.current.on("connection", (conn) => {
//       conn.on("data", (data) => {
//         // Will print 'hi!'
//         console.log(data);
//       });
//       conn.on("open", () => {
//         conn.send("hello!");
//       });
//     });

//     // peerRef.current.on("call", (call) => {
//       // navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//           // .then((stream) => {
//               // call.answer(stream); // Answer the call with the local stream
//               // call.on("stream", (remoteStream) => {
//               //     remoteVideoRef.current.srcObject = remoteStream; // Display remote stream
//               // });
//           // })
//           // .catch((err) => {
//               // console.error("Failed to get local stream", err);
//           // });
//   // });

//   peerRef.current.on("call", (call) => {
//     console.log('Received call');
//     call.on("stream", (remoteStream) => {
//         console.log('Received remote stream:', remoteStream);
//         if (remoteStream) {
//             remoteVideoRef.current.srcObject = remoteStream; // Display remote stream
//         } else {
//             console.error('Remote stream is null or undefined');
//         }
//     });
// });



  
//         return () => {
//             // Clean up function to disconnect the Peer when the component unmounts
//             peerRef.current .disconnect();
//         };
//     }, []);
//     console.log(currentUser)
//   return (
//     <div>
//     <video ref={localVideoRef} id="localVideo" autoPlay muted></video>
//     <video width={'100'} ref={remoteVideoRef} id="remoteVideo" autoPlay></video>
// </div>
//   )
// }





import React, { useEffect } from 'react';
import { Peer } from "peerjs";

export default function VideoCall() {
let peer;
let currentCall;

async function callUser() {
    const peerId = document.getElementById("peerIdInput").value;

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });

        document.getElementById("menu").style.display = "none";
        document.getElementById("live").style.display = "block";
        document.getElementById("local-video").srcObject = stream;

        const call = peer.call(peerId, stream);

        call.on("stream", (remoteStream) => {
            document.getElementById("remote-video").srcObject = remoteStream;
        });

        call.on("error", (err) => {
            console.error("Call error:", err);
            endCall();
        });

        call.on("close", () => {
            endCall();
        });

        currentCall = call;
    } catch (err) {
        console.error("Failed to access camera and microphone:", err);
        alert("Failed to access camera and microphone. Please check your settings.");
    }
}



function endCall() {
    document.getElementById("menu").style.display = "block";
    document.getElementById("live").style.display = "none";

    if (currentCall) {
        try {
            currentCall.close();
        } catch (err) {
            console.error("Error closing the call:", err);
        }
        currentCall = undefined;
    }
}


useEffect(()=>{
   peer = new Peer({
    iceServers: [
        { urls: ["stun:stun.l.google.com:19302"] },
        { urls: ["turn:numb.viagenie.ca"] },
    ],
});

peer.on("open", function (id) {
    document.getElementById("uuid").textContent = id;
});
  peer.on("call", (call) => {
    if (call.peer) {
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((stream) => {
                document.getElementById("local-video").srcObject = stream;

                call.answer(stream);
                call.on("stream", (remoteStream) => {
                    document.getElementById("remote-video").srcObject = remoteStream;
                });

                call.on("error", (err) => {
                    console.error("Call error:", err);
                    endCall();
                });

                call.on("close", () => {
                    endCall();
                });

                currentCall = call;

                document.getElementById("menu").style.display = "none";
                document.getElementById("live").style.display = "block";
            })
            .catch((err) => {
                console.error("Failed to access camera and microphone:", err);
                alert("Failed to access camera and microphone. Please check your settings.");
            });
    } else {
        call.close();
    }
});
},[])
  return (
    <>
       <div id="menu">
        <p>Your ID:</p>
        <p id="uuid"></p>
        <input type="text" id="peerIdInput" placeholder="Peer ID" />
        <button onClick={()=>{callUser()}}>Connect</button>
    </div>
    <div id="live">
        <video id="remote-video" autoPlay></video>
        <video id="local-video"  autoPlay></video>
        <button id="end-call" onClick={()=>{endCall()}}>End Call</button>
    </div>
    </>
  )
}
