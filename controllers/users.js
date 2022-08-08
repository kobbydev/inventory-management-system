import Users from '../models/Users.js';
import jwt from 'jsonwebtoken';
import { generatePassword } from '../services/auth.js';
import { responseHandler } from '../services/response.js';

export const addUser = async (req, res) => {
	try {
		const { fullName, email, shopName, password } = req.body;
		const { salt, hash } = await generatePassword(password);
		const user = await Users.create({
			fullName,
			email,
			shopName,
			salt,
			password: hash,
			products: [],
		});
		return responseHandler(
			res,
			`${fullName} your account was created successfully`,
			201,
			user
		);
	} catch (error) {
		return responseHandler(res, 'Cannot create user', 400, error);
	}
};

export const getUser = (req, res) => {
	try {
		// res.status(200).send({
		// 	message: 'User found successfully',
		// 	data: req.user,
		// });
		return responseHandler(res, 'User found successfully', 200, req.user);
	} catch (error) {
		return responseHandler(res, 'Could not find User', 400, error);
	}
};
export const LoginUser = async (req, res) => {
	try {
		const { _id, fullName, email, shopName } = req.user;
		const token = await jwt.sign(
			{ _id, fullName, email, shopName },
			process.env.JWT_SECRET,
			{ expiresIn: '1hr' }
		);
		res
			.header('X-auth-token', token)
			.status(200)
			.send({
				message: 'User login successfull',
				data: { user: req.user, token },
			});
	} catch (error) {
		return responseHandler(res, 'Could not log user in', 400, error);
	}
};

export const getUsers = async (req, res) => {
	try {
		const users = await Users.find();
		// return res.status(200).send({
		// 	message: 'Users fetched successfully',
		// 	data: users,
		// });
		return responseHandler(res, 'Users found successfully', 200, users);
	} catch (error) {
		return responseHandler(res, 'Could not find User', 400, error);
	}
};

// export const deleteUser = async (req, res)=>{
//   // const user = await Users.findOne({_id: localStorage.getItem('id')})
//   const deletedUser = await Users.findByIdAndDelete(_id)
// }
