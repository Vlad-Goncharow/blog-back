import ApiError from '../exceptions/ApiError.js'
//мидвейр для обработки ошибок первым параметром принимает саму ошибку
export default function(err,req,res,next){
  if(err instanceof ApiError){
    return res.status(err.status).json({message:err.message,errors:err.errors})
  }

  return res.status(500).json({message:'Непредвиденная ошибка'})
}