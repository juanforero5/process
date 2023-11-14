import mongoose from 'mongoose';
import { MONGO_URI } from '../commons/env.mjs';
import ProcessModel from '../models/Process.mjs';

export const startConnection = async () => {
  const url = encodeURI(MONGO_URI);
  await mongoose.connect(url);
};

export const findObject = async (id) => {
  const oid = new mongoose.Types.ObjectId(id);
  const res = await ProcessModel.findOne({
    $or: [
      { _id: oid },
      { 'images._id': oid },
      { 'images.filtered._id': oid },
    ],
  }).exec();

  return res;
};

export const closeConnection = async () => {
  mongoose.connection.close();
};

export default startConnection;
