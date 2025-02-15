import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import './DocumentEditor.css'

const socket = io('http://localhost:5000'); 

const DocumentEditor = ({ documentId, onBack }) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the document when the component mounts or documentId changes
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/document/get/${documentId}`);
        console.log('Fetched Document:', response.data);
        setContent(response.data.content); 
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching document:', error);
        setError('Failed to fetch document. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchDocument();
  }, [documentId]);

  // Listening updates
  useEffect(() => {
    const handleDocumentChange = (change) => {
      if (change.documentKey._id === documentId) {
        console.log('Document changed:', change);
        setContent(change.updateDescription.updatedFields.content); // Update the content state
      }
    };

    socket.on('document-change', handleDocumentChange);

    return () => {
      socket.off('document-change', handleDocumentChange); 
    };
  }, [documentId]);

  // Handle content updates
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent); 

    axios
      .put(`http://localhost:5000/api/document/update/${documentId}`, {
        content: newContent,
      })
      .then((response) => {
        console.log('Document updated:', response.data);
      })
      .catch((error) => {
        console.error('Error updating document:', error);
        setError('Failed to update document. Please try again.');
      });
  };

  if (isLoading) {
    return <div className="loading-state">Loading...</div>;
  }
  
  if (error) {
    return <div className="error-state">{error}</div>;
  }

  return (
    <div className="document-editor">
      <h1>Real-Time Document Editor</h1>
      <button className="back-button" onClick={onBack}>Back to Documents</button>
      <textarea
        value={content} 
        onChange={handleContentChange}
        placeholder="Start typing..."
      />
    </div>
  );
};

export default DocumentEditor;