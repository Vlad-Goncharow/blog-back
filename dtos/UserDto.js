export class UserDto{
  constructor(user){
    this.email = user.email
    this.id = user._id
    this.fullName = user.fullName
    this.avatarUrl = user.avatarUrl
  }
}