import { ObjectId } from "mongodb";

export interface Category {
  _id: ObjectId;
  name: string;
  nameSlug: string;
  createdAt: Date;
  icon: string;
}

export interface CategoryCreationPayload {
  name: string;
}
