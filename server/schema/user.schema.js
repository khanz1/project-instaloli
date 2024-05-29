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
    user: UserWithoutPassword
  }

  type UserWithFollowers {
    _id: ID
    name: String
    username: String
    email: String
    followers: [Follower]
    followings: [Follower]
  }


  type Comment {
    content: String
    username: String
    createdAt: String
    updatedAt: String
  }

  type Like {
    username: String
    createdAt: String
    updatedAt: String
  }

  type Post {
    _id: ID
    content: String
    tags: [String]
    imgUrl: String
    authorId: String
    comments: [Comment]
    likes: [Like]
    createdAt: String
    updatedAt: String
    author: UserWithoutPassword
  }

  type UserProfile {
    _id: ID
    name: String
    username: String
    email: String
    followers: [Follower]
    followings: [Follower]
    posts: [Post]
  }

  type Follower {
    _id: ID
    followerId: String
    followingId: String
    createdAt: String
    updatedAt: String
    user: UserWithoutPassword
  }

  type UserWithStatistics {
    _id: ID
    name: String
    username: String
    email: String
    isFollowing: Boolean
    isFollower: Boolean
  }
  
  type Query {
    getUserById(_id: String!): UserProfile
    searchUser(q: String!): [UserWithStatistics]
  }

  type Mutation {
    register(name: String!, username: String!, email: String!, password: String!): UserWithoutPassword
    login(username: String!, password: String!): ResponseLogin
  }
`;

module.exports = typeDefs;
