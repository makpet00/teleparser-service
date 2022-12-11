import mongoose from "mongoose";

export interface IItem {
    itemId: string,
    trackerId: string,
    timestamp?: string,
    url?: string,
    title?: string,
    price?: number,
    imageUrl?: string,
    description?: string
}

const itemSchema = new mongoose.Schema({
    itemId: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    price: {
        type: Number,
        required: true,
    },
    imageUrl: {
        type: String,
        required: false,
    },
    trackerId: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        required: true
    }
})

export const Item = mongoose.model("Item", itemSchema);
