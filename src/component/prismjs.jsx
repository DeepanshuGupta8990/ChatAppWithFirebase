import React, { useEffect, useRef, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript'; 
import { Button } from '@mui/material';

export default function Prismjs({ message }) {
    const codeBlockRef = useRef(null);
    const [isCopied,setIsCopied] = useState(false);
   function copyText(text){
    navigator.clipboard.writeText(text)
    .then(() => {
      console.log('Text copied to clipboard:', text);
      setIsCopied(true);
      setTimeout(()=>{
          setIsCopied(false);
      },2000)
    })
   }

    useEffect(() => {
        // When the component mounts, highlight the code using Prism.js
        Prism.highlightAll();
    }, []);


    return (
        <>
        <Button variant="contained" onClick={()=>{copyText(message)}}>{isCopied ? "Copied" : "COpy"}</Button>
        <pre>
            <code ref={codeBlockRef} className="language-javascript">
                {/* {formattedMessage} */}
                {message}
            </code>
        </pre>
        </>
    );
}
