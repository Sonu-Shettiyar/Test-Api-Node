const express = require('express');
const router = express.Router();
const SingleCompoent = require('../models/singlecomponentModule');
const multer = require('multer');
const path = require('path');
const AttachmentSchema = require('../models/attachments.model');
const mongoose = require('mongoose');
const Tagsmodel = require('../models/tags.module')
const Update = require('../models/timeline.module');



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'Uploads/'); // Save uploaded files to the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`); // Use the original filename for uploaded files
  }
});
const upload = multer({ storage: storage ,limits:{ fileSize: 1024 * 1024 } });

router.post('/attachmnetpost', upload.single('attachmentfiles'), async (req, res) => {
  try {
   
    const { id, tab } = req.body;
    const newData = new AttachmentSchema({
      id,
      tab,
      originalname: req.file.originalname,
      filename:req.file.filename,
      path:req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      destination:req.file.destination
    });

    const result = await newData.save();

    res.status(201).json(result); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




router.post('/urlpostreq',upload.none(), async (req, res) => {
  try {

    const {id,tab,url,name} = req.body
   
    const newData = new AttachmentSchema({
      id,
      tab,
      name,
      url:JSON.parse(url)
    });

    const result = await newData.save();
    res.status(201).json(result); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});






router.post('/noteplacement', upload.array('files', 10), async (req, res) => {
  try {
 
    const { id, title, note,tab } = req.body;

   
    const filesData = req.files.map(file => ({
      originalname: file.originalname,
      encoding: file.encoding,
      mimetype: file.mimetype,
      destination: file.destination,
      filename: file.filename,
      path: file.path,
      size: file.size
    }));


    const newData = new SingleCompoent({
      id,
      tab:tab,
      title,
      note,
      files: filesData 
    });

   
    const result = await newData.save();
    if (result) {
      res.status(201).json(result); 
    }else{
      res.status(400).json(result);
    }

   // Send the saved data back as JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get('/noteplacement1/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await SingleCompoent.find({ id: id ,tab:"notes"});
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get('/attachmetfetchdata/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await AttachmentSchema.find({ id:id});
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get('/fetchdataid/:id',upload.none(),async (req, res) => {
  try {
    const { id } = req.params;
  
    const result = await AttachmentSchema.find({ _id:id});
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.delete('/deleteNote/:id1', async (req, res) => {
  try {
    const { id1 } = req.params;
  
    const result = await SingleCompoent.findByIdAndDelete({ _id: id1 ,tab:"notes"});
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/deleteCompleteNotes/:id',upload.none(), async (req, res) => {
  try {
    const { id } = req.params;
  
     await SingleCompoent.deleteMany({id:id});
      await AttachmentSchema.deleteMany({ id:id});
      await Tagsmodel.findOneAndDelete({id:id});
      await Update.findOneAndDelete({id:id})
    res.status(201).json('deleted');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});





router.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '..', 'uploads', filename);
  console.log(filePath);
  res.download(filePath, filename, err => {
    if (err) {
      console.error('Error downloading the file:', err);
    }
  });
});



router.delete('/deleteFiles/:id1', async (req, res) => {
  try {
    const { id1 } = req.params;
    
    const result = await AttachmentSchema.findByIdAndDelete({ _id: id1 ,tab:"attachment"});
    res.status(201).json({result:result});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.delete('/deletefile/:editid1', async (req, res) => {
  try {
    const { editid1 } = req.params;
    const { editfiles } = req.body;

 
    if (!editid1 || !mongoose.Types.ObjectId.isValid(editid1)) {
      return res.status(400).json({ error: 'Valid document id (editid1) must be provided' });
    }


    if (!Array.isArray(editfiles)) {
      return res.status(400).json({ error: 'Editfiles should be provided as an array' });
    }

    let deletedCount = 0;

    for (const file of editfiles) {
      const { id, filename } = file;
      console.log(`Deleting file with id: ${id} from document with id: ${editid1}`);
      try {
        const result = await SingleCompoent.updateOne(
          { _id: editid1 },
          { $pull: { files: { _id: id } } }
        );
        // console.log(result);
        if (result.nModified > 0) {
          deletedCount++;
        }
      } catch (error) {
        console.error(`Error deleting file with id ${id}:`, error);
      
      }
    }

   
    if (deletedCount > 0) {
      console.log(`${deletedCount} file(s) deleted successfully`);
      res.status(200).json({ message: `${deletedCount} file(s) deleted successfully` });
    } else {
      console.log('No files found for deletion');
      res.status(200).json({ message: 'No files found for deletion' });
    }
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});














router.put('/updateNote/:id', upload.array('files'), async (req, res) => {
  try {
    const { id } = req.params; // Moved declaration of id here
    const { title, note } = req.body;
  
    const filesData = req.files.map(file => ({
      originalname: file.originalname,
      encoding: file.encoding,
      mimetype: file.mimetype,
      destination: file.destination,
      filename: file.filename,
      path: file.path,
      size: file.size
    })); 

    const existingDocument = await SingleCompoent.findById(id);

    if (!existingDocument) {
      return res.status(404).json({ error: "Document not found" });
    }

   const updatedDocument = {
    ...existingDocument.toObject(),
    title:req.body.title || existingDocument.title,
    note:req.body.note || existingDocument.note,
    files:existingDocument.files.concat(filesData)
   }

    const result = await SingleCompoent.findByIdAndUpdate(
      id,
      updatedDocument,
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.status(200).json({result:result});
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/editurlone/:id1', upload.none(), async (req, res) => {
  try {
    const { id1 } = req.params; // Moved declaration of id here
    const { url, name } = req.body;
  
    const url1 = JSON.parse(url);
  

    const existingDocument = await AttachmentSchema.findById(id1);

    if (!existingDocument) {
      return res.status(404).json({ error: "Document not found" });
    }

   const updatedDocument = {
    
    url:url1 || existingDocument.url,
    name:req.body.name || existingDocument.name,
    
   }

    const result = await AttachmentSchema.findByIdAndUpdate(
      id1,
      updatedDocument,
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.status(200).json('asjbdjsabd');
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/update-data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.params);
    const [{ text, date, tab,action }] = req.body; 
console.log(req.body);
  
    const existingDocument = await Update.findOne({ id: id });

    if (existingDocument) {
      existingDocument.updates.push({ tab,action,text, date });
      await existingDocument.save();
    } else {
     
      const newDocument = new Update({
       
        id:id, 
        updates: [{ tab,action,text, date }]
        
      });
      await newDocument.save();
    }

    res.status(200).json({ message: 'Update saved successfully' });
  } catch (error) {
    console.error('Error saving update:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

});




router.get('/gettimline/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.params);
  const today = new Date();
  const fordays = new Date(today);
   fordays.setDate(today.getDate()-4)
    let existingDocument = await Update.findOne({ id: id,"updates.date":{$gte:fordays.toISOString(),$lte:today.toISOString()}});
       
    res.status(200).json({ existingDocument });
  } catch (error) {
    console.error('Error saving update:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});








router.post('/insetTages/:id', upload.none(), async (req, res) => {
  try {
    const { id } = req.params;
    const { tags, selected } = req.body;
    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', tags);
    let tagColorPairs;

    if (Array.isArray(tags) && tags.length > 1) {
      tagColorPairs = tags.map(tagColor => {
        const [tag, color] = tagColor.split(':');
        return { tag, color };
      });
    } else if (typeof tags === 'string') {
      const [tag, color] = tags.split(':');
      tagColorPairs = [{ tag, color }];
    } else {
    
      tagColorPairs = [];
    }
 
 

    const pum = selected.split(',');
    const existingDocument = await Tagsmodel.findOne({ id });
   
    if (existingDocument) {
      const tagsToDelete = existingDocument.tags.filter(tag => !pum.includes(tag.tag));
      console.log(tagsToDelete);
      
      if (tagsToDelete.length > 0) {
        const tagIdsToDelete = tagsToDelete.map(tag => tag._id);
        console.log(tagIdsToDelete);
       
        const sum = await Tagsmodel.updateMany(
          { id },
          { $pull: { tags: { _id: { $in: tagIdsToDelete } } } }
        );
       
      } 
      const existingTags = existingDocument.tags.map(item => item.tag);
        const newTags = tagColorPairs.filter(item => !existingTags.includes(item.tag) && pum.includes(item.tag));
        const tagsToDelete1 = existingDocument.tags.filter(tag => !pum.includes(tag.tag));
        const sum = tagsToDelete1.length > 0 ? tagsToDelete1.map(tag => tag.tag) : "";
        
      
        const updatedDocument = await Tagsmodel.findOneAndUpdate(
          { id },
          { $push: { tags: { $each: newTags } } },
          { new: true }
        );
        res.status(200).json({updatedDocument,sum});
    } else {
      const newDocument = new Tagsmodel({ id, tags: tagColorPairs });
      const savedDocument = await newDocument.save();
      res.status(200).json(savedDocument);
    }
  } catch (error) {
    console.error('Error saving update:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/getTags/:id',upload.none(), async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Tagsmodel.findOne({ id:id});
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;


