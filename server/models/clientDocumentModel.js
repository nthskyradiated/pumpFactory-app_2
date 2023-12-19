import mongoose from "mongoose";

const ClientDocumentSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client'
    },

    documentName: {
        type: String,
        unique: true,
    },
    documentType: {
        type: String,
        enum: ["WAIVER", "IDENTIFICATION", "PHOTO"]
    },
    documentURL: {
        type: String,
        unique: true,
    }
}, { timestamps: true });

export default mongoose.model('ClientDocument', ClientDocumentSchema);