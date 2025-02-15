const express = require('express');
const { CreateDocument, GetDocument, UpdateDocument, GetDocumentByID } = require('../Controllers/DocuumentController');

const router = express.Router();

// Middleware to attach io to the request
const attachIO = (req, res, next) => {
    req.app.set('io', req.io); // Attach the io instance to the app
    next();
};

router.post("/create", CreateDocument);
router.get("/get", GetDocument);
router.get("/get/:id", GetDocumentByID);
router.put("/update/:id", attachIO, UpdateDocument); // Use the middleware for the update route

module.exports = router;