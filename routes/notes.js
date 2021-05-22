const express = require("express");

const Note = require("../models/Note");

const auth = require("../middleware/auth");

const {
  validateCreateInput,
  validateUpdateInput
} = require("../validation/notes/index");

const router = express.Router();

// Create a Note
router.post("/notes", auth, async (req, res) => {
  const { title, note, isArchieved, isFavorite, isPinned, backgroundColor } =
    req.body;

  const { errors, isValid } = validateCreateInput({
    title,
    note,
    backgroundColor
  });
  if (!isValid) {
    return res.status(400).send({ errors: errors });
  }

  try {
    const note = new Note({
      title,
      note,
      isArchieved,
      isFavorite,
      isPinned,
      backgroundColor,
      author: req.user._id
    });

    await note.save();

    res.status(201).send(note);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Get all notes
router.get("/notes", auth, async (req, res) => {
  try {
    const notes = await Note.find({ author: req.user._id })
      .lean()
      .sort({ updatedAt: -1 });

    res.send(notes);
  } catch (err) {
    res.status(500).send();
  }
});

// Get a Note
router.get("/notes/:id", auth, async (req, res) => {
  const { id } = req.params;

  try {
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).send({ errors: [{ msg: "Note not found" }] });
    }

    res.send(note);
  } catch (err) {
    res.status(500).send();
  }
});

// Update a Note
router.patch("/notes/:id", auth, async (req, res) => {
  const { id } = req.params;

  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "title",
    "note",
    "isArchieved",
    "isFavorite",
    "isPinned",
    "backgroundColor"
  ];

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ errors: [{ msg: "Invalid Updates" }] });
  }

  const { errors, isValid } = validateUpdateInput({
    note,
    backgroundColor
  });
  if (!isValid) {
    return res.status(400).send({ errors: errors });
  }

  try {
    const note = await Note.findOne({ _id: id, author: req.user._id });
    if (!note) {
      return res.status(404).send({ errors: [{ msg: "Note not found" }] });
    }

    updates.forEach((update) => {
      // eslint-disable-next-line security/detect-object-injection
      note[update] = req.body[update];
    });

    await note.save();

    res.send(note);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Delete a Note
router.delete("/notes/:id", auth, async (req, res) => {
  const { id } = req.params;

  try {
    const note = await Note.findOne({
      _id: id,
      author: req.user._id
    });

    if (!note) {
      return res.status(404).send({ errors: [{ msg: "Note not found" }] });
    }

    await note.remove();

    res.send(note);
  } catch (err) {
    res.status(500).send();
  }
});

module.exports = router;
