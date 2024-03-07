const express = require('express');
const router = express.Router();
const OptionsDataModel = require('../models/options.model');

router.post('/', async (req, res) => {
    try {
        const result = await OptionsDataModel.create(req.body);
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// READ: GET route to get all dynamic data documents
router.get('/', async (req, res) => {
    try {
        const data = await OptionsDataModel.find();
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = await OptionsDataModel.findById(id);
        if (!data) {
            return res.status(404).json({ error: 'Data not found' });
        }
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/tag/:tagId', async (req, res) => {
    const { tagId } = req.params;
    try {
        const data = await OptionsDataModel.findOne({ tagId })
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const updatedDocument = await OptionsDataModel.findByIdAndUpdate(
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

// UPDATE: PUT route to update a dynamic data document by ID
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const existingdocument = await OptionsDataModel.findOne({ _id: id });
        if (!existingdocument) {
            res.status(400).json({ msg: 'document not found' })
        }

        const updatedData = await OptionsDataModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedData) {
            return res.status(404).json({ error: 'Data not found' });
        }
        res.status(200).json('updated');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE: DELETE route to delete a dynamic data document by ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedData = await OptionsDataModel.findByIdAndDelete(id);
        if (!deletedData) {
            return res.status(404).json({ error: 'Data not found' });
        }
        res.status(200).json({ message: 'Data deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;