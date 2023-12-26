import mongoose from "mongoose";

const ClientDocumentSchema = new mongoose.Schema({

    id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
        index: true,
    },

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

ClientDocumentSchema.method('removeDocument', async function () {
    // Remove the document's custom id from the client's documents array
    await mongoose.model('Client').updateOne({ _id: this.clientId }, { $pull: { documents: this.id } });
  
    // Remove the document
    return this.deleteOne();
  });
  

export default mongoose.model('ClientDocument', ClientDocumentSchema);