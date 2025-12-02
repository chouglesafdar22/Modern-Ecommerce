import mongoose, { Document, Schema, Types } from "mongoose";

export interface IOrderItem {
    name: string;
    qty: number;
    image: string;
    price: number;
    discountPrice: number;
    taxPrice: number;
    shippingFee: number;
    finalPrice: number;
    product: Types.ObjectId;
}

export interface IOrder extends Document {
    user: Types.ObjectId;
    orderItems: IOrderItem[];
    shippingAddress: {
        address: string;
        city: string;
        pinCode: number;
        district: string;
        state: string;
        country: string;
    };
    phoneNumber: number;
    paymentMethod: string;
    paymentResult?: {
        id: string;
        status: string;
        update_time: string;
        email_address: string;
    };

    itemsPrice: number;
    taxPrice: number;
    shippingFee: number;
    discountPrice: number;
    totalPrice: number;

    isPaid: boolean;
    paidAt?: Date;

    isShipped: boolean;
    shippedAt?: Date;

    isDelivered: boolean;
    deliveredAt?: Date;

    invoiceUrl: string,

    isReturnRequested: boolean;
    returnRequestedAt?: Date;
    isReturned: boolean;
}

const orderSchema = new Schema<IOrder>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },

        orderItems: [
            {
                name: { type: String, required: true },
                qty: { type: Number, required: true },
                image: { type: String, required: true },
                price: { type: Number, required: true },
                discountPrice: { type: Number, default: 0 },
                taxPrice: { type: Number, default: 0 },
                shippingFee: { type: Number, default: 0 },
                finalPrice: { type: Number, required: true },
                product: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
            },
        ],

        shippingAddress: {
            address: { type: String, required: true },
            city: { type: String, required: true },
            pinCode: { type: Number, required: true },
            district: { type: String, required: true },
            state: { type: String, required: true },
            country: { type: String, required: true },
        },

        phoneNumber: { type: Number, required: true },

        paymentMethod: { type: String, required: true },

        paymentResult: {
            id: String,
            status: String,
            update_time: String,
            email_address: String,
        },

        itemsPrice: { type: Number, required: true },
        taxPrice: { type: Number, required: true },
        shippingFee: { type: Number, required: true },
        discountPrice: { type: Number, required: true },
        totalPrice: { type: Number, required: true },

        isPaid: { type: Boolean, default: false },
        paidAt: Date,

        isShipped: { type: Boolean, default: false },
        shippedAt: Date,

        isDelivered: { type: Boolean, default: false },
        deliveredAt: Date,

        invoiceUrl: { type: String, default: "" },

        isReturnRequested: { type: Boolean, default: false },
        returnRequestedAt: Date,
        isReturned: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Order = mongoose.model<IOrder>("Order", orderSchema);
export default Order;