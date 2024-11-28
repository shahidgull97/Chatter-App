import dotenv from "dotenv";
dotenv.config();
import { server } from "./server.js";
import { connectToDataBase } from "./src/databaseConfig.js";

server.listen(3000, () => {
  console.log("Server is running on port 3000");
  connectToDataBase();
});
