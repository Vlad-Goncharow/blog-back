import mongoose from 'mongoose'
const {Schema,model} = mongoose

//схема описывае какие поля будет содержать сущьность польщователя
const TokenSchema = new Schema({
  //ref ссылается на можедь юзера нужно для objectId
  user:{type:Schema.Types.ObjectId,ref:'User'},
  refreshToken:{type:String,required:true},
})

export const TokenModel = model('Token', TokenSchema)