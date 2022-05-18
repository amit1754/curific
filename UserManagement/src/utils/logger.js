import winston from 'winston';
import currentDate from './currentDate.js';

const todayDate = currentDate.getDate(new Date());
const LOGS_PATH = process.env.LOG_PATH;

const logger = {
	infoLog: winston.createLogger({
		level: 'info',
		format: winston.format.json(),
		transports: [
			new winston.transports.File({
				filename: `${LOGS_PATH}/${todayDate}_info.log`,
			}),
		],
	}),

	errorLog: winston.createLogger({
		level: 'error',
		format: winston.format.json(),
		transports: [
			new winston.transports.File({
				filename: `${LOGS_PATH}/${todayDate}_error.log`,
			}),
		],
	}),
};

export default logger;
