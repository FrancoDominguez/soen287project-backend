import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  breed: { type: String, required: true },
  age: { type: String, required: true },
  imageSrc: { type: String, required: true },
  description: { type: String, required: true },
});

export default mongoose.model("pets", petSchema);
