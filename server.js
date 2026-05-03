// ================== IMPORTS ==================
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

// ================== APP INIT ==================
const app = express();
app.use(cors());
app.use(express.json());

// ================== RESPONSE HELPERS ==================
const sendSuccess = (res, data, status = 200) => {
  res.status(status).json({
    success: true,
    data: data
  });
};

const sendError = (res, message, status = 500) => {
  res.status(status).json({
    success: false,
    error: message
  });
};

// ================== FIREBASE INIT (SAFE) ==================
let db;

try {
  const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  db = admin.firestore();
  console.log("✅ Firebase initialized");

} catch (err) {
  console.error("🔥 Firebase init error:", err.message);
}

// ================== ROUTES ==================

app.get("/", (req, res) => {
  res.status(200).send("OK");
});


// HEALTH CHECK
app.get("/health", (req, res) => {
  res.send("OK");
});

// TEST
app.get("/", (req, res) => {
  res.send("Backend Running");
});

// ================== EVENTS ==================

// CREATE EVENT
app.post("/events", async (req, res) => {
  try {
    const data = req.body;

    if (!data.name || !data.startTime || !data.endTime) {
      return sendError(res, "Missing required fields", 400);
    }

    const doc = await db.collection("events").add(data);

    sendSuccess(res, { id: doc.id }, 201);

  } catch (err) {
    console.error(err);
    sendError(res, err.message);
  }
});

// GET CURRENT EVENT
app.get("/events/current", async (req, res) => {
  try {
    const now = new Date().toISOString();

    const snapshot = await db.collection("events")
      .where("startTime", "<=", now)
      .where("endTime", ">=", now)
      .get();

    const events = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    sendSuccess(res, events[0] || null);

  } catch (err) {
    console.error(err);
    sendError(res, err.message);
  }
});

// ================== ANNOUNCEMENTS ==================

// CREATE ANNOUNCEMENT
app.post("/announcements", async (req, res) => {
  try {
    const data = req.body;

    if (!data.title || !data.displayFrom || !data.displayTo) {
      return sendError(res, "Missing required fields", 400);
    }

    const doc = await db.collection("announcements").add(data);

    sendSuccess(res, { id: doc.id }, 201);

  } catch (err) {
    console.error(err);
    sendError(res, err.message);
  }
});

// GET ACTIVE ANNOUNCEMENTS
app.get("/announcements/active", async (req, res) => {
  try {
    const now = new Date().toISOString();

    const snapshot = await db.collection("announcements")
      .where("displayFrom", "<=", now)
      .where("displayTo", ">=", now)
      .get();

    let data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    data.sort((a, b) => (b.priority || 0) - (a.priority || 0));

    sendSuccess(res, data);

  } catch (err) {
    console.error(err);
    sendError(res, err.message);
  }
});

// ================== LIVE MATCHES ==================

app.get("/matches/live", (req, res) => {
  res.json({
    success: true,
    data: [
    {
      team1: "MU-A",
      team2: "BITS Hyderabad",
      score: "MU - 179/3 (15.4 overs)",
      status: "Live",
      event_type: "AIRO",
      sport: "CRICKET"   // 🔥 NEW
    },
    {
      team1: "Gitam",
      team2: "MU-B",
      score: "Gitam 123/5 (12.5 overs)",
      status: "Live",
      event_type: "AIRO",
      sport: "CRICKET"
    },
    {
      team1: "MU-A",
      team2: "MJCET",
      score: "2 - 1",
      status: "Live",
      event_type: "AIRO",
      sport: "FOOTBALL"
    },
    {
      team1: "MU",
      team2: "BITS Hyderabad",
      score: "42-38",
      status: "Live",
      event_type: "AIRO",
      sport: "BASKETBALL"
    }
  ]
  });
});

// ================== SERVER ==================

const PORT = process.env.PORT || 7000;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});