import express, { Request, Response } from 'express';
import { createEventZodSchema, joinEventZodSchema } from '../zodSchemas/event.zod';
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


// Get All Notes 
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


// // Get Single Note
// notesRouter.get("/:noteId", async (req: Request, res: Response) => {
//     const noteId = req.params.noteId

//     const note = await Note.findById(noteId)

//     res.status(200).json({
//         status: true,
//         note,
//         isPinned: note?.isPinned() ? "This note is pinned" : "Not pinned"
//     })
// })


// // Delete Single Note
// notesRouter.delete("/:noteId", async (req: Request, res: Response) => {
//     const noteId = req.params.noteId

//     const note = await Note.findByIdAndDelete(noteId)

//     res.status(200).json({
//         status: true,
//         note
//     })
// })


// // Update Single Note
// notesRouter.patch("/:noteId", async (req: Request, res: Response) => {
//     const noteId = req.params.noteId
//     const updatedBody = req.body

//     const note = await Note.findByIdAndUpdate(noteId, updatedBody, { new: true })

//     res.status(200).json({
//         status: true,
//         note
//     })
// })

