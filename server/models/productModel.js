import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    price: {
        type: Number
    },
    productType: {
        type: String,
        enum: ["EVENT", "SESSION_BASED", "TIME_BASED"]
    },
    counter: {
        type: Number
    },

}, {timestamps: true}
);

export default mongoose.model('Product', ProductSchema)