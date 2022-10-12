import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import ApiError from '../exceptions/ApiError.js'
import {UserModel} from '../models/User.js'
import UserService from '../services/UserService.js'

class UserController {
  async register(req, res,next){
    try {
      const {email,password,fullName,avatarUrl} = req.body

      // ======== регестрирую пользователя
      const userData = await UserService.registration(email, password, fullName, avatarUrl)
      // ======== помещаю рефреш токен в куки
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true
      })
      // ======== возвращаю пользователю обьект юзера
      return res.json(userData)
    } catch (e) {
      next(e)
    }
  }
  async login(req, res,next){
    try {
      // ======== беру с запроса почту и пароль
      const {email,password} = req.body
      // ======== логиню юзера
      const userData = await UserService.login(email, password)
      // ======== помещаю рефреш токен в куки
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true
      })
      // ======== возвращаю пользователю обьект юзера
      return res.json(userData)
    } catch (e) {
      next(e)
    }
  }
  async refresh(req, res, next) {
    try {
      //доастем из куки рфреш токен
      const {refreshToken} = req.cookies
      const userData = await UserService.refresh(refreshToken)

      res.cookie('refreshToken',userData.refreshToken,{maxAge: 30 * 24 * 60 * 60 * 1000,httpOnly:true})
      return res.json(userData)
    } catch (e) {
      next(e)
    }
  }

  async logout(req,res) {
    try {
      //из куки вытаскиваем рефреш токен
      const {refreshToken} = req.cookies;
      const token = await UserService.logout(refreshToken)
      //удаляем куку с рефреш токеном
      res.clearCookie('refreshToken')
      //возвращаем ответ на клиент
      return res.json(token)
    } catch (e) {
      next(e)
    }
  }
}

export default new UserController()
