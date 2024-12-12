import Invoice from '../models/Invoice';

const validateInvoiceNumber = async (invoiceNumber, year) => {
    const existingInvoice = await Invoice.findOne({
        invoiceNumber: { $regex: `^${year}` },
        invoiceNumber: { $regex: `${invoiceNumber}$` }
    });

    if (existingInvoice) {
        throw new Error('Duplicate invoice number');
    }
};

export const createInvoice = async (req, res) => {
    const { invoiceDate, invoiceNumber, invoiceAmount } = req.body;

    try {
        const date = new Date(invoiceDate);
        const year = date.getFullYear();
        const formattedInvoiceNumber = `${year}${invoiceNumber}`;
        
        await validateInvoiceNumber(invoiceNumber, year);

        const invoice = new Invoice({
            invoiceNumber: formattedInvoiceNumber,
            invoiceDate: date,
            invoiceAmount,
            financialYear: year,
        });
        await invoice.save();

        res.status(201).json(invoice);
    } catch (err) {
        if (err.message === 'Duplicate invoice number') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find();
        res.json(invoices);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

export const updateInvoice = async (req, res) => {
    const { invoiceNumber } = req.params;
    const { invoiceDate, invoiceAmount } = req.body;

    try {
        const date = new Date(invoiceDate);
        const year = date.getFullYear();
        const invoice = await Invoice.findOneAndUpdate(
            { invoiceNumber },
            { invoiceDate, invoiceAmount, financialYear : year },
            { new: true, runValidators: true }
        );

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found.' });
        }

        res.json(invoice);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const deleteInvoice = async (req, res) => {
    const { invoiceNumber } = req.params;

    try {
        const invoice = await Invoice.findOneAndDelete({ invoiceNumber });

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found.' });
        }

        res.json({ message: 'Invoice deleted successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const filterInvoices = async (req, res) => {
    const { financialYear, invoiceNumber, startDate, endDate } = req.query;

    try {
        const query = {};

        if (financialYear) {
            query.financialYear = financialYear;
        }

        if (invoiceNumber) {
            query.invoiceNumber = invoiceNumber;
        }

        if (startDate || endDate) {
            query.invoiceDate = {};
            if (startDate) query.invoiceDate.$gte = new Date(startDate);
            if (endDate) query.invoiceDate.$lte = new Date(endDate);
        }

        const invoices = await Invoice.find(query);
        res.json(invoices);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
