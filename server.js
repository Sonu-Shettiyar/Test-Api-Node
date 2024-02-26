// server.js
const express = require('express');
const mongoose = require('mongoose');
const mainLayoutRoutes = require('./routes/addModule.route');
const formLayoutRoutes = require('./routes/formFeilds.routes');
const singlerouter = require('./routes/NotesModule.route')
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const allowedOrigins = ['http://localhost:8889']; 
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.get('/favicon.ico', (req, res) => res.status(204));
app.use('/', mainLayoutRoutes);
app.use('/forms', formLayoutRoutes);
app.use('/single',singlerouter)

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });
