import chai, { use, request } from 'chai';
import chaiHttp from 'chai-http';
import server from '../index';
const { expect } = chai;

use(chaiHttp);

describe('Invoice API Endpoints', () => {
    // Test data
    const testInvoice = {
        invoiceNumber: "2100",
        invoiceDate: "2024-07-15",
        amount: 5000
    };

    let createdInvoice;

    // Test: Creating an Invoice
    it('should create a new invoice', (done) => {
        request(server)
            .post('/api/invoices/create')
            .send(testInvoice)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message', 'Invoice created successfully');
                expect(res.body.invoice).to.include(testInvoice);
                createdInvoice = res.body.invoice;
                done();
            });
    });

    // Test: Fetching All Invoices
    it('should fetch all invoices', (done) => {
        request(server)
            .get('/api/invoices/all')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                expect(res.body).to.deep.include(createdInvoice);
                done();
            });
    });

    // Test: Filtering Invoices by Financial Year
    it('should filter invoices by financial year', (done) => {
        request(server)
            .get('/api/invoices/filter?financialYear=2024')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                expect(res.body[0].invoiceNumber).to.include("2024");
                done();
            });
    });

    // Test: Deleting an Invoice
    it('should delete an invoice', (done) => {
        request(server)
            .delete(`/api/invoices/delete/${createdInvoice.invoiceNumber}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message', 'Invoice deleted successfully');
                done();
            });
    });
});
