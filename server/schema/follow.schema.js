const typeDefs = `#graphql
  type Follow {
    _id: ID
    followingId: ID
    followerId: ID
    createdAt: String
    updatedAt: String
  }

  type Query {
    follows: [Follow]
  }

  type Mutation {
    followUser(followingId: ID!): Follow
  }
`;

module.exports = typeDefs;
