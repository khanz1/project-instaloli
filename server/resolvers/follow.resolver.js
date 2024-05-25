const Joi = require("joi");
const { Follow } = require("../models");

const resolvers = {
  Query: {
    follows: async () => {
      return await Follow.findAll();
    },
  },
  Mutation: {
    followUser: async (_, args, contextValue) => {
      const user = await contextValue.authentication();

      const result = Joi.object({
        followingId: Joi.string().required(),
      }).validate(args);

      if (result.error) {
        throw new GraphQLError(result.details[0].message);
      }

      const follow = await Follow.findOne({
        followingId,
        followerId: user._id,
      });

      if (follow) {
        throw new GraphQLError("You already follow this user", {
          code: "BAD_REQUEST",
        });
      }

      const data = await Follow.insertOne({ followingId, followerId });

      return await Follow.findById(data.insertedId);
    },
  },
};

module.exports = resolvers;
