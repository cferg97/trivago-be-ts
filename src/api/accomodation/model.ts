import mongoose from "mongoose";
import { Document, Model, Schema } from "mongoose";

interface Accomodation extends Document {
  name: string;
  host: Schema.Types.ObjectId;
  description: string;
  maxGuests: number;
  city: string;
  country: string;
}

const accomodationSchema: Schema<Accomodation> = new Schema(
  {
    name: { type: String, required: true },
    host: { type: Schema.Types.ObjectId, ref: "users", required: true },
    description: { type: String, required: true },
    maxGuests: { type: Number, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const accomodationModel: Model<Accomodation> = mongoose.model(
  "accomodation",
  accomodationSchema
);

export default accomodationModel;
 