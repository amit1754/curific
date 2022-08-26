import { Schema, model, Types } from 'mongoose';

const SubscriptionModel = new Schema(
	{
		packageId: {
			type: Types.ObjectId,
			ref: 'subscriptionPackages',
		},
		dateOfPurchase: {
			type: Date,
		},
		startDate: {
			type: Date,
		},
		endDate: {
			type: Date,
		},
		patientId: {
			type: Types.ObjectId,
			ref: 'customer_details',
		},
		paymentId: {
			type: Types.ObjectId,
			ref: 'paymentDetails',
		},
		type: {
			type: String,
			enum: ['MONTHLY', 'YEARLY'],
		},
		deletedAt: {
			type: Date,
			default: null,
		},
		deletedBy: {
			type: Types.ObjectId,
			default: null,
		},
	},
	{ timestamps: true },
);

module.exports = new model('userSubscriptions', SubscriptionModel);
