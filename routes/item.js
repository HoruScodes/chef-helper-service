const router = require("express").Router();
const Item = require("../model/Item");
const { itemValidation } = require("../validation");

router.post("/addItem", async (req, res) => {
  const { error } = itemValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const itemExist = await Item.findOne({ name: req.body.name });

  if (itemExist) {
    return res.status(400).send("Item Already Exist");
  }

  const item = new Item({
    id: req.body.id,
    name: req.body.name,
    timeToPrep: req.body.timeToPrep,
    type: req.body.type,
  });
  try {
    const savedItem = await item.save();
    res.send(savedItem);
  } catch (err) {
    res.status(400).send(err);
  }
});

const generateProjection = (number) => {
  const values = number.split("");
  const keys = ["id", "name", "timeToPrep", "type"];
  const merged = keys.reduce(
    (obj, key, index) => ({ ...obj, [key]: parseInt(values[index], 10) }),
    {}
  );
  return merged;
};

router.get("/getAllItems", async (req, res) => {
  try {
    const allItems = await Item.find({});
    res.send(allItems);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/getAllItemsById", async (req, res) => {
  try {
    const allItems = await Item.find({}, { _id: 0, id: 1, name: 1 });
    res.send(allItems);
  } catch (error) {
    res.status(400).send(error);
  }
});

const getItemById = async (id) => {
  const item = await Item.find({ id: id });
  return item;
};

router.post("/deleteIngredient", async (req, res) => {
  const id = req.body.id;
  // console.log(id);
  try {
    const response = await Item.findByIdAndDelete(id);
    res.send(response);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
module.exports.getItemById = getItemById;
