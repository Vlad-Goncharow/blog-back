import { validationResult } from "express-validator"
import ApiError from "../exceptions/ApiError.js";

export default (req,res,next) => {
  const errors = validationResult(req)
  console.log(errors);

  if (!errors.isEmpty()) {
    // return res.status(400).json(errors.array())
    return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
  }

  next()
}