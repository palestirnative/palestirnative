export interface Category {
  _id: ObjectId;
  name: string;
  nameSlug: string;
  createdAt: Date;
}

export interface CategoryCreationPayload {
  name: string;
}
