const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const db = require('./database');

const app = express();
const port = process.argv[2] || process.env.PORT || 4000;
const authCookieName = 'token';

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const apiRouter = express.Router();
app.use('/api', apiRouter);

apiRouter.get('/test', (_req, res) => {
  res.send({ msg: 'Decision Helper service is alive' });
});

apiRouter.post('/suggestions', async (req, res) => {
  const title = String(req.body?.title || '').trim();

  if (!title) {
    return res.status(400).send({ msg: 'A decision title is required' });
  }

  try {
    const response = await fetch(
      `https://api.datamuse.com/words?ml=${encodeURIComponent(title)}&max=12`
    );

    if (!response.ok) {
      throw new Error(`Third-party API error: ${response.status}`);
    }

    const data = await response.json();

    const relatedWords = [...new Set(
      (Array.isArray(data) ? data : [])
        .map((item) => String(item?.word || '').trim())
        .filter((word) => word && word.length > 2)
    )].slice(0, 8);

    const genericCriteria = ['Cost', 'Time', 'Risk', 'Convenience', 'Long-term value'];
    const suggestedCriteria = [...new Set([
      ...genericCriteria,
      ...relatedWords.slice(0, 3).map((word) => word[0].toUpperCase() + word.slice(1)),
    ])].slice(0, 6);

    const suggestedOptions = relatedWords.slice(0, 5).map((word) => ({
      name: word[0].toUpperCase() + word.slice(1),
    }));

    res.send({
      decisionTitle: title,
      suggestedCriteria,
      suggestedOptions,
      source: 'Datamuse',
    });
  } catch (err) {
    res.status(500).send({
      msg: 'Failed to fetch suggestions',
      error: err.message,
    });
  }
});

apiRouter.post('/auth/create', async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');

  if (!email || !password) {
    return res.status(400).send({ msg: 'Email and password are required' });
  }

  const existingUser = await db.getUser('email', email);
  if (existingUser) {
    return res.status(409).send({ msg: 'Existing user' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const token = uuidv4();

  try {
    await db.createUser({
      email,
      password: passwordHash,
      token,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).send({ msg: 'Existing user' });
    }
    throw err;
  }

  setAuthCookie(res, token);
  res.send({ email });
});

apiRouter.post('/auth/login', async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');

  if (!email || !password) {
    return res.status(400).send({ msg: 'Email and password are required' });
  }

  const user = await db.getUser('email', email);
  if (!user) {
    return res.status(401).send({ msg: 'Unauthorized' });
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    return res.status(401).send({ msg: 'Unauthorized' });
  }

  const token = uuidv4();
  await db.updateUserToken(user.email, token);

  setAuthCookie(res, token);
  res.send({ email: user.email });
});

apiRouter.delete('/auth/logout', async (req, res) => {
  const token = req.cookies[authCookieName];
  await db.clearUserToken(token);
  res.clearCookie(authCookieName);
  res.status(204).end();
});

apiRouter.get('/auth/me', async (req, res) => {
  const user = await getUserByToken(req.cookies[authCookieName]);
  if (!user) {
    return res.status(401).send({ msg: 'Unauthorized' });
  }

  res.send({ email: user.email });
});

apiRouter.get('/decisions', async (_req, res) => {
  const decisions = await db.getAllDecisions();
  res.send(decisions);
});

apiRouter.get('/decisions/mine', async (req, res) => {
  const user = await getUserByToken(req.cookies[authCookieName]);
  if (!user) {
    return res.status(401).send({ msg: 'Unauthorized' });
  }

  const userDecisions = await db.getUserDecisions(user.email);
  res.send(userDecisions);
});

apiRouter.post('/decisions', async (req, res) => {
  const user = await getUserByToken(req.cookies[authCookieName]);
  if (!user) {
    return res.status(401).send({ msg: 'Unauthorized' });
  }

  const title = String(req.body?.title || '').trim();
  const criteria = req.body?.criteria;
  const options = req.body?.options;

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

  await db.addDecision(decision);
  res.status(201).send(decision);
});

app.use((_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).send({ msg: 'Server error', error: err.message });
});

async function getUserByToken(token) {
  if (!token) {
    return null;
  }

  return db.getUser('token', token);
}

function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: false,
    httpOnly: true,
    sameSite: 'lax',
  });
}

db.connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
}).catch((err) => {
  console.error('Failed to start service:', err);
  process.exit(1);
});
