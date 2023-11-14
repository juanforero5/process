import { Schema, model } from 'mongoose';
import { TYPE_OF_FILTERS } from '../commons/constans.mjs';

const ImageSchema = new Schema({
  imageUrl: { type: String },
  filtered: {
    type: [{
      name: { type: String },
      imageUrl: { type: String },
      status: { type: String },
    }],
  },
});
export const ImageModel = model('image', ImageSchema);

// Process schema that contains image sub schema
const ProcessSchema = new Schema({
  filters: {
    type: [
      {
        type: String,
        enum: TYPE_OF_FILTERS,
        required: true,
      },
    ],
  },
  images: { type: [ImageSchema] },
}, {
  timestamps: true,
});

const ProcessModel = model('process', ProcessSchema);

export default ProcessModel;
