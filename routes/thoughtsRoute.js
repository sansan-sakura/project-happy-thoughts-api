const express = require("express");

const thoughtsController = require("../controllers/thoughtsController");
const authController = require("../controllers/authContoller");

const router = express.Router();

router
  .route("/")
  .get(thoughtsController.getThoughts)
  .post(authController.protect, thoughtsController.createThought);

router.route("/thoughts/:thoughtId/like").put(thoughtsController.postLikes);

module.exports = router;
