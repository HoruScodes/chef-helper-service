const router = require("express").Router();
const Menu = require("../model/Menu");
// const Order = require("../model/")
const { getItemById } = require("../routes/item");

const getIngredientsByItem = async (itemId) => {
  const item = await Menu.findById(itemId, { ingredients: 1, _id: 0 });
  return item.ingredients;
};

const getItemnameById = async (id) => {
  const [itemName] = await getItemById(id);
  return itemName.name;
};

const getFinalIngredietntsofOrder = async (order) => {
  let finalIngredients = [];
  for (let i = 0; i < order.length; i++) {
    const item = await getIngredientsByItem(order[i].itemId);
    let ingredients = [];
    if (order[i].quantity > 1) {
      let count = 0;
      while (order[i].quantity > count) {
        ingredients = ingredients.concat(item);
        count++;
      }
    } else {
      ingredients = item;
    }
    finalIngredients = finalIngredients.concat(ingredients);
  }
  return finalIngredients.sort((a, b) => a - b);
};

const finalizeIngrediets = (finalIngredients) => {
  var counts = {};

  for (var i = 0; i < finalIngredients.length; i++) {
    var num = finalIngredients[i];
    counts[num] = counts[num] ? counts[num] + 1 : 1;
  }
  return counts;
};

const sortIngredientsByPrepTime = async (finalIngredients) => {
  let finals = {};
  for (const [itemId, quantity] of Object.entries(finalIngredients)) {
    const [currItem] = await getItemById(itemId);
    if (finals[currItem.timeToPrep]) {
      finals[currItem.timeToPrep][finals[currItem.timeToPrep].length] = {
        itemId: itemId,
        qty: quantity,
        // name: getItemnameById(itemId),
      };
    } else {
      finals[currItem.timeToPrep] = [
        {
          itemId: itemId,
          qty: quantity,
          //   name: getItemnameById(itemId),
        },
      ];
    }
  }
  const sorted = finals;
  return sorted;
};

function sortObjectByKeys(o) {
  return Object.keys(o)
    .sort()
    .reduce((r, k) => ((r[k] = o[k]), r), {});
}

router.post("/createOrder", async (req, res) => {
  try {
    const order = req.body;
    let finalIngredients = await getFinalIngredietntsofOrder(order);
    finalIngredients = finalizeIngrediets(finalIngredients);
    const sortedIngredients = await sortIngredientsByPrepTime(finalIngredients);
    // const savedOrder = Order.
    res.send(sortedIngredients);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
