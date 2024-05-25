const { hashPassword } = require("../../helpers/bcrypt");
const { client } = require("../mongodb");
const { ObjectId } = require("mongodb");
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

class Post {
  collection;
  constructor() {
    this.collection = client.db(MONGODB_DB_NAME).collection("posts");
  }

  async findAll() {
    return await this.collection.find().toArray();
  }

  async findAllSortedWithAuthor() {
    return await this.collection
      .aggregate([
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "authorId",
            foreignField: "_id",
            as: "author",
          },
        },
        {
          $unwind: {
            path: "$author",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            authorId: 0,
            "author.password": 0,
          },
        },
      ])
      .toArray();
  }

  async findById(id) {
    let _id = id;
    if (!(id instanceof ObjectId)) {
      _id = ObjectId.createFromHexString(id);
    }

    return await this.collection.findOne({ _id });
  }

  async findByIdWithAuthor(id) {
    let _id = id;
    if (!(id instanceof ObjectId)) {
      _id = ObjectId.createFromHexString(id);
    }

    const result = await this.collection
      .aggregate([
        {
          $match: {
            _id,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "authorId",
            foreignField: "_id",
            as: "author",
          },
        },
        {
          $unwind: {
            path: "$author",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            authorId: 0,
            "author.password": 0,
          },
        },
      ])
      .toArray();
    
    return result.length ? result[0] : null;
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

module.exports = new Post();
