require("dotenv").config();

const { createMongoDBConnection, client } = require("../mongodb");
const users = require("../../data/users.json");
const { hashPassword } = require("../../helpers/bcrypt");
const sleep = require("../../helpers/sleep");

const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

const seed = async () => {
  try {
    await createMongoDBConnection();
    const db = client.db(MONGODB_DB_NAME);

    // seeding user
    const collectionUser = db.collection("users");
    await collectionUser.drop();

    users.forEach((user) => {
      user.password = hashPassword(user.password);
      user.createdAt = new Date();
    });

    await collectionUser.insertMany(users);
    await collectionUser.createIndex({ email: 1 }, { unique: true });
    await collectionUser.createIndex({ username: 1 }, { unique: true });

    const insertedUsers = await collectionUser.find().toArray();
    console.log("Users seeded successfully");

    // seeding post
    const posts = require("../../data/posts.json");
    const postCollection = db.collection("posts");
    await postCollection.drop();

    const newPosts = [];
    for (const post of posts) {
      // wait 500ms
      // await sleep(500);
      const totalAuthor = insertedUsers.length;
      // randomize author
      const randomizeIndexAuthor = Math.floor(Math.random() * totalAuthor);
      post.authorId = insertedUsers[randomizeIndexAuthor]._id;

      post.comments.forEach((comment) => {
        // randomize comment but not same as author
        let randomizeIndexComment = Math.floor(Math.random() * totalAuthor);
        while (randomizeIndexComment === randomizeIndexAuthor) {
          randomizeIndexComment = Math.floor(Math.random() * totalAuthor);
        }
        comment.username = insertedUsers[randomizeIndexComment].username;
        comment.createdAt = new Date();
        comment.updatedAt = new Date();
      });

      post.likes.forEach((like) => {
        // randomize like but not same as author
        let randomizeIndexLike = Math.floor(Math.random() * totalAuthor);

        like.username = insertedUsers[randomizeIndexLike].username;
        like.createdAt = new Date();
        like.updatedAt = new Date();
      });

      const createdAt = new Date();
      const randomDays = Math.floor(Math.random() * 30);
      createdAt.setDate(createdAt.getDate() - randomDays);

      post.createdAt = createdAt;
      post.updatedAt = new Date();
      newPosts.push(post);
    }

    await postCollection.insertMany(newPosts);
    console.log("Posts seeded successfully");

    // seeding follow
    const followCollection = db.collection("follows");
    await followCollection.drop();

    await followCollection.insertMany([
      {
        followerId: insertedUsers[0]._id,
        followingId: insertedUsers[2]._id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        followerId: insertedUsers[1]._id,
        followingId: insertedUsers[2]._id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        followerId: insertedUsers[1]._id,
        followingId: insertedUsers[0]._id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    console.log("Follows seeded successfully");
  } finally {
    await client.close();
  }
};

seed();
