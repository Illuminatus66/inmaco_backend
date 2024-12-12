import { Schema, model } from "mongoose";

const invoiceSchema = new Schema(
  {
    invoiceNumber: { type: String, required: true },
    invoiceDate: { type: Date, required: true },
    invoiceAmount: { type: Number, required: true },
    financialYear: { type: String, required: true },
  },
  { timestamps: true }
);

invoiceSchema.index({ financialYear: 1, invoiceNumber: 1 }, { unique: true });

export default model("Invoice", invoiceSchema);
