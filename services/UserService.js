import bcrypt from 'bcrypt'
import ApiError from "../exceptions/ApiError.js"
import {UserModel} from "../models/User.js"
import { UserDto } from '../dtos/UserDto.js'
import TokenService from './TokenService.js'

class UserService {
  async registration(email, password, fullName, avatarUrl) {
    const isFind = await UserModel.findOne({email})
    
    if (isFind) {
      throw ApiError.BadRequest(`Пользователь с такой почтой уже зарегестрирован`)
    }
    const hashPassword = await bcrypt.hash(password, 3)

    const user = await UserModel.create({
      email,
      fullName: fullName,
      password: hashPassword,
      avatarUrl: avatarUrl
    })

    const userDto = new UserDto(user)
    // ======== генерю токены
    const tokens = TokenService.generateTokens({...userDto})
    // ======== сохраняю токен
    await TokenService.saveToken(userDto.id, tokens.refreshToken)

    return {
      ...tokens,
      ...userDto
    }
  }

  async login(email,password){
    // ======== проверяю есть ли пользователь с такой почтой которую ввел человек
    const user = await UserModel.findOne({email})
    // ======== если такого пользователя нет, вывожу ошибку
    if (!user) {
      throw ApiError.BadRequest('Неверная почта')
    }
    // ======== сравнивую пароль который ввел человек с паролем который сохранен в бд
    const passEq = await bcrypt.compare(password, user.password)
    // ======== если пароль не совподает вывожу ошибку
    if (!passEq){
      throw ApiError.BadRequest('Неверный пароль')
    }

    const userDto = new UserDto(user)
    // ======== генерю токены
    const tokens = TokenService.generateTokens({...userDto})
    // ======== сохраняю токен
    await TokenService.saveToken(userDto.id, tokens.refreshToken)

    return {
      ...tokens,
      ...userDto
    }
  }

  async refresh(refreshToken) {
    if (!refreshToken){
      throw ApiError.UnathorizedError()
    }
    //после валидации нам необходимо проверить находится ли этот токен в базе данных
    const userData = TokenService.validateRefreshToken(refreshToken)

    const tokenFromDb = await TokenService.fidnToken(refreshToken)
    //делаем проверку что валидации и пойск в базе данных у нас прошли
    if (!userData || !tokenFromDb){
      throw ApiError.UnathorizedError()
    }
    const user = await UserModel.findById(userData.id)
    const userDto = new UserDto(user);
    //генерируем токены
    const tokens = TokenService.generateTokens({...userDto})
    //рефреш токен необходимо сохрнить в бд
    await TokenService.saveToken(userDto.id, tokens.refreshToken)

    return {
      ...tokens,
      ...userDto
    }
  }

  async logout(refreshToken) {
    //нужно удалить рефрештокен из базы данных
    const token = await TokenService.removeToken(refreshToken)
    return token
  }
}

export default new UserService()