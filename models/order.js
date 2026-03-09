const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        customer: {
            name: String,
            phone: String,
            address: String
        },
        items: [
            {
                _id: String,
                name: String,
                price: Number,
                qty: Number
            }
        ],
        subtotal: Number,
        tax: Number,
        total: Number,
        status: { type: String, default: "placed" }
    },
    { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema);
