import { CONSTANTS } from '../constants';
import { sliderModel } from '../models';
import { sliderService } from '../mongoServices';
const {
	IMAGE_DATA: {
		CREATE_SUCCESS,
		GET_FAILED,
		GET_SUCCESS,
		UPDATE_SUCCESS,
		UPDATE_FAILED,
	},
	RESPONSE_MESSAGE: { FAILED_RESPONSE },
	STATUS_CODE: { SUCCESS, FAILED },
} = CONSTANTS;

const createSliderImages = async (req, res) => {
	try {
		let payload = {
			sliderPath: req.body.sliderPath,
			image: req.body.image,
		};
		let sliderImages = new sliderModel(payload);
		await sliderImages.save();
		return res
			.status(SUCCESS)
			.json({ success: true, msg: CREATE_SUCCESS, data: [] });
	} catch (error) {
		return res.status(FAILED).send({
			success: false,
			msg: error.message || FAILED_RESPONSE,
			data: [],
		});
	}
};

const getSliderImages = async (req, res) => {
	try {
		let { data, totalCount } = await sliderService.findAllQuery(req.query);
		return res
			.status(SUCCESS)
			.json({ success: true, msg: GET_SUCCESS, data, totalCount });
	} catch (error) {
		return res.status(FAILED).send({
			success: false,
			msg: error.message || GET_FAILED,
			data: [],
		});
	}
};
const updateSliderImages = async (req, res) => {
	try {
		const imageId = req.params.id;
		const payload = {
			image: req.body.image,
		};
		await sliderService.updateOneQuery({ _id: imageId }, { ...payload });
		return res
			.status(SUCCESS)
			.json({ success: true, msg: UPDATE_SUCCESS, data: [] });
	} catch (error) {
		return res.status(FAILED).send({
			success: false,
			msg: error.message || FAILED_RESPONSE,
			data: [],
		});
	}
};

export default {
	createSliderImages,
	getSliderImages,
	updateSliderImages,
};
