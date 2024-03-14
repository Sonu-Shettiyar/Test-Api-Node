const express = require('express');
const router = express.Router();
const FormDataModel = require('../models/formFeilds.model');


// CREATE: POST route to create a new dynamic data document
// CREATE: POST route to create a new dynamic data document
router.post('/', async (req, res) => {
    try {
        const { organizationId, moduleId, image, sections } = req.body;

        const newData = {
            organizationId,
            moduleId,
            image,
            sections
        };

        const result = await FormDataModel.create(newData);
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const updatedDocument = await FormDataModel.findByIdAndUpdate(
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

// READ: GET route to get all dynamic data documents
router.get('/', async (req, res) => {
    try {
        const data = await FormDataModel.find();
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/module/:moduleId', async (req, res) => {
    const { moduleId } = req.params;
    try {
        const data = await FormDataModel.find({ moduleId: moduleId }).populate('moduleId');
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// READ: GET route to get a dynamic data document by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = await FormDataModel.findById(id);
        if (!data) {
            return res.status(404).json({ error: 'Data not found' });
        }
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// UPDATE: PUT route to update a dynamic data document by ID
router.put('/:id', async (req, res) => {
    try {


        const { id } = req.params;

        const { organizationId, moduleId, image, ...formFields } = req.body;


        const existingdocument = await FormDataModel.findOne({ _id: id });
        if (!existingdocument) {
            res.status(400).json({ msg: 'document not found' })
        }

        const newData = {
            organizationId,
            moduleId,
            image,
            ...formFields
        }

        const updatedData = await FormDataModel.findByIdAndUpdate(id, newData, { new: true });
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
        const deletedData = await FormDataModel.findByIdAndDelete(id);
        if (!deletedData) {
            return res.status(404).json({ error: 'Data not found' });
        }
        res.status(200).json({ message: 'Data deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/deletephoto/:photoid', async (req, res) => {
    try {
        const { photoid } = req.params;

        const result = await FormDataModel.findByIdAndUpdate({ _id: photoid }, { image: "" });
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/addphoto/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await FormDataModel.findByIdAndUpdate({ _id: id }, { image: req.body.data }, { new: true });
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.patch('/infodata/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const sum = await FormDataModel.findOne({ _id: id });
        if (!sum) {
            res.status(400).json({ msg: "document not found" });
        }
        const newdata = {
            'sections.0.fields.Email': req.body.Email,
            'sections.0.fields.Secondary Email': req.body.SecondEmail,
            'sections.0.fields.Untitled Name': req.body.name,
            'sections.0.fields.Untitled Owner': req.body.owner,

        }
        const updatedDocument = await FormDataModel.findOneAndUpdate(
            { _id: id, 'sections._id': sum.sections[0]._id },
            { $set: newdata },
            { new: true }
        );


        res.status(200).json(updatedDocument);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }


});




module.exports = router;