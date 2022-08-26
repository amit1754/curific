export default {
	SERVER: {
		PORT: 5001,
		PRODUCTION: false,
		LOG_PATH: 'logs',
		FRONTEND_URL: 'http://localhost:3000/',
		FILE_PATH: 'public/uploads',
	},
	DATABASE: {
		MONGO_URI:
			'mongodb+srv://tushar-centi:bkubsuac5eHw05W3@cluster0.gph712q.mongodb.net/database?retryWrites=true&w=majority',
		MONGO_DB_NAME: 'database',
	},

	JWT: {
		SECRET: 'SECRET',
		EXPIRY: '7d',
		FORGET_TOKEN_EXPIRY: '10m',
		ACCOUNT_ACTIVATION: 'SECRET',
	},
	SENDGRID: {
		EMAIL: 'tushar.savaliya@centillionsofttech.com',
		API_KEY:
			'SG.GBWde9CwRHuk6dhzMWTSCQ.vuWUJAaa7VCgg9Ccr7fPg4d9HgBSWAVKQhdKj4e8WvM',
	},
	S3: {
		BUCKET_NAME: 'curificapp/appointment_book',
		ACCESS_KEY_ID: 'AKIAUBALB3TL2Z47CA4M',
		AWS_SECRET_KEY: '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',
		AWS_BUCKET_REGION: 'us-east-1',
	},
	ROZOR_PAY: {
		key: 'rzp_test_iOVnJNIrKGFV76',
		secrate: 'SIvHrU3AXtO3SMN7J1fmd6sE',
	},
	SOCKET: {
		PORT: 8000,
	},
};
