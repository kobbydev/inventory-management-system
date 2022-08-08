import { userSignUpSchema, userSignInSchema } from './validation.js';
import Users from '../models/Users.js';
import { comparePassword } from '../services/auth.js';
import jwt from 'jsonwebtoken';
import { responseHandler } from '../services/response.js';

export const validateUser = async (req, res, next) => {
	const { error } = userSignUpSchema.validate(req.body);
	const user = await Users.findOne({ email: req.body.email });
	if (error) {
		return res.status(400).send({
			error,
		});
	}
	if (user) {
		// return res.status(400).send({
		// 	message: 'User with the same email already exist',
		// });
		return responseHandler(
			res,
			'User with the same email already exist',
			400,
			null
		);
	}
	next();
};

export const validateUserSignin = async (req, res, next) => {
	const { error } = userSignInSchema.validate(req.body);
	const user = await Users.findOne({ email: req.body.email });
	const valid = await comparePassword(req.body.password, user.password);
	if (!valid) {
		// return res.status(400).send({
		// 	message: 'Wrong email or password entered',
		// 	data: null,
		// });
		return responseHandler(res, 'Wrong email or passwrod entered', 400, null);
	}
	// if (error) {
	//   return res.status(400).send({
	//     error,
	//   });
	// }
	// if (user) {
	//   if (user.password !== req.body.password) {
	//     return res.status(400).send({
	//       message: "Incorrect Password",
	//     });
	//   }
	// }
	// if (!user) {
	//   return res.status(404).send({
	//     message: "User not found",
	//   });
	// }
	req.user = user;
	next();
};

export const checkForUser = async (req, res, next) => {
	try {
		const user = await Users.findById(req.params.userId);
		if (!user) {
			// return res.status(404).send({
			// 	message: 'User not found',
			// 	data: null,
			// });
			return responseHandler(res, 'User not found', 404, null);
		}
		req.user = user;
		next();
	} catch (error) {
		return responseHandler(
			res,
			'Something went wrong.User not found',
			400,
			error
		);
	}
};

export const validateCompany = (req, res, next) => {
	const { error } = userSignUpSchema.validate(req.body);
	if (error) {
		// return res.status(400).send({
		// 	error,
		// });
		return responseHandler(res, 'error', 403, error);
	}
	next();
};

export const auth = async (req, res, next) => {
	const { token } = req.headers;
	if (!token) {
		// return res.status(400).send({
		// 	message: 'Access denied. No token found',
		// 	data: null,
		// });
		return responseHandler(res, 'Access denied. No token found', 400, null);
	}
	try {
		const decode = jwt.verify(token, process.env.JWT_SECRET);
		next();
	} catch (error) {
		// return res.status(403).send({
		// 	message: 'You cannot access this resource',
		// 	data: null,
		// });
		return responseHandler(res, 'You cannot access this resource', 403, null);
	}
};
