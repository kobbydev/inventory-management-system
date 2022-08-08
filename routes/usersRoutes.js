import { Router } from 'express';
import {
	validateUser,
	checkForUser,
	validateUserSignin,
} from '../middleware/users.js';
import { addUser, getUser, LoginUser } from '../controllers/users.js';

const router = Router();

router.post('/users/signup', validateUser, addUser);
// router.post("/users/auth/signin", validateUserSignin, getUser);
router.post('/users/signin', validateUserSignin, LoginUser);
router.get('/user/:userId', checkForUser, getUser);

export default router;
