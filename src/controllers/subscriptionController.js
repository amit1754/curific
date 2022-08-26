import { subscriptionModel } from '../models';
import {
	CustomerService,
	paymentService,
	userSubscriptionService,
} from '../mongoServices';
import { CONSTANTS } from '../constants';
import { errorLogger } from '../utils';
import moment from 'moment';

const {
	RESPONSE_MESSAGE: { FAILED_RESPONSE, SUBSCRIPTION, PAYMENT },
	STATUS_CODE: { SUCCESS, FAILED },
} = CONSTANTS;
const createSubscription = async (req, res) => {
	try {
		const { currentUser } = req;

		if (!currentUser) {
			throw new Error('User is not available');
		} else {
			let paymentData = await paymentService.findAllQuery({
				_id: req.body.paymentId,
			});
			if (paymentData) {
				const endDate = moment().add(req.body.type, 'months');

				let payload = {
					packageId: req.body.packageId,
					dateOfPurchase: new Date(),
					startDate: new Date(),
					endDate: endDate.toISOString(),
					patientId: currentUser._id,
					paymentId: req.body.paymentId,
					type: req.body.type === 1 ? 'MONTHLY' : 'YEARLY',
				};
				const subscriptionData = new subscriptionModel(payload).save();
				if (subscriptionData) {
					let filter = { _id: req.body.patientId };
					let update = { $set: { subscriptionId: subscriptionData._id } };
					await CustomerService.updateOneQuery(filter, update);
					return res.status(SUCCESS).json({
						success: true,
						message: SUBSCRIPTION.CREATE_SUCCESS,
						data: [],
					});
				} else {
					throw new Error(SUBSCRIPTION.CREATE_FAILED);
				}
			} else {
				throw new Error(PAYMENT.PAYMENTNOTFOUND);
			}
		}
	} catch (err) {
		errorLogger(err.message, req.originalUrl, req.ip);
		return res.status(FAILED).send({
			error: err.message || FAILED_RESPONSE,
			success: false,
		});
	}
};
const getSubscription = async (req, res) => {
	try {
		const payload = {
			...req.query,
			populate: true,
		};
		const { data, totalCount } = await userSubscriptionService.findAllQuery(
			payload,
		);
		return res.status(SUCCESS).json({
			success: true,
			message: SUBSCRIPTION.GET_SUCCESS,
			data,
			totalCount,
		});
	} catch (err) {
		errorLogger(err.message, req.originalUrl, req.ip);
		return res.status(FAILED).send({
			error: err.message || FAILED_RESPONSE,
			success: false,
		});
	}
};

export default { createSubscription, getSubscription };
