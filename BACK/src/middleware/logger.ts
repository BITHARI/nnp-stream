import chalk from "chalk";
import morgan from "morgan";

export default function loggerConfig() {
    morgan.token('colored-method', (req) => {
        const method = req.method;
        switch (method) {
            case 'GET': return chalk.green(method);
            case 'POST': return chalk.blue(method);
            case 'PUT': return chalk.yellow(method);
            case 'PATCH': return chalk.yellow(method);
            case 'DELETE': return chalk.red(method);
            default: return chalk.gray(method);
        }
    });

    morgan.token('colored-status', (req, res) => {
        const status = res.statusCode;
        if (status >= 200 && status < 300) {
            return chalk.green(status);
        } else if (status >= 300 && status < 400) {
            return chalk.cyan(status);
        } else if (status >= 400 && status < 500) {
            return chalk.yellow(status);
        } else if (status >= 500) {
            return chalk.red(status);
        }
        return chalk.gray(status);
    });

    morgan.token('colored-url', (req) => {
        return chalk.blue.underline(req.url);
    });
}