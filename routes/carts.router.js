const { Router } = require("express")

const {
  getAll,
  populate,
  create,
  deleteId,
  deleteProducts,
  getById,
  findById,
  deleteAll,
  purchase
} = require ("../controllers/cart.controller.js")


const router = Router();

router.get("/", getAll);
router.get("/:cid", populate);
router.post("/", create);
router.delete("/:id", deleteId);
router.delete("/:cid/products/:pid", deleteProducts);
router.put("/:cid", getById);
router.put('/:cid/products/:pid', findById);
router.delete("/:cid", deleteAll);
router.get("/:cid/purchase", purchase);


module.exports = router;