import { adminUserService } from '../../mongoServices';
import { CONSTANTS } from '../../constants';
import {
	errorLogger,
	hashPassword,
	comparePassword,
	jwtGenerate,
	notification,
} from '../../utils';
import { isValidObjectId } from 'mongoose';
const {
	RESPONSE_MESSAGE: { ADMINUSER, FAILED_RESPONSE, INVALID_OBJECTID },
	STATUS_CODE: { SUCCESS, FAILED },
} = CONSTANTS;
const adminUserCreate = async (req, res) => {
	try {
		const { email, name } = req.body;
		const checkExistingUser = await adminUserService.userQuery({
			email,
			name,
			orQuery: true,
		});
		if (checkExistingUser) {
			throw new Error(ADMINUSER.USER_AVAILABLE);
		}
		const passwordGenerate = generatePassword();
		const { hashedPassword, salt } = await hashPassword(passwordGenerate);
		const insetObj = {
			...req.body,
			hashedPassword,
			salt,
		};

		const adminUserSave = new adminUserDelete(insetObj);
		const saveResponse = await adminUserSave.save();
		if (saveResponse) {
			return res.status(SUCCESS).send({
				success: true,
				msg: ADMINUSER.CREATE_SUCCESS,
				data: [],
			});
		} else {
			throw new Error(ADMINUSER.CREATE_FAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		return res.status(FAILED).json({
			success: false,
			error: error.message || FAILED_RESPONSE,
		});
	}
};

const adminUserLogin = async (req, res) => {
	try {
		const { email, password } = req.body;
		const checkExistingUser = await adminUserService.userQuery({
			email,
			populate: true,
		});
		// check user is exist or not
		if (!checkExistingUser) {
			throw new Error(ADMINUSER.NOT_ADMINUSER);
		}
		// check user attribute
		if (
			checkExistingUser.isEnabled === false ||
			checkExistingUser.deletedAt != null
		) {
			throw new Error(ADMINUSER.LOGIN_SUSPEND);
		}
		const verifyPassword = await comparePassword(
			password,
			checkExistingUser?.hashedPassword,
		);
		if (!verifyPassword) throw new Error('Email or Password is incorrect');

		const token = await jwtGenerate(
			checkExistingUser?._id,
			process.env.JWT_EXPIRY,
		);

		return res.status(200).send({
			success: true,
			data: { ...checkExistingUser._doc, token },
			msg: ` Login Successfully`,
		});
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		return res.status(FAILED).json({
			success: false,
			error: error.message || FAILED_RESPONSE,
		});
	}
};

const adminUserList = async (req, res) => {
	try {
		const { data, totalCount } = await adminUserService.findAllQuery(req.query);
		if (data) {
			return res.status(SUCCESS).send({
				success: true,
				msg: ADMINUSER.GET_SUCCESS,
				total: totalCount,
				data,
			});
		} else {
			throw new Error(ADMINUSER.GET_FAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		return res.status(FAILED).json({
			success: false,
			error: error.message || FAILED_RESPONSE,
		});
	}
};
const adminUserUpdate = async (req, res) => {
	try {
		const {
			params: { id },
		} = req;
		if (!isValidObjectId(id)) {
			throw new Error(INVALID_OBJECTID);
		}
		let filter = { _id: id };
		const { data } = await adminUserService.findAllQuery(filter);
		if (data.length != 1) throw new Error(ADMINUSER.NOT_ADMINUSER);

		if (data[0].role.name === 'SUPER_USER') {
			throw new Error('Super User cannot update');
		} else {
			let update = { ...req.body };
			const updateAdminUser = await adminUserService.updateOneQuery(
				filter,
				update,
			);
			if (!updateAdminUser) throw new Error(ADMINUSER.UPDATE_FAILED);
			return res.status(SUCCESS).json({
				success: true,
				message: ADMINUSER.UPDATE_SUCCESS,
				data: [],
			});
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		return res.status(FAILED).json({
			success: false,
			error: error.message || FAILED_RESPONSE,
		});
	}
};

const adminUserStatus = async (req, res) => {
	try {
		const {
			params: { id },
		} = req;
		if (!isValidObjectId(id)) {
			throw new Error(INVALID_OBJECTID);
		}
		let filter = { _id: id };
		const { data } = await adminUserService.findAllQuery(filter);
		if (data.length != 1) throw new Error(ADMINUSER.NOT_ADMINUSER);

		if (data[0].role.name === 'SUPER_USER') {
			throw new Error('Super User cannot update');
		} else {
			let update = { isEnabled: data[0].isEnabled === true ? false : true };
			const updateAdminUser = await adminUserService.updateOneQuery(
				filter,
				update,
			);
			if (!updateAdminUser) throw new Error('status is not updated');
			return res.status(SUCCESS).send({
				success: true,
				msg: 'status update successfully',
				data: [],
			});
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		return res.status(FAILED).json({
			success: false,
			error: error.message || FAILED_RESPONSE,
		});
	}
};
const adminUserDelete = async (req, res) => {
	try {
		const {
			params: { id },
		} = req;
		if (!isValidObjectId(id)) {
			throw new Error(INVALID_OBJECTID);
		}
		let filter = { _id: id };
		const { data } = await adminUserService.findAllQuery(filter);
		if (data.length != 1) throw new Error(ADMINUSER.NOT_ADMINUSER);

		if (data[0].role.name === 'SUPER_USER') {
			throw new Error('Super User cannot update');
		} else {
			let update = { deletedAt: new Date() };
			const updateAdminUser = await adminUserService.updateOneQuery(
				filter,
				update,
			);
			if (!updateAdminUser) throw new Error('status is not updated');
			return res.status(SUCCESS).send({
				success: true,
				msg: 'status update successfully',
				data: [],
			});
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		return res.status(FAILED).json({
			success: false,
			error: error.message || FAILED_RESPONSE,
		});
	}
};
const adminUserChangePassword = async (req, res) => {
	try {
		const {
			currentUser: { _id },
			body: { oldPassword, newPassword },
		} = req;

		let filter = { _id };
		const { data } = await adminUserService.findAllQuery(filter);
		if (data.length != 1) throw new Error(ADMINUSER.NOT_ADMINUSER);

		const comparePass = await comparePassword(
			oldPassword,
			data[0].hashedPassword,
		);
		if (comparePass) {
			const { salt, hashedPassword } = await hashPassword(newPassword);
			let updateObj = {
				salt,
				hashedPassword,
				firstLogin: false,
			};
			const passwordChange = await adminUserService.updateOneQuery(
				filter,
				updateObj,
			);
			if (passwordChange) {
				await notification.createNotification('changePassword', data);
				return res.status(SUCCESS).send({
					success: true,
					msg: ADMINUSER.PASSWORD_CHANGED,
					data: [],
				});
			} else {
				throw new Error(ADMINUSER.PASSWORD_NOT_CHANGED);
			}
		} else {
			throw new Error('Password is invalid');
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		return res.status(FAILED).json({
			success: false,
			error: error.message || FAILED_RESPONSE,
		});
	}
};
const forgetPassword = async (req, res) => {
	try {
		const { email } = req.body;
		const checkExistingUser = await adminUserService.userQuery({
			email,
		});
		if (!checkExistingUser) {
			throw new Error(ADMINUSER.USER_NOT_AVAILABLE);
		} else {
			return res.status(SUCCESS).send({
				success: true,
				msg: 'Mail send successfully',
				data: [],
			});
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		return res.status(FAILED).json({
			success: false,
			error: error.message || FAILED_RESPONSE,
		});
	}
};
const resetPassword = async (req, res) => {
	try {
		const {
			currentUser: { _id },
		} = req;
		const { newPassword } = req.body;

		let filter = { _id };
		const { salt, hashedPassword } = await hashPassword(newPassword);
		let update = {
			salt,
			hashedPassword,
			firstLogin: false,
		};
		const updateAdminUser = await adminUserService.updateOneQuery(
			filter,
			update,
		);
		if (updateAdminUser) {
			return res.status(SUCCESS).json({
				success: false,
				msg: error.message || FAILED_RESPONSE,
			});
		} else {
			throw new Error('password changing failed');
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
	adminUserCreate,
	adminUserLogin,
	adminUserList,
	adminUserUpdate,
	adminUserStatus,
	adminUserDelete,
	adminUserChangePassword,
	forgetPassword,
	resetPassword,
};
