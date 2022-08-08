import Products from '../models/Products.js';
import Users from '../models/Users.js';
import { responseHandler } from '../services/response.js';

export const getAllProducts = async (req, res) => {
	try {
		const products = await Products.find();
		// return res.status(200).send({
		// 	message: 'Products fetched successfully',
		// 	data: products,
		// });
		return responseHandler(res, 'Products found successfully', 200, products);
	} catch (error) {
		return responseHandler(res, 'Cannot find products', 400, error);
	}
};

export const getSingleProduct = (req, res) => {
	try {
		// res.status(200).send({
		// 	message: 'Product fetched successfully',
		// 	data: req.product,
		// });
		return responseHandler(
			res,
			'Products fetched successfully',
			200,
			req.product
		);
	} catch (error) {
		return responseHandler(res, 'Could not find product', 400, error);
	}
};

export const addProduct = async (req, res) => {
	try {
		const userId = req.params.userID;
		//   console.log(req.params.userID)
		//   const userId = "62e93593bfdf8ddd1d95407c";
		const user = await Users.findById(userId);
		const { name, quantity, price, status, category } = req.body;
		const product = await Products.create({
			name,
			quantity,
			price,
			status,
			category,
		});
		const addedProduct = await Users.updateOne(
			{ _id: user._id },
			{ $push: { products: { productId: req.id, ...product } } }
		);
		// return res.status(201).send({
		// 	message: 'Product was successfully created',
		// 	data: addedProduct,
		// });
		return responseHandler(
			res,
			'Product was successfully created',
			201,
			addedProduct
		);
	} catch (error) {
		return responseHandler(res, 'Product was not created', 400, error);
	}
};

export const getProductByName = async (req, res) => {
	try {
		// res.status(200).send({
		// 	message: 'Product fetched successfully',
		// 	data: req.product,
		// });
		return responseHandler(
			res,
			'Product fetched successfully',
			200,
			req.product
		);
	} catch (error) {
		return responseHandler(res, 'Could not find product', 400, error);
	}
};

export const updateProduct = async (req, res) => {
	try {
		// console.log(req.body);
		const { name, quantity, price, status, category } = req.body;
		const updatedProduct = await Products.findByIdAndUpdate(
			req.params.id,
			{ name, quantity, price, status, category }
			// req.body
			// { strict: false }
		);
		// console.log(updatedProduct);
		// return res.status(200).send({
		// 	message: 'User updated successfully',
		// 	data: updatedProduct,
		// });
		return responseHandler(
			res,
			'User updated successfully',
			200,
			updateProduct
		);
		// const { product } = req;
		// const { name, quantity, price, status, category } = req.body;
	} catch (error) {
		return responseHandler(res, 'Product was not updated', 400, error);
	}
};

export const deleteProduct = async (req, res) => {
	try {
		const deletedProduct = await Products.findByIdAndDelete(req.params.id);
		return responseHandler(
			res,
			'Product deleted successfully',
			200,
			deletedProduct
		);
	} catch (error) {
		return responseHandler(
			res,
			'Product was not deleted. SOmething went wrong',
			400,
			error
		);
	}
};
