const { hashPassword } = require("../../helpers/bcrypt");
const { client } = require("../mongodb");
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;
const { ObjectId } = require("mongodb");

class User {
  collection;
  constructor() {
    this.collection = client.db(MONGODB_DB_NAME).collection("users");
  }

  async findAll() {
    return await this.collection.find().toArray();
  }

  async findByIdWithFollowers(id) {
    let _id = id;
    if (!(id instanceof ObjectId)) {
      _id = ObjectId.createFromHexString(id);
    }

    return await this.collection
      .aggregate([
        {
          $match: {
            _id,
          },
        },
        {
          $lookup: {
            from: "follows",
            localField: "_id",
            foreignField: "followingId",
            as: "followers",
            pipeline: [
              {
                $lookup: {
                  from: "users",
                  localField: "followerId",
                  foreignField: "_id",
                  as: "user",
                },
              },
              {
                $unwind: "$user",
              },
              {
                $project: {
                  "user.password": 0,
                },
              },
            ],
          },
        },
      ])
      .toArray();
  }

  async findProfileById(id) {
    let _id = id;
    if (!(id instanceof ObjectId)) {
      _id = ObjectId.createFromHexString(id);
    }
    const [profile] = await this.collection
      .aggregate([
        {
          $match: {
            _id,
          },
        },
        {
          $lookup: {
            from: "follows",
            localField: "_id",
            foreignField: "followingId",
            as: "followers",
            pipeline: [
              {
                $lookup: {
                  from: "users",
                  localField: "followerId",
                  foreignField: "_id",
                  as: "user",
                },
              },
              {
                $unwind: "$user",
              },
              {
                $project: {
                  "user.password": 0,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "follows",
            localField: "_id",
            foreignField: "followerId",
            as: "followings",
            pipeline: [
              {
                $lookup: {
                  from: "users",
                  localField: "followingId",
                  foreignField: "_id",
                  as: "user",
                },
              },
              {
                $unwind: "$user",
              },
              {
                $project: {
                  "user.password": 0,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "posts",
            localField: "_id",
            foreignField: "authorId",
            as: "posts",
          },
        },
      ])
      .toArray();

    return profile;
  }

  async findByIdWithFollowersAndFollowing(id) {
    let _id = id;
    if (!(id instanceof ObjectId)) {
      _id = ObjectId.createFromHexString(id);
    }

    return await this.collection
      .aggregate([
        {
          $match: {
            _id,
          },
        },
        {
          $lookup: {
            from: "follows",
            localField: "_id",
            foreignField: "followingId",
            as: "followers",
            pipeline: [
              {
                $lookup: {
                  from: "users",
                  localField: "followerId",
                  foreignField: "_id",
                  as: "user",
                },
              },
              {
                $unwind: "$user",
              },
              {
                $project: {
                  "user.password": 0,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "follows",
            localField: "_id",
            foreignField: "followerId",
            as: "followings",
            pipeline: [
              {
                $lookup: {
                  from: "users",
                  localField: "followingId",
                  foreignField: "_id",
                  as: "user",
                },
              },
              {
                $unwind: "$user",
              },
              {
                $project: {
                  "user.password": 0,
                },
              },
            ],
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

  async findOne(filter) {
    return await this.collection.findOne(filter);
  }

  async insertOne(data) {
    data.password = hashPassword(data.password);
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

  async search(q) {
    return await this.collection
      .aggregate([
        {
          $match: {
            $or: [
              {
                username: {
                  $regex: q,
                  $options: "i",
                },
              },
              {
                name: {
                  $regex: q,
                  $options: "i",
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "follows",
            localField: "_id",
            foreignField: "followerId",
            as: "followingInfo",
          },
        },
        {
          $lookup: {
            from: "follows",
            localField: "_id",
            foreignField: "followingId",
            as: "followerInfo",
          },
        },
        {
          $addFields: {
            isFollower: {
              $cond: {
                if: {
                  $gt: [
                    {
                      $size: "$followerInfo",
                    },
                    0,
                  ],
                },
                then: true,
                else: false,
              },
            },
            isFollowing: {
              $cond: {
                if: {
                  $gt: [
                    {
                      $size: "$followingInfo",
                    },
                    0,
                  ],
                },
                then: true,
                else: false,
              },
            },
          },
        },
        {
          $project: {
            followerInfo: 0,
            followingInfo: 0,
          },
        },
      ])
      .toArray();
  }
}

module.exports = new User();

// khanz -> 6651fa9c3767bcd491b2e06b
// xavier -> 6651fa9c3767bcd491b2e069
