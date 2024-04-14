import React, { useEffect, useState } from 'react';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import styled from 'styled-components';

export default function FileUploadComponent({docElement}) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);

    // const handleFileChange = (event) => {
    //     const file = event.target.files[0];
        
    //     if (file && file.type === "application/pdf") {
    //         setSelectedFile(file);
            
    //         const fileUrl = URL.createObjectURL(file);
    //         setPdfUrl(fileUrl);
    //     } else {
    //         // Handle error for invalid file type
    //         alert('Please select a valid PDF file.');
    //     }
    // };

    useEffect(()=>{
        console.log(docElement,'docELemenr.sad.asd.s.d')
        if (docElement ) {
            setSelectedFile(docElement);
            
            const fileUrl = URL.createObjectURL(docElement);
            setPdfUrl(fileUrl);
        } else {
            // Handle error for invalid file type
            // alert('Please select a valid PDF file.');
        }
    },[])

    return (
        <div>
            {/* <input 
                type="file" 
                accept="application/pdf"
                onChange={handleFileChange}
            /> */}

            {pdfUrl && (
                <DocumentDiv>
                    <DocViewer
                        documents={[{ uri: pdfUrl }]}
                        initialActiveDocument={{ uri: pdfUrl }}
                        pluginRenderers={DocViewerRenderers}
                        fullScreen={true}
                    />
                </DocumentDiv>
            )}
        </div>
    );
}

const DocumentDiv = styled.div`
    height: 100vh;
    overflow: auto;
`;
