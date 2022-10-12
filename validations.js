import {body} from 'express-validator'

export const registerValidation = [
  body('email','Неверный формат почты').isEmail(),
  body('password','Пароль должен быть минимум 5 символов').isLength({min:5}),
  body('fullName','Имя должено быть минимум 3 символов').isLength({min:3}),
  body('avatarUrl','Неверная ссылка на аватарку').optional().isURL(),
]

export const postCreateValidation = [
  body('title','Неверный заголовок статьи').isLength({min:5}),
  body('text','Введите текст статьи').isLength({min:5}).isString(),
  body('tags','Неверный формать тегов, укажите массив').optional().isArray(),
  body('imageUrl','Неверная ссылка на изображение').optional().isString(),
]