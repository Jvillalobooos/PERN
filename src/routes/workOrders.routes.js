const { Router } = require("express");

const router = Router();


const {
  getAllworkOrders,
  getWorkOrderById,
  createWorkOrder,
  searchAndAssignmentWorkOrder
} = require("../controllers/workOrders.controller");

router.get("/", getAllworkOrders);

router.get("/:id", getWorkOrderById);

router.post("/", createWorkOrder);

router.post("/:id/assign", searchAndAssignmentWorkOrder);

module.exports = router;