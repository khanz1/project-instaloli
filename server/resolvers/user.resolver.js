const Joi = require("joi");
const { User } = require("../db/models");
const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { GraphQLError } = require("graphql");

const resolvers = {
  Query: {
    searchUser: async (_, { q }, context) => {
      await context.authentication();
      return await User.search(q);
    },
    getUserById: async (_, { _id }, context) => {
      await context.authentication();
      return await User.findByIdWithFollowersAndFollowing(_id);
    },
  },
  Mutation: {
    register: async (_, args) => {
      const result = Joi.object({
        name: Joi.string().required(),
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(5).required(),
      }).validate(args);

      if (result.error) {
        throw new GraphQLError(result.details[0].message);
      }

      try {
        const data = await User.insertOne(result.value);
        return await User.findById(data.insertedId);
      } catch (err) {
        if (err.name === "MongoServerError") {
          if (err.code === 11000) {
            throw new GraphQLError("Email already exists", {
              extensions: {
                code: "BAD_REQUEST",
              },
            });
          }
        }

        throw new GraphQLError("Internal server error", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
          },
        });
      }
    },
    login: async (_, args) => {
      const result = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().min(5).required(),
      }).validate(args);

      if (result.error) {
        throw new Error(result.error.details[0].message);
      }

      const user = await User.findOne({ username: result.value.username });
      if (!user) {
        throw new GraphQLError("Invalid username/password", {
          extensions: {
            code: "BAD_REQUEST",
          },
        });
      }

      if (!comparePassword(result.value.password, user.password)) {
        throw new GraphQLError("Invalid email/password", {
          extensions: {
            code: "BAD_REQUEST",
          },
        });
      }

      const token = signToken({ userId: user._id });
      return { access_token: token, message: "Login success" };
    },
  },
};

module.exports = resolvers;
