import express from "express";
import { create, join, pick, refresh } from './routes';
import bodyParser from 'body-parser';


// Configure and start the HTTP server.
const port = 8088;
const app = express();
app.use(bodyParser.json());
app.post("/api/create", create);
app.get("/api/join", join);
app.post("/api/pick", pick);
app.get("/api/refresh", refresh);
app.listen(port, () => console.log(`Server listening on ${port}`));
