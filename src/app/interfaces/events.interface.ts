import { Types } from "mongoose";

export interface IEvents {
  eventTitle: string;
  name: string;
  dateAndTime: Date;
  location: string;
  description: string;
  attendeeCount: number;
}

export interface IJoinEvents {
  user: Types.ObjectId,
  event: Types.ObjectId
}
