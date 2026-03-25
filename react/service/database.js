const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${encodeURIComponent(config.password)}@${config.hostname}/?appName=Cluster0`;
const client = new MongoClient(url);
const db = client.db('startup');

const userCollection = db.collection('user');
const decisionCollection = db.collection('decision');

let connected = false;

async function connectToDatabase() {
  if (!connected) {
    await client.connect();
    await db.command({ ping: 1 });

    await userCollection.createIndex({ email: 1 }, { unique: true });
    await userCollection.createIndex({ token: 1 });
    await decisionCollection.createIndex({ ownerEmail: 1, createdAt: -1 });

    connected = true;
    console.log(`Connected to MongoDB at ${config.hostname}`);
  }
}

async function getUser(field, value) {
  await connectToDatabase();

  if (!value) {
    return null;
  }

  return userCollection.findOne({ [field]: value });
}

async function createUser(user) {
  await connectToDatabase();
  await userCollection.insertOne(user);
  return user;
}

async function updateUserToken(email, token) {
  await connectToDatabase();
  await userCollection.updateOne({ email }, { $set: { token } });
}

async function clearUserToken(token) {
  await connectToDatabase();

  if (!token) {
    return;
  }

  await userCollection.updateOne({ token }, { $unset: { token: "" } });
}

async function addDecision(decision) {
  await connectToDatabase();
  await decisionCollection.insertOne(decision);
  return decision;
}

async function getUserDecisions(ownerEmail) {
  await connectToDatabase();
  return decisionCollection.find({ ownerEmail }).sort({ createdAt: -1 }).toArray();
}

async function getAllDecisions() {
  await connectToDatabase();
  return decisionCollection.find({}).sort({ createdAt: -1 }).limit(50).toArray();
}

module.exports = {
  connectToDatabase,
  getUser,
  createUser,
  updateUserToken,
  clearUserToken,
  addDecision,
  getUserDecisions,
  getAllDecisions,
};
