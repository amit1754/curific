import { Schema, model, Types } from 'mongoose';
const appointment = new Schema(
	{
		date: {
			type: Date,
			required: true,
		},

		patientId: {
			type: Types.ObjectId,
			required: true,
			ref: 'customer_details',
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		drId: {
			type: Types.ObjectId,
			ref: 'dr_details',
			default: null,
		},
		timeSlotId: {
			type: Types.ObjectId,
			ref: 'timeSlotALL',
		},
		consultModel: {
			type: String,
			enum: ['VIDEO', 'CHAT'],
			default: 'VIDEO',
		},
		prescription: {
			type: String,
			default: null,
		},
		notes: {
			type: String,
			default: null,
		},
		isSchedule: {
			type: Boolean,
			default: false,
		},
		scheduleAppointmentID: {
			type: Types.ObjectId,
			ref: 'scheduleAppointment',
			default: null,
		},
		type: {
			type: String,
			enum: ['NEWCASE', 'TREATMENTCASE', 'REASSESSMENTCASE'],
			default: 'NEWCASE',
		},
		deletedAt: {
			type: Date,
			default: null,
		},
		deletedBy: {
			type: Types.ObjectId,
			default: null,
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true },
);

module.exports = new model('appointment', appointment);
