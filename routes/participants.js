var express = require('express');
var router = express.Router();

const CyclicDB = require('@cyclic.sh/dynamodb');
const db = CyclicDB(process.env.CYCLIC_DB);
let participants = db.collection('participants');

// List all participants
router.get('/', async function(req, res, next) {
  try {
    let list = await participants.list();
    res.json(list);
  } catch (error) {
    console.error("Error listing participants:", error);
    res.status(500).send("Error fetching participants");
  }
});

// Get a single participant by email
router.get('/:email', async function(req, res, next) {
  try {
    let item = await participants.get(req.params.email);
    res.json(item);
  } catch (error) {
    console.error("Error getting participant:", error);
    res.status(500).send("Error fetching participant");
  }
});

// Add a new participant
router.post('/', async function(req, res, next) {
  const {email, firstname, lastname, dob, active, work, home} = req.body;
  try {
    await participants.set(email, {
      firstname,
      lastname,
      dob,
      active,
      work,
      home
    });
    res.status(201).send("Participant added");
  } catch (error) {
    console.error("Error adding participant:", error);
    res.status(500).send("Error saving participant");
  }
});

// Update a participant
router.put('/:email', async function(req, res, next) {
  const {firstname, lastname, dob, active, work, home} = req.body;
  try {
    await participants.set(req.params.email, {
      firstname,
      lastname,
      dob,
      active,
      work,
      home
    });
    res.send("Participant updated");
  } catch (error) {
    console.error("Error updating participant:", error);
    res.status(500).send("Error updating participant");
  }
});

// Soft-delete a participant
router.delete('/:email', async function(req, res, next) {
  try {
    // Assuming 'active' is a boolean indicating if the participant is active
    // This will set 'active' to false, effectively soft-deleting the participant
    await participants.set(req.params.email, { active: false });
    res.send("Participant deleted");
  } catch (error) {
    console.error("Error deleting participant:", error);
    res.status(500).send("Error deleting participant");
  }
});

module.exports = router;
