import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
    checkIn: {
        type: Date
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client'
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }
}, { timestamps: true });

export default mongoose.model('Attendance', AttendanceSchema)