import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import server from "./server";

declare const process: {
    env: {
        PORT: number,
        MONGO_URL: string
    }
}

const port = process.env.PORT



mongoose.connect(process.env.MONGO_URL)

mongoose.connection.on("connected", () => {
    server.listen(port, () => {
        console.log("Server is running on port:", port)
        console.table(listEndpoints(server))
    })
})