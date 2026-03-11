const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const port = process.argv[2] || process.env.PORT || 4000;
const authCookieName = 'token';

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let users = [];
let decisions = [
  {
    id: uuidv4(),
    ownerEmail: 'demo@decisionhelper.app',
    title: 'Where should we eat tonight?',
    criteria: ['Price', 'Speed', 'Craving satisfaction'],
    options: [
      { name: 'Costa Vida', scores: [7, 8, 8] },
      { name: 'Cafe Rio', scores: [6, 7, 9] },
    ],
    createdAt: new Date().toISOString(),
  },
];

const apiRouter = express.Router();
app.use('/api', apiRouter);

apiRouter.get('/test', (_req, res) => {
  res.send({ msg: 'Decision Helper service is alive' });
});

apiRouter.get('/quote', async (_req, res) => {
  try {
    const response = await fetch('https://api.quotable.io/random');
    if (!response.ok) {
      throw new Error(`Third-party API error: ${response.status}`);
    }

    const data = await response.json();
    res.send({
      content: data.content,
      author: data.author,
    });
  } catch (err) {
    res.status(500).send({
      msg: 'Failed to fetch quote',
      error: err.message,
    });
  }
});

apiRouter.post('/auth/create', async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).send({ msg: 'Email and password are required' });
  }

  const existingUser = findUser('email', email);
  if (existingUser) {
    return res.status(409).send({ msg: 'Existing user' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    email,
    password: passwordHash,
    token: uuidv4(),
  };

  users.push(user);
  setAuthCookie(res, user.token);
  res.send({ email: user.email });
});

apiRouter.post('/auth/login', async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).send({ msg: 'Email and password are required' });
  }

  const user = findUser('email', email);
  if (!user) {
    return res.status(401).send({ msg: 'Unauthorized' });
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    return res.status(401).send({ msg: 'Unauthorized' });
  }

  user.token = uuidv4();
  setAuthCookie(res, user.token);
  res.send({ email: user.email });
});

apiRouter.delete('/auth/logout', (_req, res) => {
  res.clearCookie(authCookieName);
  res.status(204).end();
});

apiRouter.get('/auth/me', (req, res) => {
  const user = getUserByToken(req.cookies[authCookieName]);
  if (!user) {
    return res.status(401).send({ msg: 'Unauthorized' });
  }

  res.send({ email: user.email });
});

apiRouter.get('/decisions', (_req, res) => {
  res.send(decisions);
});

apiRouter.get('/decisions/mine', (req, res) => {
  const user = getUserByToken(req.cookies[authCookieName]);
  if (!user) {
    return res.status(401).send({ msg: 'Unauthorized' });
  }

  const userDecisions = decisions.filter((decision) => decision.ownerEmail === user.email);
  res.send(userDecisions);
});

apiRouter.post('/decisions', (req, res) => {
  const user = getUserByToken(req.cookies[authCookieName]);
  if (!user) {
    return res.status(401).send({ msg: 'Unauthorized' });
  }

  const { title, criteria, options } = req.body || {};
  if (!title || !Array.isArray(criteria) || !Array.isArray(options)) {
    return res.status(400).send({ msg: 'title, criteria, and options are required' });
  }

  const decision = {
    id: uuidv4(),
    ownerEmail: user.email,
    title,
    criteria,
    options,
    createdAt: new Date().toISOString(),
  };

  decisions.unshift(decision);
  res.status(201).send(decision);
});

app.use((_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((err, _req, res, _next) => {
  res.status(500).send({ msg: 'Server error', error: err.message });
});

function findUser(field, value) {
  return users.find((user) => user[field] === value);
}

function getUserByToken(token) {
  if (!token) {
    return null;
  }
  return findUser('token', token);
}

function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: false,
    httpOnly: true,
    sameSite: 'lax',
  });
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
