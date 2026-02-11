import express from "express";
import helmet from "helmet";
import cors from 'cors';
import morgan from "morgan";
import loggerConfig from "./middleware/logger.js";

import authRoutes from "./routes/auth.js";
import routes from "./routes/routes.js";
import { handleMuxWebhook } from "./lib/muxWebhook.js";

const app = express();
const port = process.env.SERVER_PORT

const allowedOrigins = process.env.ALLOWED_ORIGIN?.split(',') || [];

app.use(helmet());
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))

loggerConfig();
app.use(morgan('[:date[iso]] :colored-method :colored-url :colored-status :response-time ms - :res[content-length]'))
app.use(express.json());

app.post('/api/webhooks/mux',
    express.raw({ type: 'application/json' }),
    handleMuxWebhook
);

app.get("/", (req, res) => {
    res.send("This is NNP Stream!");
});

app.use('/api/authentication', authRoutes);
app.use('/api', routes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});