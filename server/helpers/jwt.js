const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");

module.exports = {
  signToken: (data) => {
    return jwt.sign(data, process.env.JWT_SECRET);
  },
  verifyToken: (token) => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw new GraphQLError("Unauthorized", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 },
        },
      });
    }
  },
};
