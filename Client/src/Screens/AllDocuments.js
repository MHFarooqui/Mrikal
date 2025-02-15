import React, { useEffect, useState } from 'react';
import './AllDocuments.css'; 
import DocumentEditor from './DocumentEditor';
import { IoIosAddCircle } from "react-icons/io";

export default function AllDocuments() {
    const [allDocuments, setAllDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDocumentId, setSelectedDocumentId] = useState(null); 
    const [showAddForm, setShowAddForm] = useState(false); 
    const [newDocumentContent, setNewDocumentContent] = useState(''); 

    useEffect(() => {
        const fetchAllDocuments = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/document/get");
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log(data);
                setAllDocuments(data);
            } catch (error) {
                console.error('Error fetching documents:', error);
            } finally {
                setLoading(false); 
            }
        };

        fetchAllDocuments();
    }, []); 

    const handleUpdateClick = (documentId) => {
        setSelectedDocumentId(documentId); 
    };

    const handleAddClick = () => {
        setShowAddForm(true); 
    };

    const handleSaveClick = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/document/create", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: newDocumentContent }), 
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Document created:', data);

            // Refresh the document list
            const fetchResponse = await fetch("http://localhost:5000/api/document/get");
            const updatedDocuments = await fetchResponse.json();
            setAllDocuments(updatedDocuments);

            
            setShowAddForm(false);
            setNewDocumentContent('');
        } catch (error) {
            console.error('Error saving document:', error);
        }
    };

    if (loading) {
        return <p>Loading...</p>; 
    }

    return (
        <div className="all-documents">
            {selectedDocumentId ? (
                <DocumentEditor documentId={selectedDocumentId} onBack={() => setSelectedDocumentId(null)} />
            ) : (
                <div className="document-list">
                    {allDocuments.length > 0 ? (
                        allDocuments.map((document) => (
                            <div key={document._id || document.id} className="document-card">
                                <p>Id : {document._id}</p>
                                <p>created At :  {document.CreatedAt.substring(0, 10)}</p>
                                <button
                                    className="update-button"
                                    onClick={() => handleUpdateClick(document._id || document.id)}
                                >
                                    Update
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No documents found.</p>
                    )}
                    <IoIosAddCircle
                        color='gray'
                        size={55}
                        style={{ paddingTop: 55, cursor: 'pointer' }}
                        onClick={handleAddClick}
                    />
                </div>
            )}
            {showAddForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Add New Document</h3>
                        <input
                            type="text"
                            placeholder="Document Content"
                            value={newDocumentContent}
                            onChange={(e) => setNewDocumentContent(e.target.value)}
                        />
                        <button onClick={handleSaveClick}>Save</button>
                        <button onClick={() => setShowAddForm(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}