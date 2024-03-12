import type { ObjectId } from "mongodb";
import { AlternativeStatus, Boycott } from "./boycott.ts";
import { Label } from "../components/LabelTag.tsx";

export interface AlternativeCreationPayload {
  name: string;
  countries: string[];
  boycotts: Boycott[];
  logoURL: string;
  website?: string;
}

export interface AlternativeCreationData extends AlternativeCreationPayload {
  nameSlug: string;
  createdAt: Date;
  status: AlternativeStatus
}

export interface Alternative {
  alternative: any;
  _id: ObjectId;
  name: string;
  nameSlug: string;
  logoURL: string;
  countries: string[];
  boycotts: Boycott[];
  label: Label;
  createdAt: Date;
  status: AlternativeStatus
  website?: string;
}
