const typeDefs = `#graphql
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

  type ResponseMessage {
    message: String!
  }
  type ResponseMessageWithData {
    message: String!
    data: Post
  }
  type Query {
    posts: [Post]
    getPostById(_id: ID!): Post
  }

  type Mutation {
    createPost(content: String!, tags: [String], imgUrl: String): ResponseMessageWithData
    createComment(postId: ID!, content: String!): ResponseMessageWithData
    likePost(postId: ID!): ResponseMessage
  }
`;

module.exports = typeDefs;
