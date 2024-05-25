const { hashPassword } = require("../../helpers/bcrypt");
const { client } = require("../mongodb");
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

class Follow {
  collection;
  constructor() {
    this.collection = client.db(MONGODB_DB_NAME).collection("follows");
  }

  async findAll() {
    return await this.collection.find().toArray();
  }

  async findById(id) {
    return await this.collection.findOne({ _id: id });
  }

  async findOne(filter) {
    return await this.collection.findOne(filter);
  }

  async insertOne(data) {
    return await this.collection.insertOne(data);
  }

  async updateOne(filter, data) {
    return await this.collection.updateOne(filter, {
      $set: data,
    });
  }

  async deleteOne(filter) {
    return await this.collection.deleteOne(filter);
  }
}

module.exports = new Follow();
