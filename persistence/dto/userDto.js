export default class UsersDTO {
    constructor(user) {
      this.id = user.id;
      this.nombre = `${user.nombre} ${user.age}`;
      this.direccion = user.direccion;
    }
  }
  