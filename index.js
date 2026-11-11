import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import todoRoutes from "./routes/todo.routes.js";

dotenv.config();

const PORT = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/todos", todoRoutes);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
