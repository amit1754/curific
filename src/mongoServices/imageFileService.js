import { sliderModel } from '../models';
const findAllQuery = async (query) => {
	let { search, _id, limit, page, sortField, sortValue, pagination } = query;
	let sort = {};
	let whereClause = { deletedAt: null };
	if (sortField) {
		sort = {
			[sortField]: sortValue === 'ASC' ? 1 : -1,
		};
	} else {
		sort = {
			displayName: 1,
		};
	}
	if (search) {
		search = new RegExp(search, 'ig');
		whereClause = {
			$or: [{ email: search }, { name: search }, { mobileNumber: search }],
		};
	}
	if (_id) {
		whereClause = { ...whereClause, _id };
	}
	console.log('whereClause', whereClause);
	if (pagination) {
		const data = await sliderModel.find(whereClause).sort(sort);
		return data;
	} else {
		const data = await sliderModel
			.find(whereClause)
			.skip(page > 0 ? +limit * (+page - 1) : 0)
			.limit(+limit || 20)
			.sort(sort);

		const totalCount = await sliderModel.find(whereClause).countDocuments();
		return { data, totalCount };
	}
};

const updateOneQuery = async (filter, update, projection) => {
	let options = { new: true, fields: { ...projection } };

	const data = await sliderModel.findOneAndUpdate(filter, update, options);
	return data;
};

export default {
	findAllQuery,
	updateOneQuery,
};
