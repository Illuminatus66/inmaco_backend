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
router.patch("/update/:originalInvoiceNumber", updateInvoice, auth);
router.delete("/delete/:invoiceNumber", deleteInvoice, auth);
router.get("/filter", filterInvoices, auth);

export default router;
