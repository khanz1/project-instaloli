const DB_NAME = "instaloli";

const RK = {
  GET_POSTS: () => `${DB_NAME}:posts`,
  GET_POST_BY_ID: (id) => `${DB_NAME}:post:${id}`,
}

module.exports = {
  RK
}