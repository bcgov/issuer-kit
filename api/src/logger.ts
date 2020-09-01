import { createLogger, format, transports } from 'winston';

// Configure the Winston logger. For the complete documentation see https://github.com/winstonjs/winston
const logger = createLogger({
  // To see more detailed errors, change this to 'debug'
  level: (process.env.LOG_LEVEL || 'info').toLowerCase(),
  format: format.combine(
    format.splat(),
    format.simple()
  ),
  transports: [
    new transports.Console()
  ],
});

export default logger;
