const { Router } = require("express");

const router = Router();


const {
  getAllConsultants,
  getConsultantById,
  createConsultant,
} = require("../controllers/consultants.controller");

router.get("/", getAllConsultants);

router.get("/:id", getConsultantById);

router.post("/", createConsultant);

module.exports = router;