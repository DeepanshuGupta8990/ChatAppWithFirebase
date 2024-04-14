import React from 'react';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import styled from 'styled-components';

export default function DocViewerComp({docUrl}) {
    const docs = [
        // { uri: "http://localhost:5000/getPdf?url=https://firebasestorage.googleapis.com/v0/b/chatapp2-dbd6b.appspot.com/o/images%2FDeepanshuGupta_Resume...pdf?alt=media&token=12d27e5f-3613-465a-a297-9e6c3af4463c" },
        { uri: docUrl },
      ];
  return (
    <DocumentDiv>
     {
      docUrl &&     
      <DocViewer
      documents={docs}
      initialActiveDocument={docs[1]}
      pluginRenderers={DocViewerRenderers}
      fullScreen={true} 
      />
     }
    </DocumentDiv>
  )
}

const DocumentDiv = styled.div`
  height: 100vh;
  overflow: auto;
`