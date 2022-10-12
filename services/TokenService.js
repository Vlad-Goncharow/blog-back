import jwt from 'jsonwebtoken'
import { TokenModel } from '../models/Token.js'
import dotenv from 'dotenv'
dotenv.config()

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.SECRET_ACCESS,{expiresIn:'30m'})
    const refreshToken = jwt.sign(payload, process.env.SECRET_REFRESH, {expiresIn:'30d'})

    return{
      accessToken,
      refreshToken
    }
  }
  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.SECRET_REFRESH)
      return userData
    } catch (e) {
      return null
    }
  }
  async saveToken(userId, refreshToken) {
    const tokenData = await TokenModel.findOne({user:userId})

    if (tokenData) {
      tokenData.refreshToken = refreshToken
      return tokenData.save()
    }

    const token = await TokenModel.create({
      user:userId,
      refreshToken
    })

    return token
  }
  async fidnToken(refreshToken) {
    const tokenData = await TokenModel.findOne({refreshToken})
    return tokenData
  }
  async removeToken(refreshToken) {
    const tokenData = await TokenModel.deleteOne({refreshToken})
    return tokenData
  }
}

export default new TokenService()