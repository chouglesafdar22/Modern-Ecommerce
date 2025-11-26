import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateInvoice = (order: any, user: any) => {
    const invoiceDir = path.join("uploads", "invoices");
    if (!fs.existsSync(invoiceDir)) {
        fs.mkdirSync(invoiceDir, { recursive: true });
    }

    const filePath = path.join(invoiceDir, `${order._id}.pdf`);
    const doc = new PDFDocument({ margin: 40 });
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    const companyDetails = {
        name: "FragranceStore",
        address: "Chiplun - 415605, Ratnagiri, Maharashtra, India",
        email: "fragrancestore@gmail.com",
        gst: "GSTIN: 27ABCDE1234F1Z5 (Sample Number)"
    };

    const logoPath = path.resolve("uploads/logo/company-logo.png");

    //bg watermark
    if (fs.existsSync(logoPath)) {
        doc.opacity(0.08);
        doc.image(logoPath, 150, 220, { width: 320 });
        doc.opacity(1);
    }

    // logo top-left
    if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 40, 40, { width: 70 });
    }

    doc
        .fontSize(22)
        .text(companyDetails.name, 130, 45)
        .fontSize(10)
        .text(companyDetails.address, 130, 75)
        .text(companyDetails.email, 130, 90)
        .text(companyDetails.gst, 130, 105);

    doc.moveTo(40, 140).lineTo(560, 140).stroke();

    // title
    doc.fontSize(20).text("INVOICE", 40, 160);

    doc
        .fontSize(12)
        .text(`Invoice No: INV-${order._id}`, 40, 195)
        .text(`Order Date: ${new Date(order.createdAt).toDateString()}`, 40, 215)
        .text(`Payment Method: ${order.paymentMethod}`, 40, 235);

    //billing details
    doc.fontSize(14).text("Billing Details", 350, 160);

    doc
        .fontSize(12)
        .text(`Name: ${user.name}`, 350, 195)
        .text(`Email: ${user.email}`, 350, 215)
        .text(`Phone No: ${user.phoneNumber}`, 350, 235)
        .text(
            `Address: ${order.shippingAddress.address}, ${order.shippingAddress.city} - ${order.shippingAddress.pincode}, ${order.shippingAddress.district}, ${order.shippingAddress.state}, ${order.shippingAddress.country}`,
            350,
            255,
            { width: 200 }
        );

    //product table
    const tableTop = 280;

    doc
        .fontSize(12)
        .text("Product", 40, tableTop)
        .text("Qty", 250, tableTop)
        .text("Price", 300, tableTop)
        .text("Total", 380, tableTop);

    doc.moveTo(40, tableTop + 20).lineTo(560, tableTop + 20).stroke();

    let yPos = tableTop + 30;

    order.orderItems.forEach((item: any) => {
        if (yPos > 700) {
            doc.addPage();
            yPos = 50;
        }

        doc
            .fontSize(11)
            .text(item.name, 40, yPos)
            .text(String(item.qty), 250, yPos)
            .text(`₹${item.price}`, 300, yPos)
            .text(`₹${item.qty * item.price}`, 380, yPos);

        yPos += 25;
    });

    doc.moveTo(40, yPos + 10).lineTo(560, yPos + 10).stroke();

    //total
    yPos += 30;

    doc
        .fontSize(12)
        .text(`Items Total:`, 300, yPos)
        .text(`₹${order.itemsPrice}`, 450, yPos)
        .text(`Tax:`, 300, yPos + 20)
        .text(`₹${order.taxPrice}`, 450, yPos + 20)
        .text(`Shipping:`, 300, yPos + 40)
        .text(`₹${order.shippingFee}`, 450, yPos + 40)
        .text(`Discount:`, 300, yPos + 60)
        .text(`- ₹${order.discountPrice || 0}`, 450, yPos + 60)
        .fontSize(14)
        .text(`Grand Total:`, 300, yPos + 90)
        .text(`₹${order.totalPrice}`, 450, yPos + 90);

    // notes
    doc
        .moveDown(4)
        .fontSize(12)
        .text("Important Notes:", 40, yPos + 130)
        .fontSize(10)
        .text("• This is a system-generated invoice. No signature required.")
        .text("• Returns allowed within 3 days after delivery.")
        .text("• Keep this invoice for warranty & customer service.")
        .text("• Use GSTIN above for tax claims.");

    // authorized sign
    doc.moveTo(350, 720).lineTo(560, 720).stroke();

    doc
        .fontSize(10)
        .text("Authorized Signature", 410, 730);

    //    footer
    doc
        .fontSize(10)
        .text("Thank you for shopping with us!", 40, 760, { align: "center" });

    doc.end();

    return `/uploads/invoices/${order._id}.pdf`;
};
