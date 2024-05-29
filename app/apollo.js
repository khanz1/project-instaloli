import {
  ApolloClient,
  InMemoryCache,
  gql,
  createHttpLink,
} from "@apollo/client";
import * as SecureStore from "expo-secure-store";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "https://5fde-93-185-162-18.ngrok-free.app/",
});

const authLink = setContext(async (_, context) => {
  const accessToken = await SecureStore.getItemAsync("access_token");
  const request = {
    headers: {
      ...context.headers,
    },
  };
  if (accessToken) {
    request.headers.authorization = `Bearer ${accessToken}`;
  }

  return request;
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export const MUTATION_LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      access_token
      message
      user {
        _id
        name
        username
        email
      }
    }
  }
`;

export const QUERY_GET_POSTS = gql`
  query Query {
    posts {
      _id
      content
      tags
      imgUrl
      authorId
      createdAt
      comments {
        content
        username
        createdAt
      }
      likes {
        username
        createdAt
      }
      author {
        _id
        name
        username
        email
      }
    }
  }
`;

export const QUERY_GET_USER_PROFILE = gql`
  query Users($id: String!) {
    getUserById(_id: $id) {
      _id
      name
      email
      username
      followers {
        _id
        createdAt
        user {
          _id
          username
          email
          name
        }
      }
      followings {
        _id
        createdAt
        user {
          _id
          name
          username
          email
        }
      }
      posts {
        _id
        content
        tags
        imgUrl
        authorId
        comments {
          content
          username
          createdAt
          updatedAt
        }
        likes {
          username
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
        author {
          _id
          name
          username
          email
        }
      }
    }
  }
`;

export const MUTATION_CREATE_POST = gql`
  mutation CreatePost($content: String!, $tags: [String], $imgUrl: String) {
    createPost(content: $content, tags: $tags, imgUrl: $imgUrl) {
      data {
        _id
        content
        tags
        imgUrl
        authorId
        comments {
          content
          username
          createdAt
          updatedAt
        }
        likes {
          username
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      message
    }
  }
`;

export const QUERY_GET_POST_BY_ID = gql`
  query GetPostById($id: ID!) {
    getPostById(_id: $id) {
      _id
      content
      tags
      imgUrl
      comments {
        content
        username
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      author {
        _id
        name
        username
        email
      }
    }
  }
`;

export const MUTATION_LIKE_POST = gql`
  mutation LikePost($postId: ID!) {
    likePost(postId: $postId) {
      message
    }
  }
`;

export const QUERY_SEARCH_USER = gql`
  query SearchUser($username: String!) {
    searchUser(q: $username) {
      _id
      email
      username
      isFollowing
      isFollower
    }
  }
`;

export const MUTATION_REGISTER = gql`
  mutation Register(
    $username: String!
    $email: String!
    $password: String!
    $name: String!
  ) {
    register(
      username: $username
      email: $email
      password: $password
      name: $name
    ) {
      _id
      email
      username
      name
    }
  }
`;

export const MUTATION_CREATE_COMMENT = gql`
  mutation CreateComment($postId: ID!, $content: String!) {
    createComment(postId: $postId, content: $content) {
      data {
        _id
        content
        tags
        imgUrl
        authorId
        comments {
          content
          username
          createdAt
          updatedAt
        }
        likes {
          username
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
        author {
          _id
          name
          username
          email
        }
      }
    }
  }
`;