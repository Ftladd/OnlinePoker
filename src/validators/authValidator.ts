import Joi from 'joi';
import { makeValidator } from '../utils/makeValidator';

const newUserSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),

  password: Joi.string().min(5).required(),
});

const validateNewUserBody = makeValidator(newUserSchema, 'body');

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),

  password: Joi.string().required(),
});
const validateLoginBody = makeValidator(loginSchema, 'body');

const createPrivateRoomSchema = Joi.object({
  roomName: Joi.string().trim().alphanum().min(1).max(50).required(),
});

const validateCreatePrivateRoomBody = makeValidator(createPrivateRoomSchema, 'body');

export { validateNewUserBody, validateLoginBody, validateCreatePrivateRoomBody };
