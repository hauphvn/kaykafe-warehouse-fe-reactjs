import './FileUpload.scss';

import { useState } from 'react';

function FileUpload() {
  const [fileContent, setFileContent] = useState('');

  const handleFileRead = (event: any) => {
    const content = event.target.result;
    setFileContent(content);
  };

  const handleFileUpload = (event: any) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = handleFileRead;
    reader.readAsText(file);
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      {fileContent && <p>File contents: {fileContent}</p>}
    </div>
  );
}

export default FileUpload;
