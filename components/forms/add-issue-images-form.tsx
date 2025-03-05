"use client";
import React, { useState } from "react";

function AddIssueImagesForm() {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFiles(Array.from(event.target.files));
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      const formData = new FormData();
      selectedFiles.forEach((file, index) => {
        formData.append(`file-${index}`, file);
      });

      // Send formData to the server
      // Example:
      // fetch('/upload', {
      //   method: 'POST',
      //   body: formData,
      // });
      console.log("Files to upload:", selectedFiles);
    }
  };
  console.log(selectedFiles);
  return (
    <div>
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Files</button>
      {selectedFiles.length > 0 && (
        <div>
          <p>Selected files:</p>
          <ul>
            {selectedFiles.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AddIssueImagesForm;
