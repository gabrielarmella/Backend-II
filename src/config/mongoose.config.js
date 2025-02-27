import { connect, Types } from "mongoose";


export const connectDB = async () => {
    try {
        await connect(process.env.MONGODB_URI);
        console.log("Conectado a MongoDB");
    } catch (error) {
        console.error("Error al conectar con MongoDB", error);
    }
};

export const isValidID = (id) => {
    return Types.ObjectId.isValid(id);
};