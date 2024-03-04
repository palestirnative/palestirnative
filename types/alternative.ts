import type { ObjectId } from "mongodb";
import { Boycott } from "./boycott.ts";

export interface AlternativeCreationPayload {
  name: string;
  countries: string[];
  boycotts: string[];
  logoURL: string;
}

export interface AlternativeCreationData extends AlternativeCreationPayload {
  nameSlug: string;
}

export interface Alternative {
  _id: ObjectId;
  name: string;
  nameSlug: string;
  logoURL: string;
  countries: string[];
  boycotts: Boycott[];
  createdAt: Date;
}
