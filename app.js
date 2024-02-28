const express = require('express');
const PDFDocument = require('pdfkit');
const app = express();
const port = 3000;
app.get('/generate-invoice', (req, res) => {
    const doc = new PDFDocument();
    const invoiceData = {
        invoiceNumber: 'INV-123456',
        date: '2024-02-27',
        customerName: 'Fridjy Celena',
        items: [
            { description: 'Product 1', quantity: 2, price: 10 },
            { description: 'Product 2', quantity: 1, price: 20 },
            
        ]
    };
    doc.fontSize(20).text('Invoice', { align: 'center' }).moveDown(0.5);
    doc.fontSize(12).text(`Invoice Number: ${invoiceData.invoiceNumber}`).moveDown(0.5);
    doc.text(`Date: ${invoiceData.date}`).moveDown(1);
    doc.text(`Customer Name: ${invoiceData.customerName}`).moveDown(1)

    const tableTop = 200; 
    const tableLeft = 50; 
    const colWidth = 150; 
    const rowHeight = 30; 
    let yPos = tableTop;

    doc.rect(tableLeft, yPos, colWidth, rowHeight).fill('#cccccc');
    doc.text('Description', tableLeft + 10, yPos + 10);
    doc.rect(tableLeft + colWidth, yPos, colWidth, rowHeight).fill('#cccccc');
    doc.text('Quantity', tableLeft + colWidth + 10, yPos + 10);
    doc.rect(tableLeft + 2 * colWidth, yPos, colWidth, rowHeight).fill('#cccccc');
    doc.text('Price', tableLeft + 2 * colWidth + 10, yPos + 10);
    doc.rect(tableLeft + 3 * colWidth, yPos, colWidth, rowHeight).fill('#cccccc');
    doc.text('Total', tableLeft + 3 * colWidth + 10, yPos + 10);
    yPos += rowHeight;

    invoiceData.items.forEach(item => {
        doc.rect(tableLeft, yPos, colWidth, rowHeight);
        doc.text(item.description, tableLeft + 10, yPos + 10);
        doc.rect(tableLeft + colWidth, yPos, colWidth, rowHeight);
        doc.text(item.quantity.toString(), tableLeft + colWidth + 10, yPos + 10);
        doc.rect(tableLeft + 2 * colWidth, yPos, colWidth, rowHeight);
        doc.text(item.price.toString(), tableLeft + 2 * colWidth + 10, yPos + 10);
        const total = item.quantity * item.price;
        doc.rect(tableLeft + 3 * colWidth, yPos, colWidth, rowHeight);
        doc.text(total.toString(), tableLeft + 3 * colWidth + 10, yPos + 10);
        yPos += rowHeight;
    });

    const totalAmount = invoiceData.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    doc.moveDown(1);
    doc.fontSize(12).text(`Total Amount: $${totalAmount}`, { align: 'right' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="invoice.pdf"');
    doc.pipe(res);
    doc.end();
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
