const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');

class UserModel {
  constructor(db) {
    this.collection = db.collection('users');
  }

  async createUser(name, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { name, email, password: hashedPassword };
    await this.collection.insertOne(newUser);
    return newUser;
  }

  async findByEmail(email) {
    return this.collection.findOne({ email });
  }

  async findById(id) {
    return this.collection.findOne({ _id: new ObjectId(id) });
  }
}

module.exports = UserModel;
