import express, { Request, Response } from "express"
import { User } from "../models/users.model"
import { userLoginZodSchema, userRegistrationZodSchema } from "../zodSchemas/user.zod"
import bcrypt from 'bcrypt'

export const usersRouter = express.Router()

// Create a User
usersRouter.post('/signup', async (req: Request, res: Response) => {
    try {
        const parsed = userRegistrationZodSchema.safeParse(req.body);

        if (!parsed.success) {
            res.status(400).json({
                success: false,
                message: "Validation error",
                error: parsed.error.format(),
            });
            return
        }

        const { email } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            res.status(409).json({
                success: false,
                message: "User already exists with this email",
            });
            return 
        }

        const user = await User.create(req.body);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message,
        });
    }
});

// get a user from the mongodb by email API
usersRouter.post("/signin", async (req: Request, res: Response) => {
    try {
        const parsed = userLoginZodSchema.safeParse(req.body)

        if (!parsed.success) {
            res.status(400).json({
                success: false,
                message: "Validation error",
                error: parsed.error?.format(),
            });
            return
        }

        const { password, ...userInfo } = req.body

        let user = await User.findOne({ email: userInfo.email })

        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found",
            })
            return
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            res.status(401).json({
                success: false,
                message: `Incorrect Password`
            })
            return
        }

        // update last login time
        await User.updateOne({ email: userInfo.email }, {
            $set: {
                lastLoginTime: userInfo?.lastLoginTime,
            },
        })

        const updatedUser = await User.findOne({ email: userInfo.email });

        res.status(200).json({
            success: true,
            message: "Login Successfully",
            user: updatedUser,
        })
    }
    catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Login failed",
            error: error.message,
        })
    }
})

// // Get all users
// usersRouter.get('/', async (req: Request, res: Response) => {

//     const userEmail = req.query.email

//     const users = await User.find().sort({ email: -1 })

//     res.status(201).json({
//         success: true,
//         message: "All Users Retrieve successfully",
//         users
//     })
// })

// // get single user
// usersRouter.get('/:userId', async (req: Request, res: Response) => {
//     const userId = req.params.userId
//     const user = await User.findById(userId)

//     res.status(201).json({
//         success: true,
//         message: "User retrieved successfully",
//         user
//     })
// })

// // delete single user
// usersRouter.delete('/:userId', async (req: Request, res: Response) => {
//     const userId = req.params.userId
//     const user = await User.findByIdAndDelete(userId)


//     res.status(201).json({
//         success: true,
//         message: "User Deleted successfully",
//         user
//     })
// })

// // update single user
// usersRouter.patch('/:userId', async (req: Request, res: Response) => {
//     const userId = req.params.userId
//     const updatedBody = req.body;
//     const user = await User.findByIdAndUpdate(userId, updatedBody, { new: true, })

//     res.status(201).json({
//         success: true,
//         message: "User updated successfully",
//         user
//     })
// })