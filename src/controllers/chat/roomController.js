import {
	drService,
	CustomerService,
	chatRoomService,
} from '../../mongoServices';
import { chatRoomModel } from '../../models';
import { CONSTANTS } from '../../constants';
import { errorLogger } from '../../utils';
const {
	RESPONSE_MESSAGE: { FAILED_RESPONSE, CHATROOM },
	STATUS_CODE: { SUCCESS, FAILED },
} = CONSTANTS;
const createRoom = async (req, res) => {
	try {
		const { drId, patientId, appointmentId } = req.body;
		let filter = { _id: drId };
		let dr = await drService.findAllQuery(filter);
		filter = { _id: patientId };
		let patient = await CustomerService.findAllQuery(filter);
		if (dr.length == 0) {
			throw new Error(CHATROOM.DRNOTFOUND);
		} else if (patient.length == 0) {
			throw new Error(CHATROOM.PATIENTNOTFOUND);
		} else {
			let filterChat = {
				drId: drId,
				patientId: patientId,
				appointmentID: appointmentId,
			};
			let roomId;
			const data = await chatRoomService.findAllQuery(filterChat);
			console.log('data', data);
			if (data === null) {
				let room = {
					drId: drId,
					patientId: patientId,
					appointmentID: appointmentId,
				};
				let chatRoom = await new chatRoomModel(room).save();
				roomId = chatRoom._id;
			} else {
				roomId = data._id;
			}
			return res.status(SUCCESS).send({
				success: true,
				message: CHATROOM.CREATE_SUCCESS,
				roomId: roomId,
			});
		}
	} catch (err) {
		console.log('err', err);
		errorLogger(req, res, err);
		return res.status(FAILED).send({
			success: false,
			message: err.message || FAILED_RESPONSE,
		});
	}
};

const sendMessage = async (req, res) => {
	try {
		const { roomId, content, senderId } = req.body;
		let filter = { _id: roomId };
		let chatRoom = await chatRoomService.findAllQuery(filter);
		if (chatRoom.length == 0) {
			throw new Error(CHATROOM.ROOMNOTFOUND);
		} else {
			let chatRoomUpdate = await chatRoomService.updateOneQuery(
				{ _id: roomId },
				{
					$push: {
						chatContent: {
							content: content,
							senderId: senderId,
						},
					},
				},
			);

			if (chatRoomUpdate) {
				return res.status(SUCCESS).send({
					success: true,
					message: CHATROOM.SEND_SUCCESS,
				});
			} else {
				throw new Error(CHATROOM.SEND_FAILED);
			}
		}
	} catch (err) {
		errorLogger(req, res, err);
		return res.status(FAILED).send({
			success: false,
			message: err.message || FAILED_RESPONSE,
		});
	}
};

const getRoomDetails = async (req, res) => {
	try {
		let data = await chatRoomService.findAllQuery(req.query);
		return res.status(SUCCESS).send({
			success: true,
			message: 'get',
			data,
		});
	} catch (err) {
		errorLogger(req, res, err);
		return res.status(FAILED).send({
			success: false,
			message: err.message || FAILED_RESPONSE,
		});
	}
};

const sendSocketMessage = async (data) => {
	try {
		const { roomId, content, senderId } = data;
		let filter = { _id: roomId };
		let chatRoom = await chatRoomService.findAllQuery(filter);
		if (chatRoom.length == 0) {
			throw new Error(CHATROOM.ROOMNOTFOUND);
		} else {
			let chatRoomUpdate = await chatRoomService.updateOneQuery(
				{ _id: roomId },
				{
					$push: {
						chatContent: {
							content: content,
							senderId: senderId,
						},
					},
				},
			);

			return chatRoomUpdate;
		}
	} catch (err) {
		return false;
	}
};

export default { createRoom, sendMessage, getRoomDetails, sendSocketMessage };
