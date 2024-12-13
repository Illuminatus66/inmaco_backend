import Invoice from "../models/Invoice";

const getFinancialYear = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const startYear = month >= 3 ? year : year - 1;
  return startYear;
};

export const createInvoice = async (req, res) => {
  const { invoiceNumber, invoiceDate, invoiceAmount } = req.body;

  try {
    const date = new Date(invoiceDate);
    const startYear = getFinancialYear(date)
    const formattedInvoiceNumber = `${startYear}${invoiceNumber}`;

    const existingInvoice = await Invoice.findOne({ invoiceNumber: formattedInvoiceNumber });
    if (existingInvoice) {
      return res.status(400).json({ message: "Duplicate invoice number" });
    }

    const invoice = new Invoice({
      invoiceNumber: formattedInvoiceNumber,
      invoiceDate: date,
      invoiceAmount,
      financialYear: startYear,
    });
    
    await invoice.save();

    res.status(201).json(invoice);
  } catch (err) {
    if (err.message === "Duplicate invoice number") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateInvoice = async (req, res) => {
  const { originalInvoiceNumber } = req.params;
  const { invoiceNumber, invoiceDate, invoiceAmount } = req.body;

  try {

    const existingInvoice = await Invoice.findOne({ invoiceNumber: originalInvoiceNumber });
    if (!existingInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    if (originalInvoiceNumber !== invoiceNumber) {
      const conflictingInvoice = await Invoice.findOne({ invoiceNumber });
      if (conflictingInvoice) {
        return res.status(400).json({ message: "Invoice number already exists" });
      }
    }

    const date = new Date(invoiceDate);
    const startYear = getFinancialYear(date)

    existingInvoice.invoiceNumber = invoiceNumber;
    existingInvoice.invoiceDate = date;
    existingInvoice.invoiceAmount = invoiceAmount;
    existingInvoice.financialYear = startYear;

    const updatedInvoice = await existingInvoice.save();

    res.status(200).json(updatedInvoice);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteInvoice = async (req, res) => {
  const { invoiceNumber } = req.params;

  try {
    const invoice = await Invoice.findOneAndDelete({ invoiceNumber });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found." });
    }

    res.json({ message: "Invoice deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const filterInvoices = async (req, res) => {
  const { financialYear, invoiceNumber, startDate, endDate } = req.query;

  try {
    const query = {};

    if (financialYear && financialYear.trim() !== "") {
      query.financialYear = financialYear;
    }

    if (invoiceNumber && invoiceNumber.trim() !== "") {
      query.invoiceNumber = { $regex: new RegExp(`\\d{4}${invoiceNumber}$`) };
    }

    if (startDate || endDate) {
      query.invoiceDate = {};
      if (startDate) query.invoiceDate.$gte = new Date(startDate);
      if (endDate) query.invoiceDate.$lte = new Date(endDate);
    }

    const invoices = await Invoice.find(query);

    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
