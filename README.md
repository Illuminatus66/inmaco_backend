# Backend for Invoice Management System

## Overview
This Node.js application serves as the backend for managing business invoices. It stores data in a MongoDB Atlas database and provides endpoints for creating, updating, deleting, and filtering invoices. The application ensures the generation of unique invoice numbers by prepending the financial year (derived from the invoice date) to the admin-provided invoice number.

The entry point of the application is `index.js`, located at the root of the project.

---

## Key Features

### 1. **Invoice Management**
- **Fields:** Each invoice includes the following fields:
  - `Invoice Number`
  - `Invoice Date`
  - `Amount`
- **Unique Identification:**
  - Admin-provided invoice numbers (e.g., `2100`) may repeat across different financial years.
  - The backend prepends the correct financial year (from the `Invoice Date`) to the invoice number (e.g., `20232100`) to ensure uniqueness.

### 2. **Invoice Operations**
- **Create:**
  - Admins can create new invoices.
  - The backend ensures that invoices within the same financial year have unique invoice numbers.
- **Update:**
  - Admins can modify existing invoices, including changes to the invoice number, date, or amount.
  - The system maintains data integrity by ensuring uniqueness of invoice numbers after updates.
- **Delete:**
  - Invoices can be deleted by the admin.

### 3. **Filtering and Searching**
- **Financial Year Filter:**
  - Retrieve invoices for a specific financial year.
- **Date Range Filter:**
  - Fetch invoices created within a specific start and end date.
- **Invoice Number Search:**
  - Supports partial matches by finding invoices where the admin-provided number matches the suffix of stored invoice numbers (e.g., searching for `2100` will match both `20232100` and `20222100` where the prefix is in the form of YYYY and reflects the financial year).

---

## Project Structure

```
root
├── index.js          # Entry point of the application
├── controllers/      # Handles request logic
├── models/           # Mongoose schemas
├── routes/           # API route definitions
├── config/           # Configuration files
├── middlewares/      # Custom middlewares for protected endpoints
└── README.md         # Project documentation
```

---

## Installation and Setup

### Prerequisites
- **Node.js** (v14.x or later)
- **MongoDB Atlas** account with a configured cluster

### Steps
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```env
     PORT=3000
     MONGODB_URI=<Your MongoDB Atlas URI>
     ```

4. Start the server:
   ```bash
   npm start
   ```
   The application will run on `http://localhost:3000`.

---

## API Endpoints

### Base URL: `/api`

#### 1. **Create an Invoice**
   - **Endpoint:** `POST api/invoices/create`
   - **Request Body:**
     ```json
     {
       "invoiceNumber": "2100",
       "invoiceDate": "2024-01-15",
       "amount": 5000
     }
     ```
   - **Response:**
     ```json
     {
       "message": "Invoice created successfully",
       "invoice": { ... }
     }
     ```

#### 2. **Update an Invoice**
   - **Endpoint:** `PUT api/invoices/update/:invoiceNumber`
   - **Request Body:**
     ```json
     {
       "invoiceNumber": "2300",
       "amount": 5500
     }
     ```

#### 3. **Delete an Invoice**
   - **Endpoint:** `DELETE /invoices/delete/:invoiceNumber`

#### 4. **Filter/Search Invoices**
   - **Endpoint:** `GET api/invoices/filter`
   - **Query Parameters:**
     - `financialYear` (e.g., `2023`)
     - `invoiceNumber` (e.g., `2100`)
     - `startDate` (e.g., `2024-01-01`)
     - `endDate` (e.g., `2024-12-31`)

#### 5. **Fetch all Invoices**
   - **Endpoint:** `GET api/invoices/all`

---

## Technologies Used

- **Node.js**: Runtime environment
- **Express**: Web framework
- **MongoDB Atlas**: Database
- **Mongoose**: ODM library for MongoDB

---

## Future Enhancements
- Implement analytics dashboards for detailed invoice statistics.
- Enhance search capabilities with fuzzy matching.

---

## Contributions
Contributions are welcome! Please fork the repository and submit a pull request.

---

