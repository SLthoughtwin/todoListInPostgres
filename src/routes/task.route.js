const express = require("express");
const router = express.Router();
const { accessTokenVerify,taskValidation } = require("../validation/");
const {
  createTask,
  showTask,
  deleteTask,
  showTaskById,
  updateTask,
  completeTask
} = require("../controller");

router.post("/", accessTokenVerify, taskValidation,createTask);
router.delete("/:id", accessTokenVerify, deleteTask);
router.get("/:id", accessTokenVerify, showTaskById);
router.put("/:id", accessTokenVerify, taskValidation,updateTask);
router.get("/checked/:id",accessTokenVerify,completeTask);
router.get("/", accessTokenVerify, showTask);

module.exports = router;
