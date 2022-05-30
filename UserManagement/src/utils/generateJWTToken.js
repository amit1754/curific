import { sign } from 'jsonwebtoken';
require('dotenv').config({ path: 'src/config/.env' });

const secret = process.env.JWT_ACCOUNT_ACTIVATION;

const generateJWTToken = (id, expiry) => {
	const token = sign({ sub: id }, secret, { expiresIn: '7d' });
	return token;
};

export default generateJWTToken;
