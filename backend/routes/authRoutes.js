const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// Simple in-memory sessions.
// NOTE: This is not persisted; server restart clears sessions.
const sessions = new Map(); // sessionId -> { userId, name, email }

function base64UrlEncode(obj) {
  const json = JSON.stringify(obj);
  return Buffer.from(json)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

// Returns a JWT-shaped token so existing frontend (decodeJWT) can read payload.name.
// But it is NOT a signed JWT and we do not verify it on the backend.
function createFrontendToken(session) {
  const header = { alg: 'none', typ: 'JWT' };
  const payload = { id: session.userId, email: session.email, name: session.name };
  // Signature is intentionally dummy.
  return `${base64UrlEncode(header)}.${base64UrlEncode(payload)}.signature`;
}

function createSessionForUser(user) {
  const sessionId = crypto.randomBytes(24).toString('hex');
  const session = { userId: String(user._id), name: user.name, email: user.email };
  sessions.set(sessionId, session);
  return { sessionId, session };
}


router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const { sessionId, session } = createSessionForUser(user);
    const token = createFrontendToken(session);

    return res.status(201).json({
      message: 'Registration successful.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      // Keep same response shape expected by frontend.
      token,
      sessionId,
    });

  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Unable to create account. Please try again later.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const { sessionId, session } = createSessionForUser(user);
    const token = createFrontendToken(session);
    return res.status(200).json({
      message: 'Login successful.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
      sessionId,
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Unable to log in. Please try again later.' });
  }
});

module.exports = router;

