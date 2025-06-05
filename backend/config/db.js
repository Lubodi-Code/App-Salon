import mongoose from "mongoose";
import colors from "colors";
export const db = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URI);
        const url = `${db.connection.host}:${db.connection.port}`;
        console.log(colors.black.bgCyan(`MongoDB conectado en: ${url}`));
        console.log("Base de datos conectada");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}
