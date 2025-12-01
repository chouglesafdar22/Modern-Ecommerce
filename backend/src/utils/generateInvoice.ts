import PDFDocument from "pdfkit";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

export const generateInvoice = async (order: any, user: any): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        try {
            // PDF in memory
            const doc = new PDFDocument({ margin: 25 });
            let buffers: any[] = [];

            doc.on("data", buffers.push.bind(buffers));
            doc.on("end", async () => {
                const pdfBuffer = Buffer.concat(buffers);

                // Upload to Cloudinary
                cloudinary.uploader.upload_stream(
                    {
                        folder: "invoices",
                        resource_type: "raw",
                        public_id: `${order._id}`,
                        format: "pdf"
                    }, (error, result) => {
                        if (error) return reject(error);
                        if (!result?.secure_url) {
                            return reject(new Error("Failed to upload invoice: secure_url missing"));
                        }
                        return resolve(result.secure_url);
                    }
                ).end(pdfBuffer);
            });

            const company = {
                name: "FragranceStore",
                address: "Chiplun - 415605, Ratnagiri, Maharashtra, India",
                email: "fragrancestore@gmail.com",
                gst: "GSTIN: 27ABCDE1234F1Z5 (Sample Number)"
            };

            // HEADER
            doc.fontSize(22).text(company.name, 40, 40);
            doc.fontSize(10)
                .text(company.address, 40, 70)
                .text(company.email, 40, 85)
                .text(company.gst, 40, 100);

            doc.moveTo(40, 130).lineTo(560, 130).stroke();

            // INVOICE TITLE
            doc.fontSize(20).text("INVOICE", 40, 150);
            doc.fontSize(12)
                .text(`Invoice No: INV-${order._id}`, 40, 180)
                .text(`Order Date: ${new Date(order.createdAt).toDateString()}`, 40, 200)
                .text(`Payment Method: ${order.paymentMethod}`, 40, 220);

            // BILLING INFO
            doc.fontSize(14).text("Billing Details", 350, 150);
            doc.fontSize(12)
                .text(`Name: ${user.name}`, 350, 180)
                .text(`Email: ${user.email}`, 350, 200)
                .text(`Phone: ${order.phoneNumber}`, 350, 220)
                .text(
                    `Address: ${order.shippingAddress.address}, ${order.shippingAddress.city} - ${order.shippingAddress.pinCode}, ${order.shippingAddress.district}, ${order.shippingAddress.state}, ${order.shippingAddress.country}`,
                    350,
                    240,
                    { width: 200 }
                );

            // TABLE HEADER
            const tableTop = 300;
            doc.fontSize(12)
                .text("Product", 40, tableTop)
                .text("Qty", 180, tableTop)
                .text("Price", 240, tableTop)
                .text("Tax", 310, tableTop)
                .text("Ship", 360, tableTop)
                .text("Discount", 430, tableTop)
                .text("Final", 510, tableTop);

            doc.moveTo(40, tableTop + 20).lineTo(560, tableTop + 20).stroke();

            // ROWS
            let y = tableTop + 30;

            order.orderItems.forEach((item: any) => {
                const name = item.name || item.product?.name;
                const price = Number(item.price || item.product?.price || 0);
                const qty = Number(item.qty);
                const tax = Number(item.taxPrice);
                const ship = Number(item.shippingFee);
                const discount = Number(item.discountPrice);
                const final = Number(item.finalPrice);

                if (y > 700) {
                    doc.addPage();
                    y = 40;
                }

                doc.fontSize(11)
                    .text(name, 40, y, { width: 130 })
                    .text(qty.toString(), 180, y)
                    // Original price with strikethrough
                    .save()
                    .text(`${price.toFixed(2)}`, 240, y)
                    .moveTo(240, y + 7)
                    .lineTo(240 + (price.toFixed(2).length * 6), y + 7)
                    .stroke()
                    .restore()
                    // Tax
                    .text(`${tax.toFixed(2)}`, 310, y)

                    // Shipping
                    .text(`${ship.toFixed(2)}`, 360, y)

                    // Discount
                    .text(`${discount.toFixed(2)}`, 430, y)

                    // Final Price
                    .text(`${final.toFixed(2)}`, 510, y);

                y += 20;
            });

            doc.moveTo(40, y + 10).lineTo(560, y + 10).stroke();
            y += 25;

            // TOTALS
            doc.fontSize(12)
                .text("Items Total:", 350, y)
                .text(`Rs. ${order.itemsPrice.toFixed(2)}`, 500, y)
                .text("Tax:", 350, y + 20)
                .text(`Rs. ${order.taxPrice.toFixed(2)}`, 500, y + 20)
                .text("Shipping Fee:", 350, y + 40)
                .text(`Rs. ${order.shippingFee.toFixed(2)}`, 500, y + 40)
                .text("Discount:", 350, y + 60)
                .text(`Rs. ${order.discountPrice.toFixed(2)}`, 500, y + 60);

            doc.fontSize(14)
                .text("Grand Total:", 350, y + 100)
                .text(`Rs. ${order.totalPrice.toFixed(2)}`, 500, y + 100);

            // Notes
            doc.fontSize(12).text("Important Notes:", 40, y + 130);
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
            doc.end();
        } catch (err) {
            reject(err);
        }
    });
};
