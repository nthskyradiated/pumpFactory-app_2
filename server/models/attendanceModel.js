import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({

    id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
        index: true,
    },
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

AttendanceSchema.method('removeSession', async function () {
    // Remove the document's custom id from the client's documents array
    await mongoose.model('Client').updateOne({ _id: this.clientId }, { $pull: { sessions: this.id } });
  
    // Remove the document
    return this.deleteOne();
  });

export default mongoose.model('Attendance', AttendanceSchema)