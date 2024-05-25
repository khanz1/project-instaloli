const { GraphQLError } = require("graphql");
const { verifyToken } = require("../helpers/jwt");
const { User } = require("../db/models");
const { ObjectId } = require("mongodb");

const authentication = async (req) => {
  const bearerToken = req.headers.authorization;
  if (!bearerToken) {
    throw new GraphQLError("Unauthorized", {
      extensions: {
        code: "UNAUTHENTICATED",
        http: { status: 401 },
      },
    });
  }

  const [type, token] = bearerToken.split(" ");
  if (type !== "Bearer" || !token) {
    throw new GraphQLError("Unauthorized", {
      extensions: {
        code: "UNAUTHENTICATED",
        http: { status: 401 },
      },
    });
  }

  const data = verifyToken(token);

  if (!data) {
    throw new GraphQLError("Unauthorized", {
      extensions: {
        code: "UNAUTHENTICATED",
        http: { status: 401 },
      },
    });
  }

  const _userId = ObjectId.createFromHexString(data.userId);

  const user = await User.findById(_userId);

  if (!user) {
    throw new GraphQLError("Unauthorized", {
      extensions: {
        code: "UNAUTHENTICATED",
        http: { status: 401 },
      },
    });
  }

  return user;
};

module.exports = authentication;