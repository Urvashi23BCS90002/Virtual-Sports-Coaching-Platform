const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('Error connecting to MongoDB:', err));

// Routes
const sessionRoutes = require('./src/routes/sessions');
const aiRoutes = require('./src/routes/ai');

app.use('/sessions', sessionRoutes);
app.use('/ai', aiRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

import { S3 } from 'aws-sdk';

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

export const uploadVideo = async (file) => {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `videos/${file.name}`,
      Body: file,
    };
    const uploadResult = await s3.upload(params).promise();
    console.log('Video uploaded successfully:', uploadResult.Location);
    return uploadResult.Location;
  } catch (error) {
    console.error('Error uploading video:', error);
    throw new Error('Failed to upload video');
  }
};

export const getVideoURL = async (key) => {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    };
    const videoURL = s3.getSignedUrl('getObject', params);
    console.log('Generated Video URL:', videoURL);
    return videoURL;
  } catch (error) {
    console.error('Error fetching video URL:', error);
    throw new Error('Failed to fetch video URL');
  }
};

import React from 'react';
import './App.css';
import SessionList from './components/SessionList';

function App() {
  return (
    <div className="App">
      <h1>Virtual Sports Coaching Platform</h1>
      <SessionList />
    </div>
  );
}

export default App;
import React, { useEffect, useState } from 'react';

const SessionList = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    fetch('/sessions')
      .then((res) => res.json())
      .then((data) => setSessions(data))
      .catch((err) => console.error('Error fetching sessions:', err));
  }, []);

  return (
    <div>
      <h2>Available Sessions</h2>
      <ul>
        {sessions.map((session) => (
          <li key={session._id}>{session.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default SessionList;

