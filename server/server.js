const { ApolloServer } = require("@apollo/server");
const { userTypeDefs, postTypeDefs } = require("./schema");
const { userResolver, postResolver } = require("./resolvers");
const authentication = require("./middlewares/authentication");

module.exports = {
  server: new ApolloServer({
    typeDefs: [userTypeDefs, postTypeDefs],
    resolvers: [userResolver, postResolver],
    introspection: true,
    formatError: (err) => {
      console.log(err, "<< err");
      if (err.extensions.code === "UNAUTHENTICATED") {
        return {
          message: err.message,
          code: err.extensions.code,
        };
      }
      return err;
    },
  }),
  serverOptions: {
    listen: { port: process.env.PORT || 3001 },
    context: ({ req }) => ({
      authentication: authentication.bind(null, req),
    }),
  },
};