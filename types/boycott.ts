import { ObjectId } from "mongodb";
import { Alternative } from "./alternative.ts";
import { Category } from "./category.ts";

export enum BoycottStatus {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
}

export interface BoycottCreationPayload {
  name: string;
  reasonURL: string;
  logoURL: string;
  categories: ObjectId[];
  countries: string[];
}

export interface BoycottCreationData extends BoycottCreationPayload {
  nameSlug: string;
  status: BoycottStatus;
  categories: ObjectId[];
  alternatives: {alternative: ObjectId, status: AlternativeStatus}[];
  createdAt: Date;
}

export enum AlternativeStatus {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
}

export interface Boycott {
  _id: ObjectId;
  name: string;
  nameSlug: string;
  logoURL: string;
  reasonURL: string;
  categories: Category[];
  alternatives: Alternative[];
  attachedAlternatives?: Alternative[];
  createdAt: Date;
  countries: string[];
  status: BoycottStatus;
}
