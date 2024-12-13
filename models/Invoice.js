import { Schema, model } from "mongoose";

const invoiceSchema = new Schema(
  {
    invoiceNumber: { type: Number, required: true },
    invoiceDate: { type: Date, required: true },
    invoiceAmount: { type: Number, required: true },
    financialYear: { type: Number, required: true },
  },
  { timestamps: true }
);

invoiceSchema.index({ invoiceNumber: 1 }, { unique: true });

export default model("Invoice", invoiceSchema);
