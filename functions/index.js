const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

// Create Inventory
exports.createInventory = functions.https.onRequest(async (req, res) => {
  const data = req.body;

  if (!data.name || !data.quantity) {
    return res.status(400).send("Bad Request");
  }

  try {
    const docRef = await db.collection("inventory").add(data);
    return res.status(201).send(docRef.id);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

// Update Inventory
exports.updateInventory = functions.https.onRequest(async (req, res) => {
  const data = req.body;
  const id = req.params.id;

  if (!data.name && !data.quantity) {
    return res.status(400).send("Bad Request");
  }

  try {
    await db.collection("inventory").doc(id).update(data);
    return res.status(200).send("Inventory Updated");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

// Get Inventory
exports.getInventory = functions.https.onRequest(async (req, res) => {
  try {
    const snapshot = await db.collection("inventory").get();
    const inventory = [];

    snapshot.forEach((doc) => {
      inventory.push({id: doc.id, ...doc.data()});
    });

    return res.status(200).send(inventory);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

// Delete Inventory
exports.deleteInventory = functions.https.onRequest(async (req, res) => {
  const id = req.params.id;

  try {
    await db.collection("inventory").doc(id).delete();
    return res.status(200).send("Inventory Deleted");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});
