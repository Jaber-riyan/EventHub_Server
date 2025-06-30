import mongoose, { Schema, model } from "mongoose"
import { IEvents, IJoinEvents } from "../interfaces/events.interface"

const eventSchema = new Schema<IEvents>(
    {
        eventTitle: { type: String, required: true, trim: true, index: true },
        name: { type: String, required: true, trim: true },
        dateAndTime: { type: Date, required: true },
        location: { type: String, required: true },
        description: { type: String, required: true },
        attendeeCount: { type: Number, default: 0 },
    },
    {
        versionKey: false,
        timestamps: true
    }
)

const joinEventSchema = new Schema<IJoinEvents>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

joinEventSchema.index({ user: 1, event: 1 }, { unique: true });

export const Event = model<IEvents>("Event", eventSchema)
export const JoinEvent = model<IJoinEvents>("JoinEvent", joinEventSchema);