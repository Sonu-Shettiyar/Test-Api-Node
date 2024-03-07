
const express = require('express');
const router = express.Router();
const { Task, Meeting, Call, CloseTask , CloseCall, CloseMeeting} = require('../models/activity.model');
const nodemailer = require('nodemailer');
router.post('/tasks', async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
 
router.post('/meetings', async (req, res) => {
  try {
    const meeting = await Meeting.create(req.body);
    res.status(201).json(meeting);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
 
router.post('/calls', async (req, res) => {
  try {
    const call = await Call.create(req.body);
    res.status(201).json(call);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
 
 
 
router.get('/tasks/:id', async (req, res) => {
    try {
        const data = await Task.find({userId:req.params.id});
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
 
router.get('/meetings/:id', async (req, res) => {
    try {
        const data = await Meeting.find({userId:req.params.id});
        const data = await Meeting.find({userId:req.params.id});
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
 
router.get('/calls/:id', async (req, res) => {
    try {
        const data = await Call.find({userId:req.params.id});
        const data = await Call.find({userId:req.params.id});
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
 
 
router.delete('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedData = await Task.findByIdAndDelete(id);
        if (!deletedData) {
            return res.status(404).json({ error: 'Data not found' });
        }
        res.status(200).json({ message: 'Data deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
 
router.delete('/meetings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedData = await Meeting.findByIdAndDelete(id);
        if (!deletedData) {
            return res.status(404).json({ error: 'Data not found' });
        }
        res.status(200).json({ message: 'Data deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.delete('/calls/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedData = await Call.findByIdAndDelete(id);
        if (!deletedData) {
            return res.status(404).json({ error: 'Data not found' });
        }
        res.status(200).json({ message: 'Data deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.post('/tasks/closetask', async (req, res) => {
    try {
      const task = await CloseTask.create(req.body);
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
 
  router.post('/meetings/closemeeting', async (req, res) => {
    try {
      const task = await CloseMeeting.create(req.body);
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  router.post('/calls/closecall', async (req, res) => {
    try {
      const task = await CloseCall.create(req.body);
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
 
 
  router.get('/tasks/closetask/:id', async (req, res) => {
    try {
        const data = await CloseTask.find({userId:req.params.id});
        const data = await CloseTask.find({userId:req.params.id});
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
 
router.get('/meetings/closemeeting/:id', async (req, res) => {
    try {
        const data = await CloseMeeting.find({userId:req.params.id});
        const data = await CloseMeeting.find({userId:req.params.id});
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
 
router.get('/calls/closecall/:id', async (req, res) => {
    try {
        const data = await CloseCall.find({userId:req.params.id});
        const data = await CloseCall.find({userId:req.params.id});
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
 
router.delete('/closetasks/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const deletedData = await CloseTask.findByIdAndDelete(id);
      if (!deletedData) {
          return res.status(404).json({ error: 'Data not found' });
      }
      res.status(200).json({ message: 'Data deleted successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});
 
router.delete('/closemeetings/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const deletedData = await CloseMeeting.findByIdAndDelete(id);
      if (!deletedData) {
          return res.status(404).json({ error: 'Data not found' });
      }
      res.status(200).json({ message: 'Data deleted successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});
 
 
router.delete('/closecalls/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const deletedData = await CloseCall.findByIdAndDelete(id);
      if (!deletedData) {
          return res.status(404).json({ error: 'Data not found' });
      }
      res.status(200).json({ message: 'Data deleted successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});
 
 
const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'test@accelgrowthtech.com',
    pass: 'LfDAXtcIHIKAC9',
  },
});
 
// Send email
router.post('/send-email', async (req, res) => {
  const { to, subject, message } = req.body;
 
  try {
    // Send email
    await transporter.sendMail({
      from: 'test@accelgrowthtech.com',
      to,
      subject,
      text: message,
    });
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Failed to send email');
  }
});
module.exports = router;