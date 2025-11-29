import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateInvoice = (order: any, user: any) => {
    const invoiceDir = path.join("uploads", "invoices");
    if (!fs.existsSync(invoiceDir)) {
        fs.mkdirSync(invoiceDir, { recursive: true });
    }

    const filePath = path.join(invoiceDir, `${order._id}.pdf`);
    const doc = new PDFDocument({ margin: 25 });
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    const companyDetails = {
        name: "FragranceStore",
        address: "Chiplun - 415605, Ratnagiri, Maharashtra, India",
        email: "fragrancestore@gmail.com",
        gst: "GSTIN: 27ABCDE1234F1Z5 (Sample Number)"
    };

    const logoPath = path.resolve("uploads/logo/company-logo.png");

    // Watermark
    if (fs.existsSync(logoPath)) {
        doc.opacity(0.3).image(logoPath, 140, 200, { width: 350 }).opacity(1);
    }

    // Logo top-left
    if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 40, 40, { width: 70 });
    }

    // Header
    doc.fontSize(22).text(companyDetails.name, 130, 45);
    doc.fontSize(10)
        .text(companyDetails.address, 130, 75)
        .text(companyDetails.email, 130, 90)
        .text(companyDetails.gst, 130, 105);

    doc.moveTo(40, 140).lineTo(560, 140).stroke();

    // Invoice
    doc.fontSize(20).text("INVOICE", 40, 160);
    doc.fontSize(12)
        .text(`Invoice No: INV-${order._id}`, 40, 195)
        .text(`Order Date: ${new Date(order.createdAt).toDateString()}`, 40, 215)
        .text(`Payment Method: ${order.paymentMethod}`, 40, 235);

    // Billing Details
    doc.fontSize(14).text("Billing Details", 350, 160);
    doc.fontSize(12)
        .text(`Name: ${user.name}`, 350, 195)
        .text(`Email: ${user.email}`, 350, 215)
        .text(`Phone No: ${order.phoneNumber}`, 350, 235)
        .text(
            `Address: ${order.shippingAddress.address}, ${order.shippingAddress.city} - ${order.shippingAddress.pinCode}, ${order.shippingAddress.district}, ${order.shippingAddress.state}, ${order.shippingAddress.country}`,
            350,
            255,
            { width: 200 }
        );

    // Table Header
    const tableTop = 300;
    doc.fontSize(12)
        .text("Product", 40, tableTop)
        .text("Qty", 180, tableTop)
        .text("Price", 250, tableTop)
        .text("Tax", 320, tableTop)
        .text("Ship", 380, tableTop)
        .text("Discount", 440, tableTop)
        .text("Final", 510, tableTop);

    doc.moveTo(40, tableTop + 20).lineTo(560, tableTop + 20).stroke();

    // Table Rows
    let yPos = tableTop + 30;

    order.orderItems.forEach((item: any) => {
        const name = item.product?.name || item.name;
        const price = Number(item.price || item.product?.price || 0);
        const qty = item.qty || 1;
        const tax = Number(item.taxPrice || item.product?.taxPrice || 0);
        const ship = Number(item.shippingFee || item.product?.shippingFee || 0);
        const discount = Number(item.discountPrice || item.product?.discountPrice || 0);

        const final = tax + ship + discount;

        if (yPos > 700) {
            doc.addPage();
            yPos = 50;
        }

        doc.fontSize(11)
            .text(name, 40, yPos, { width: 130 })
            .text(qty, 180, yPos)
            .text(`-${price.toFixed(2)}`, 250, yPos)
            .text(`+${tax.toFixed(2)}`, 320, yPos)
            .text(`+${ship.toFixed(2)}`, 380, yPos)
            .text(`+${discount.toFixed(2)}`, 440, yPos)
            .text(`+${final.toFixed(2)}`, 510, yPos);

        yPos += 20;
    });

    doc.moveTo(40, yPos + 10).lineTo(560, yPos + 10).stroke();
    yPos += 25;

    // Totals
    doc.fontSize(12)
        .text("Items Total:", 350, yPos)
        .text(`Rs. ${order.itemsPrice.toFixed(2)}`, 500, yPos)
        .text("Tax:", 350, yPos + 20)
        .text(`Rs. ${order.taxPrice.toFixed(2)}`, 500, yPos + 20)
        .text("Shipping Fee:", 350, yPos + 40)
        .text(`Rs. ${order.shippingFee.toFixed(2)}`, 500, yPos + 40)
        .text("Discount:", 350, yPos + 60)
        .text(`Rs. ${order.discountPrice.toFixed(2)}`, 500, yPos + 60);

    doc.fontSize(14)
        .text("Grand Total:", 350, yPos + 90)
        .text(`Rs. ${order.totalPrice.toFixed(2)}`, 500, yPos + 90);

    // Notes
    doc.fontSize(12).text("Important Notes:", 40, yPos + 130);
    doc.fontSize(10)
        .text("• This is a system-generated invoice. No signature required.")
        .text("• Returns allowed within 3 days after delivery.")
        .text("• Keep this invoice for warranty & customer service.")
        .text("• Use GSTIN above for tax claims.");

    // Signature
    const signatureY = 720;
    doc.moveTo(350, signatureY).lineTo(560, signatureY).stroke();
    doc.fontSize(10).text("Authorized Signature", 410, signatureY + 5);

    // Footer
    doc.fontSize(10).text("Thank you for shopping with us!", 40, 750, { align: "center" });

    doc.end();

    return `/uploads/invoices/${order._id}.pdf`;
};


