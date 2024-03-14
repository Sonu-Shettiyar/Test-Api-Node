const express = require('express');
const router = express.Router();
const MainLayoutModel = require('../models/addModule.model');
const multer = require('multer');
const path = require('path');

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'Uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Init upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 } // 1MB limit
}).single('file');

// Upload endpoint
router.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error uploading file' });
    } else if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
    } else {
      // File uploaded successfully
      res.status(200).json({ filePath: req.file.path });
    }
  });
});

// Create a new document
router.post('/', async (req, res) => {
  try {
    const newDocument = await MainLayoutModel.create(req.body);
    res.status(201).json(newDocument);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all documents
router.get('/', async (req, res) => {
  try {
    const documents = await MainLayoutModel.find({approved:true});
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific document by ID
router.get('/:id', async (req, res) => {
  try {
    const document = await MainLayoutModel.findById(req.params.id);
    if (document) {
      res.json(document);
    } else {
      res.status(404).json({ message: 'Document not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a document by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedDocument = await MainLayoutModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedDocument) {
      res.json(updatedDocument);
    } else {
      res.status(404).json({ message: 'Document not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update specific fields of a document by ID
router.patch('/:id', async (req, res) => {
  try {
    const updatedDocument = await MainLayoutModel.findByIdAndUpdate(
      req.params.id,
      req.body, // Only the fields to be updated are passed directly
      { new: true }
    );
    if (updatedDocument) {
      res.json(updatedDocument);
    } else {
      res.status(404).json({ message: 'Document not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a document by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedDocument = await MainLayoutModel.findByIdAndDelete(req.params.id);
    if (deletedDocument) {
      res.json({ message: 'Document deleted' });
    } else {
      res.status(404).json({ message: 'Document not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});





module.exports = router;
