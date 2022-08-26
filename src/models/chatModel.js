import { Schema, model, Types } from 'mongoose';

const chatRoomModel = new Schema(
	{
		drId: {
			type: Types.ObjectId,
			ref: 'dr_details',
		},
		patientId: {
			type: Types.ObjectId,
			ref: 'customer_details',
		},
		appointmentID: {
			type: Types.ObjectId,
			ref: 'appointment',
		},
		chatContent: [
			{
				content: {
					type: String,
				},
				senderId: {
					type: Types.ObjectId,
				},
				isRead: {
					type: Boolean,
					default: false,
				},
			},
		],
	},
	{ timestamps: true },
);

module.exports = new model('chatRoom', chatRoomModel);
