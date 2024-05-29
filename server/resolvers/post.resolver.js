const Joi = require("joi");
const { Post } = require("../db/models");
const { ObjectId } = require("mongodb");
const { GraphQLError } = require("graphql");
const redis = require("../db/redis");
const { RK } = require("../constants/redis-keys");

const resolvers = {
  Query: {
    posts: async (_, _args, contextValue) => {
      await contextValue.authentication();

      const cache = await redis.get(RK.GET_POSTS());

      // if (cache) {
      //   return JSON.parse(cache);
      // }

      const data = await Post.findAllSortedWithAuthor();

      await redis.set(RK.GET_POSTS(), JSON.stringify(data));
      return data;
    },
    getPostById: async (_, { _id }, contextValue) => {
      await contextValue.authentication();
      return await Post.findByIdWithAuthor(_id);
    },
  },
  Mutation: {
    createPost: async (_, args, contextValue) => {
      const user = await contextValue.authentication();

      const result = Joi.object({
        content: Joi.string().required(),
        tags: Joi.array().items(Joi.string()),
        imgUrl: Joi.string(),
        authorId: Joi.string().required(),
      }).validate({
        ...args,
        authorId: user._id,
      });

      result.value.createdAt = new Date();
      result.value.updatedAt = new Date();
      result.value.likes = [];
      result.value.comments = [];

      const data = await Post.insertOne(result.value);
      const post = await Post.findById(data.insertedId);

      await redis.del(RK.GET_POSTS());

      return {
        message: "Post created successfully",
        data: post,
      };
    },
    createComment: async (_, args, contextValue) => {
      const user = await contextValue.authentication();

      const result = Joi.object({
        postId: Joi.string().required(),
        content: Joi.string().required(),
      }).validate(args);

      if (result.error) {
        throw new GraphQLError(result.details[0].message);
      }
      const _postId = ObjectId.createFromHexString(result.value.postId);
      const post = await Post.findById(_postId);

      if (!post) {
        throw new GraphQLError("Post not found", {
          code: "BAD_REQUEST",
        });
      }

      post.comments.push({
        content: result.value.content,
        username: user.username,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      await Post.updateOne({ _id: _postId }, post);
      await redis.del(RK.GET_POSTS());
      return {
        message: "Comment created successfully",
        data: post,
      };
    },
    likePost: async (_, args, contextValue) => {
      const user = await contextValue.authentication();

      const result = Joi.object({
        postId: Joi.string().required(),
      }).validate(args);

      if (result.error) {
        throw new GraphQLError(result.details[0].message);
      }

      const _postId = ObjectId.createFromHexString(result.value.postId);
      const post = await Post.findById(_postId);

      if (!post) {
        throw new GraphQLError("Post not found", {
          code: "BAD_REQUEST",
        });
      }

      const like = post.likes.find((like) => like.username === user.username);

      if (like) {
        throw new GraphQLError("You already like this post", {
          code: "BAD_REQUEST",
        });
      }

      post.likes.push({
        username: user.username,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      await Post.updateOne({ _id: _postId }, post);
      await redis.del(RK.GET_POSTS());
      return {
        message: "Post liked successfully",
      };
    },
  },
};

module.exports = resolvers;
