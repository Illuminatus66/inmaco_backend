import express from "express";
import {
  createInvoice,
  getInvoices,
  updateInvoice,
  deleteInvoice,
  filterInvoices,
} from "../controllers/invoiceController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/all", getInvoices, auth);
router.post("/create", createInvoice, auth);
router.patch("/update/:invoiceNumber", updateInvoice, auth);
router.delete("/delete/:invoiceNumber", deleteInvoice, auth);
router.patch("/filter", filterInvoices, auth);

export default router;
