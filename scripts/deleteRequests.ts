const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
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
const NUM_REQUESTS = 10; // Change this to delete more/less

const deleteLastRequests = async () => {
  const snapshot = await db
    .collection("requests")
    .orderBy("createdAt", "desc")
    .limit(NUM_REQUESTS)
    .get();

  if (snapshot.empty) {
    console.log("No requests found to delete.");
    return;
  }

  const batch = db.batch();

  snapshot.docs.forEach((doc: any) => {
    console.log(`Deleting request ${doc.id}`);
    batch.delete(doc.ref);
  });

  await batch.commit();
  console.log(`✅ Deleted ${snapshot.size} request(s).`);
};

deleteLastRequests().catch((err) => {
  console.error("❌ Error deleting requests:", err);
});
