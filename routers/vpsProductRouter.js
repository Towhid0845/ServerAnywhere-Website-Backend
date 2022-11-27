const router = require("express").Router();
const {
  getProducts,
  createProduct,
  getProductById,
  updateProductById,
  deleteById,
  filterProducts,
} = require("../controllers/vpsProductControllers");
const admin = require("../middlewares/admin");
const authorize = require("../middlewares/authorize");

// router.route("/").post([authorize, admin], createProduct).get(getProducts);
router.route("/").post(createProduct).get(getProducts);
router
  .route("/:id")
  .get(getProductById)
  .put(updateProductById)
  .delete(deleteById);

// router.route("/photo/:id").get(getPhoto);

router.route("/filter").post(filterProducts);

module.exports = router;