import PDFDocument from "pdfkit";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const generateInvoice = async (order: any, user: any): Promise<string> => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 25 });

            // Create Cloudinary upload stream
            const cloudStream = cloudinary.uploader.upload_stream(
                {
                    folder: "invoices",
                    resource_type: "raw",
                    public_id: `${order._id}`,
                    format: "pdf",
                    type: "upload"
                },
                (err, result) => {
                    if (err) return reject(err);
                    if (!result?.secure_url) return reject("Cloudinary did not return URL");
                    resolve(result.secure_url);
                }
            );

            // IMPORTANT: Pipe PDF → cloudinary
            const stream = doc.pipe(cloudStream);

            // IMPORTANT FIX: Wait for PDF streaming to complete
            stream.on("finish", () => {
                console.log("PDF streaming finished.");
            });

            /*
             * ------------------------------------------------------
             *  PDF CONTENT BELOW (same as before)
             * ------------------------------------------------------
             */

            const company = {
                name: "FragranceStore",
                address: "Chiplun - 415605, Ratnagiri, Maharashtra, India",
                email: "fragrancestore@gmail.com",
                gst: "GSTIN: 27ABCDE1234F1Z5"
            };

            doc.fontSize(22).text(company.name, 40, 40);
            doc.fontSize(10)
                .text(company.address, 40, 70)
                .text(company.email, 40, 85)
                .text(company.gst, 40, 100);

            doc.moveTo(40, 130).lineTo(560, 130).stroke();

            doc.fontSize(20).text("INVOICE", 40, 150);
            doc.fontSize(12)
                .text(`Invoice No: INV-${order._id}`, 40, 180)
                .text(`Order Date: ${new Date(order.createdAt).toDateString()}`, 40, 200)
                .text(`Payment Method: ${order.paymentMethod}`, 40, 220);

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

            let y = tableTop + 30;

            order.orderItems.forEach((item: any) => {
                const name = item.name;
                const price = Number(item.price);
                const qty = Number(item.qty);
                const tax = Number(item.taxPrice);
                const ship = Number(item.shippingFee);
                const discount = Number(item.discountPrice);

                const final = (discount + tax + ship) * qty;

                if (y > 700) {
                    doc.addPage();
                    y = 40;
                }

                doc.fontSize(11)
                    .text(name, 40, y, { width: 130 })
                    .text(String(qty), 180, y)

                    .save()
                    .text(price.toFixed(2), 240, y)
                    .moveTo(240, y + 7)
                    .lineTo(240 + price.toFixed(2).length * 6, y + 7)
                    .stroke()
                    .restore()

                    .text(tax.toFixed(2), 310, y)
                    .text(ship.toFixed(2), 360, y)
                    .text(discount.toFixed(2), 430, y)
                    .text(final.toFixed(2), 510, y);

                y += 20;
            });

            doc.moveTo(40, y + 10).lineTo(560, y + 10).stroke();
            y += 25;

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

            const signatureY = 720;
            doc.moveTo(350, signatureY).lineTo(560, signatureY).stroke();
            doc.fontSize(10).text("Authorized Signature", 410, signatureY + 5);

            doc.fontSize(10).text("Thank you for shopping!", 40, 760, { align: "center" });

            doc.end();

        } catch (err) {
            reject(err);
        }
    });
};
