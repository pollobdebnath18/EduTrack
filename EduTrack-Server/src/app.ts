import express from "express";
import cors from "cors";
import router from "./routes";

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/v1", router);

//Home Route
app.get("/", (_,res)=>{
    res.json({
        success: true,
        message: "Welcome to EduTrack Server"
    })
})

export default app;