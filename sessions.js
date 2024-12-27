const express = require('express');
const router = express.Router();
const Session = require('../models/Session');

router.post('/create', async (req, res) => {
  try {
    const newSession = new Session(req.body);
    await newSession.save();
    res.status(201).json({ message: 'Session created successfully', session: newSession });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create session' });
  }
});

router.get('/', async (req, res) => {
  try {
    const sessions = await Session.find();
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

module.exports = router;
