import mongoose from "mongoose";

const ClientDocumentSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client'
    },
    documentType: {
        type: String,
    },
    documentURL: {
        type: String
    }
}, { timestamps: true });

export default mongoose.model('ClientDocument', ClientDocumentSchema);