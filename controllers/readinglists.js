const router = require("express").Router();

const { Reading } = require("../models");

const tokenExtractor = require("../util/tokenExtractor");

router.get("/", async (req, res) => {
  const readinglists = await Reading.findAll();
  res.json(readinglists);
});

router.post("/", async (req, res) => {
  const reading = await Reading.create(req.body);
  res.json(reading);
});

router.post("/:id", tokenExtractor, async (req, res) => {
  const reading = await Reading.findByPk(req.params.id);

  if (!reading) return res.status(404).end();

  if (reading.userId !== req.decodedToken.id)
    return res.status(401).json({ error: "not the owner" });

  const newRead = req.body.read;

  if (newRead === undefined) throw Error("missing field read");

  reading.read = newRead;
  await reading.save();
  res.json({ read: newRead });
});

module.exports = router;
