import { CONSTANTS } from '../constants';
import {
	appointmentService,
	paymentService,
	scheduleAppointmentService,
} from '../mongoServices';
import { notificationModel, paymentModel, drModel } from '../models';
import { rozorPayment } from '../service';
import customerService from '../mongoServices/customerService';
const moment = require('moment');

const {
	RESPONSE_MESSAGE: { FAILED_RESPONSE, FAQS, PAYMENT },
	STATUS_CODE: { SUCCESS, FAILED },
} = CONSTANTS;

const addPayment = async (req, res) => {
	try {
		const { body } = req;
		const { data: appointment } = await appointmentService.findAllQuery({
			_id: body.appointmentId,
		});

		if (appointment.length !== 0) {
			let filter = { paymentId: body.paymentId };
			let findPayment = await paymentService.findAllQuery(filter);
			if (findPayment.data.length !== 0) {
				throw new Error('Payment is wrong');
			} else {
				const paymentDetails = await rozorPayment(body.paymentId);
				let paymentPayload = {
					paymentId: body.paymentId,
					type: body.type,
					appointmentId: body.appointmentId,
					packageId: body.packageId,
					baseAmount: paymentDetails?.amount / 100,
					paidAmount: paymentDetails?.amount / 100,
					discountAmount: paymentDetails?.discountAmount
						? paymentDetails?.discountAmount
						: 0,
					otherDetails: paymentDetails,
					customerId: req.currentUser._id,
				};
				let savePayload = new paymentModel(paymentPayload).save();
				if (savePayload) {
					if (body.type === 'APPOINTMENT') {
						let filterUpdate = { _id: body.appointmentId };
						let update = {
							paymentID: savePayload._id,
						};

						await appointmentService.updateOneQuery(filterUpdate, update, {});
					}

					if (body.type === 'PACKAGE') {
						let filterUpdate = { _id: body.packageId };
						let update = {
							paymentID: savePayload._id,
						};

						await subscriptionPackageService.updateOneQuery(
							filterUpdate,
							update,
							{},
						);
						let filterUser = { _id: req.currentUser._id };
						let updateUser = {
							subscribedPackages: savePayload._id,
						};
						await customerService.updateOneQuery(filterUser, updateUser);
					}
					res.status(SUCCESS).json({
						success: true,
						message: 'Payment added successfully',
						data: [],
					});
				} else {
					throw new Error('Payment not added');
				}
			}
		} else {
			throw new Error('Appointment not found');
		}
	} catch (error) {
		return res.status(FAILED).json({
			status: false,
			error: error.message || FAILED_RESPONSE,
		});
	}
};
const failedPayment = async (req, res) => {
	try {
		const payload = req.body;
		const { data: findPaymentData } = await paymentService.findAllQuery(
			payload,
		);
		console.log('findPaymentData', findPaymentData.length);

		if (findPaymentData.length === 0) {
			const scheduleAppointmentData =
				await scheduleAppointmentService.deleteOneQuery(payload);

			if (scheduleAppointmentData) {
				await appointmentService.deleteOneQuery(payload.appointmentId);
			}
			return res.status(SUCCESS).json({
				success: true,
				message: 'Failed payment deleted successfully',
				data: [],
			});
		} else {
			return res.status(SUCCESS).json({
				success: true,
				message: 'Payment already done',
				data: [],
			});
		}
	} catch (error) {
		console.log('error', error);
		res.status(FAILED).json({
			status: false,
			error: error.message || FAILED_RESPONSE,
		});
	}
};

const getPayment = async (req, res) => {
	try {
		const { _id } = req.body;
		if (_id) {
			let saveResponse = await drModel.find({ _id: _id });
			return res.status(SUCCESS).json({
				success: true,
				message: PAYMENT.GET_SUCCESS,
				data: saveResponse,
			});
		}
		const lastTenDayRecord = await drModel.find({
			createdAt: {
				$gte: moment().add(-10, 'days'),
			},
		});
		const payload = {
			...req.query,
			isDeleted: true,
		};
		const paymentData = await paymentService.findAllQuery(payload);
		return res.status(SUCCESS).json({
			success: true,
			message: PAYMENT.GET_SUCCESS,
			data: paymentData,
			lastTenDayRecord,
		});
	} catch (error) {
		return res.status(FAILED).json({
			status: false,
			error: error.message || FAILED_RESPONSE,
		});
	}
};
export default { addPayment, failedPayment, getPayment };
