import express, { Request, Response } from 'express';
import { createEventZodSchema, joinEventZodSchema, updateEventZodSchema } from '../zodSchemas/event.zod';
import { Event, JoinEvent } from '../models/events.model';
import mongoose from 'mongoose';

export const eventsRouter = express.Router()

// Create Event
eventsRouter.post("/create-event", async (req: Request, res: Response) => {

    try {
        const body = req.body

        const parsed = createEventZodSchema.safeParse(body)

        if (!parsed.success) {
            res.status(400).json({
                success: false,
                message: "Validation error",
                error: parsed.error?.format(),
            });
            return
        }

        const event = await Event.create(parsed.data)

        res.status(201).json({
            success: true,
            message: "Event Created Successfully",
            event
        })
    }
    catch (error: any) {
        res.json({
            success: true,
            error: error.message
        });
    }
})

// Get All Events 
eventsRouter.get("/", async (req: Request, res: Response) => {
    try {
        const userId = req.query.userId as string;
        const userObjectId = new mongoose.Types.ObjectId(userId);

        const events = await Event.aggregate([
            {
                $sort: {
                    dateAndTime: 1
                }
            },
            {
                $lookup: {
                    from: "joinevents",
                    localField: "_id",
                    foreignField: "event",
                    as: "joinedUsers",
                },
            },
            {
                $addFields: {
                    joined: {
                        $in: [userObjectId, "$joinedUsers.user"],
                    },
                },
            },
            {
                $project: {
                    eventTitle: 1,
                    name: 1,
                    dateAndTime: 1,
                    location: 1,
                    description: 1,
                    attendeeCount: 1,
                    joined: 1,
                    joinedUsers: 1,
                },
            },
        ])

        res.status(200).json({
            status: true,
            events
        })
    }
    catch (error: any) {
        res.json({
            status: false,
            error: error.message
        });
    }
})

// Get Features Events
eventsRouter.get("/features-events", async (req: Request, res: Response) => {
    try {
        const events = await Event.aggregate([
            {
                $sort: {
                    dateAndTime: 1
                }
            },
            {
                $lookup: {
                    from: "joinevents",
                    localField: "_id",
                    foreignField: "event",
                    as: "joinedUsers",
                },
            },
            {
                $project: {
                    eventTitle: 1,
                    name: 1,
                    dateAndTime: 1,
                    location: 1,
                    description: 1,
                    attendeeCount: 1,
                    joined: 1,
                    joinedUsers:1
                },
            },
        ])

        res.status(200).json({
            success: true,
            events
        })
    }
    catch (error: any) {
        res.json({
            success: false,
            error: error.message
        });
    }
})

// Join in a Event
eventsRouter.post("/join", async (req: Request, res: Response) => {
    try {
        const parsed = joinEventZodSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({
                success: false,
                message: "Validation error",
                error: parsed.error?.format(),
            });
            return
        }

        const { user, event } = parsed.data;

        const alreadyJoined = await JoinEvent.findOne({ user, event });
        if (alreadyJoined) {
            res.status(409).json({
                success: false,
                message: "You have already joined this event",
            });
            return
        }

        await JoinEvent.create({ user, event });

        await Event.findByIdAndUpdate(event, {
            $inc: { attendeeCount: 1 },
        });

        res.status(201).json({
            success: true,
            message: "Successfully joined the event",
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message,
        });
    }
});


// Get Single Event
eventsRouter.get("/:name", async (req: Request, res: Response) => {
    try {
        const userName = req.params.name

        const events = await Event.find({ name: userName })

        res.status(200).json({
            success: true,
            events,
        })
    }
    catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message,
        });
    }
})


// Delete Single Event
eventsRouter.delete("/:eventId", async (req: Request, res: Response) => {
    try {
        const { eventId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            res.status(400).json({
                success: false,
                message: "Invalid event ID",
            });
            return
        }

        const deletedEvent = await Event.findByIdAndDelete(eventId);
        await JoinEvent.deleteMany({ event: eventId })

        if (!deletedEvent) {
            res.status(404).json({
                success: false,
                message: "Event not found",
            });
            return
        }

        // ✅ Success response
        res.status(200).json({
            success: true,
            message: "Event deleted successfully",
            data: deletedEvent,
        });
    }
    catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message,
        });
    }
})


// Update Single Event
eventsRouter.patch("/:eventId", async (req: Request, res: Response) => {
    try {
        const eventId = req.params.eventId
        const updatedBody = req.body

        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            res.status(400).json({
                success: false,
                message: "Invalid event ID",
            });
            return
        }

        const parsed = updateEventZodSchema.safeParse(updatedBody)
        if (!parsed.success) {
            res.status(400).json({
                success: false,
                message: "Validation error",
                error: parsed.error?.format(),
            });
            return
        }

        const updateEvent = await Event.findByIdAndUpdate(eventId, updatedBody, { new: true })

        if (!updateEvent) {
            res.status(404).json({
                success: false,
                message: "Event not found",
            });
            return
        }

        // ✅ Success response
        res.status(200).json({
            success: true,
            message: "Event Update successfully",
            data: updateEvent,
        });
    }
    catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message,
        });
    }
})

