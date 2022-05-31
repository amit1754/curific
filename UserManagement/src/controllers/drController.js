import { drModel, customerModel } from '../models';
import { CONSTANTS } from '../constants';
import { errorLogger, otpGenerator, SendEmail, jwtGenerate } from '../utils';
import { hashPassword } from '../utils';
const {
	RESPONSE_MESSAGE: { DR_USER, FAILED_RESPONSE, CUSTOMER_MESSAGE },
	STATUS_CODE: { SUCCESS, FAILED },
	USER_TYPE: { CUSTOMER },
} = CONSTANTS;

const createDr = async (req, res) => {
	try {
		const createOtp = otpGenerator();
		const { email, password, type, name } = req.body;
		const { hashedPassword, salt } = await hashPassword(password);

		const insertObj = {
			...req.body,
			otp: createOtp,
			password: hashedPassword,
			salt: salt,
		};

		if (type === CUSTOMER) {
			const findCustomer = await customerModel.findOne({ email });
			if (findCustomer !== null) {
				console.log('findCustomer', findCustomer);
				await SendEmail.sendRegisterEmail(email, createOtp, name);
				return res.status(SUCCESS).send({
					success: true,
					msg: CUSTOMER_MESSAGE.VERIFY_OTP,
					data: [],
				});
			} else {
				const customer = new customerModel(insertObj);
				const saveCustomer = await customer.save();
				if (saveCustomer) {
					await SendEmail.sendRegisterEmail(email, createOtp, name);
					return res.status(SUCCESS).send({
						success: true,
						msg: CUSTOMER_MESSAGE.VERIFY_OTP,
						data: [],
					});
				} else {
					throw new Error(CUSTOMER_MESSAGE.CREATE_FAILED);
				}
			}
		} else {
			const findDr = await drModel.findOne({ email });
			if (!findDr) {
				const saveDr = new drModel(insertObj);
				const saveResponse = await saveDr.save();

				if (saveResponse) {
					await SendEmail.sendRegisterEmail(
						insertObj.email,
						createOtp,
						saveResponse.name,
					);
					return res.status(SUCCESS).send({
						success: true,
						msg: DR_USER.VERIFY_OTP,
						data: [],
					});
				} else {
					throw new Error(DR_USER.CREATE_FAILED);
				}
			} else {
				await SendEmail.sendRegisterEmail(
					insertObj.email,
					createOtp,
					findDr.name,
				);
				return res.status(SUCCESS).send({
					success: true,
					msg: DR_USER.VERIFY_OTP,
					data: [],
				});
			}
		}
	} catch (error) {
		if (error.code === 11000) {
			error.message = DR_USER.ALREADY_AVAILABLE;
		}
		errorLogger(error.message, req.originalUrl, req.ip);
		return res.status(FAILED).json({
			success: false,
			error: error.message || FAILED_RESPONSE,
		});
	}
};
const verifyOtp = async (req, res) => {
	try {
		const { otp, email, type } = req.body;

		if (type === CUSTOMER) {
			const findAndVerify = await customerModel.findOneAndUpdate(
				{ email, otp: Number(otp) },
				{ $set: { otp: null, isEnabled: true } },
				{ new: true },
			);
			if (findAndVerify) {
				let token = jwtGenerate(findAndVerify._id, type);
				return res.status(SUCCESS).send({
					success: true,
					msg: CUSTOMER_MESSAGE.VERIFY_SUCCESS,
					data: { token, type },
				});
			} else {
				throw new Error(CUSTOMER_MESSAGE.VERIFY_FAILED);
			}
		} else {
			const findDr = await drModel.findOne({ email, isEnabled: false });
			if (findDr) {
				if (findDr.otp === otp) {
					await drModel.findOneAndUpdate(
						{ email },
						{ $set: { isEnabled: true } },
						{ new: true },
					);
					let token = jwtGenerate(findDr._id, type);
					return res.status(SUCCESS).send({
						success: true,
						msg: DR_USER.VERIFY_SUCCESS,
						data: { token, type },
					});
				} else {
					throw new Error(DR_USER.VERIFY_FAILED);
				}
			} else {
				throw new Error(DR_USER.VERIFY_FAILED);
			}
		}
	} catch (error) {
		console.log('error', error);
		errorLogger(error.message, req.originalUrl, req.ip);
		return res.status(FAILED).json({
			success: false,
			error: error.message || FAILED_RESPONSE,
		});
	}
};
const updateProfile = async (req, res) => {
	try {
		const { id } = req.params;
		const { mainStream, specialization, designation } = req.body;
		const updateDr = await drModel.findOneAndUpdate(
			{ _id: id },
			{ $set: { mainStream, specialization, designation } },
			{ new: true },
		);
		if (updateDr) {
			return res.status(SUCCESS).send({
				success: true,
				msg: DR_USER.UPDATE_SUCCESS,
				data: [],
			});
		} else {
			throw new Error(DR_USER.UPDATE_FAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		return res.status(FAILED).json({
			success: false,
			error: error.message || FAILED_RESPONSE,
		});
	}
};
const deleteDr = async (req, res) => {
	try {
		const { id } = req.params;
		const deleteDr = await drModel.findOneAndUpdate(
			{ _id: id },
			{
				$set: { isEnabled: false, deletedBy: req.user._id, deletedAt: Date() },
			},
			{ new: true },
		);
		if (deleteDr) {
			return res.status(SUCCESS).send({
				success: true,
				msg: DR_USER.DELETE_SUCCESS,
				data: [],
			});
		} else {
			throw new Error(DR_USER.DELETE_FAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		return res.status(FAILED).json({
			success: false,
			error: error.message || FAILED_RESPONSE,
		});
	}
};

export default {
	createDr,
	verifyOtp,
	updateProfile,
	deleteDr,
};
