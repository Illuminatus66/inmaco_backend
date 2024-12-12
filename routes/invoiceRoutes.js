import express from 'express';
import { createInvoice, getInvoices, updateInvoice, deleteInvoice, filterInvoices } from '../controllers/invoiceController';
import auth from "../middleware/auth.js";

const router = express.Router();

router.post('/create', createInvoice, auth);
router.get('/all', getInvoices, auth);
router.put('/:invoiceNumber', updateInvoice, auth);
router.delete('/:invoiceNumber', deleteInvoice, auth);
router.get('/filter', filterInvoices, auth);

export default router;