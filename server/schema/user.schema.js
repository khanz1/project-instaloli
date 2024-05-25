const typeDefs = `#graphql
  type User {
    _id: ID
    name: String
    username: String
    email: String
    password: String
  }

  type UserWithoutPassword {
    _id: ID
    name: String
    username: String
    email: String
  }

  type ResponseMessage {
    message: String!
  }

  type ResponseLogin {
    access_token: String!
    message: String!
  }

  type UserWithFollowers {
    _id: ID
    name: String
    username: String
    email: String
    followers: [Follower]
    followings: [Follower]
  }

  type Follower {
    _id: ID
    followerId: String
    followingId: String
    createdAt: String
    updatedAt: String
    user: UserWithoutPassword
  }
  
  type Query {
    getUserById(_id: String!): [UserWithFollowers]
    searchUser(q: String!): [UserWithoutPassword]
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): UserWithoutPassword
    login(username: String!, password: String!): ResponseLogin
  }
`;

module.exports = typeDefs;
