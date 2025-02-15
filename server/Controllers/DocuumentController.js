const Document = require('../Models/DocumentSchema');
require('dotenv').config();

const CreateDocument = async (req, res) => {
    try {
        const { content } = req.body;
        const NewDocument = new Document({ content });
        await NewDocument.save();

        res.status(201).json(NewDocument);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Some error occurred' });
    }
};

const GetDocument = async (req, res) => {
    try {
        const AllDocuments = await Document.find();
        res.status(200).json(AllDocuments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Some error occurred' });
    }
};

const GetDocumentByID = async (req, res) => {
    try {
        const id = req.params.id;
        const document = await Document.findById(id);

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        res.status(200).json(document);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Some error occurred' });
    }
};

const UpdateDocument = async (req, res) => {
    try {
      const id = req.params.id;
      const { content } = req.body;
  
      const UpdatedDocument = await Document.findByIdAndUpdate(
        id,
        { $set: { content } },
        { new: true }
      );
  
      if (!UpdatedDocument) {
        return res.status(404).json({ message: 'Document not found' });
      }
  
      // Emit a real-time update event to all connected clients
      const io = req.app.get('io'); 
      io.emit('document-change', {
        documentKey: { _id: id },
        updateDescription: { updatedFields: { content: UpdatedDocument.content } },
      });
  
      res.status(200).json(UpdatedDocument);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Some error occurred' });
    }
  };

module.exports = { CreateDocument, UpdateDocument, GetDocument, GetDocumentByID };