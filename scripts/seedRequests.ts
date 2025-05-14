const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");
const faker = require("@faker-js/faker");
const path = require("path");
const fs = require("fs");

const serviceAccountPath = path.resolve(
  __dirname,
  "firebase-service-account.json"
);
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

// ---- Initialize Firebase Admin ----
initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

// ---- Constants ----
const centerLat = 40.716009;
const centerLng = -74.015166;
const radiusMeters = 3218.69; // 2 miles
const NUM_REQUESTS = 10;

const generateNearbyCoordinates = () => {
  const radiusInDegrees = radiusMeters / 111320; // Rough conversion from meters to degrees

  const u = Math.random();
  const v = Math.random();
  const w = radiusInDegrees * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const latOffset = w * Math.cos(t);
  const lngOffset = (w * Math.sin(t)) / Math.cos(centerLat * (Math.PI / 180));

  return {
    latitude: centerLat + latOffset,
    longitude: centerLng + lngOffset,
  };
};

const seedRequests = async () => {
  const batch = db.batch();
  const requestsRef = db.collection("requests");

  for (let i = 0; i < NUM_REQUESTS; i++) {
    const id = requestsRef.doc().id;
    const coordinates = generateNearbyCoordinates();
    const requestText = faker.faker.lorem.sentence();
    const paymentAmount = faker.faker.number.int({ min: 5, max: 50 });
    const duration = faker.faker.number.int({ min: 10, max: 60 });

    const request = {
      id,
      createdAt: Timestamp.now(),
      location: coordinates,
      radius: { meters: 500 },
      requestText,
      paymentAmount,
      duration,
      acceptedAt: null,
    };

    batch.set(requestsRef.doc(id), request);
  }

  await batch.commit();
  console.log(`✅ Seeded ${NUM_REQUESTS} requests within 2 miles of center`);
};

seedRequests().catch(console.error);
