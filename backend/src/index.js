import express from "express";
import statusCodes from "http-status-codes";
import cors from "cors";
import routes from "./routes/routes.js";

const app = express();
const port = 3000;
const host = "0.0.0.0";

app.use(express.json());
app.use(cors());
app.use('/', routes);

// 404 Catch-all for undefined endpoints
app.use((req, res) => {
    res.status(statusCodes.NOT_FOUND).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    // 1. Delegate to default Express error handler if headers were already sent
    if (res.headersSent) {
        return next(err);
    }

    const statusCode = err.statusCode || err.status || statusCodes.INTERNAL_SERVER_ERROR;

    console.error(`[Error] ${statusCode}:`, err);

    // If it's a 500-level error, hide the details. If it's a 400-level, show the message.
    const safeMessage = statusCode >= 500 
        ? 'Internal Server Error' 
        : err.message || 'Something went wrong!';

    // 5. Send the final response
    res.status(statusCode).json({ message: safeMessage });
});

app.listen(port, host, () => {
    console.log(`Server listening on port ${port} and host ${host}`);
});
