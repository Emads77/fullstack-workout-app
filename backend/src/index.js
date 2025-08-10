import express from "express";
import statusCodes from "http-status-codes";
import cors from "cors";
import routes from "./routes/routes.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use('/', routes);

app.use((req, res) => {
    res.status(statusCodes.NOT_FOUND).json({error: 'Endpoint not found'});
});

// Global error handler
app.use((err, req, res, next) => {
    res
        .status(err.status || statusCodes.INTERNAL_SERVER_ERROR)
        .json({message: err.message || 'Something went wrong!'});
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port}!`);
});
