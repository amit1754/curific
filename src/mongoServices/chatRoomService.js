import { chatRoomModel } from '../models';
import { Types } from 'mongoose';
const findAllQuery = async (query) => {
	let { _id, drId, patientId } = query;

	let whereClause = {};

	if (_id) {
		whereClause = { ...whereClause, _id: Types.ObjectId(_id) };
	}
	if (drId) {
		whereClause = { ...whereClause, drId: drId };
	}
	if (patientId) {
		whereClause = { ...whereClause, patientId: patientId };
	}
	console.log('whereClause', whereClause);

	const data = await chatRoomModel
		.findOne(whereClause)
		.populate('patientId')
		.populate('drId')
		.populate('appointmentID');

	return data;
};

const updateOneQuery = async (filter, update, projection) => {
	let options = { new: true, fields: { ...projection } };
	const result = await chatRoomModel.findOneAndUpdate(filter, update, options);
	return result;
};

export default {
	findAllQuery,
	updateOneQuery,
};
