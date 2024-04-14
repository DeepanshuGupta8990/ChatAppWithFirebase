import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const MyEditor = () => {
  const [editorHtml, setEditorHtml] = useState('');

  return (
    <ReactQuill
      theme="snow"
      value={editorHtml}
      onChange={(e)=>{console.log(e)}}
      readOnly={true}
    />
  );
};

export default MyEditor;
