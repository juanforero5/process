import mongoose from "mongoose";

export const startConnection = async () => {
    const url = encodeURI("mongodb+srv://juanforero5:Colombia2023*@cluster0.ehanten.mongodb.net/?retryWrites=true&w=majority");
    await mongoose.connect(url);
}

