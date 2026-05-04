const { Router } = require("express");

const router = Router();


const {
  getAllTasks,
  getTaskById,
  createTask,
  deleteTask,
  updateTask,
} = require("../controllers/tasks.controller");

router.get("/", getAllTasks);

router.get("/:id", getTaskById);

router.post("/", createTask);

router.delete("/:id", deleteTask);

router.put("/:id", updateTask);
module.exports = router;