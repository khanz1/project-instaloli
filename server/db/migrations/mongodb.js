require("dotenv").config();

const { createMongoDBConnection, client } = require("../mongodb");
const users = require("../../data/users.json");
const { hashPassword } = require("../../helpers/bcrypt");

const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

const migrate = async () => {
    await createMongoDBConnection();
  const db = client.db(MONGODB_DB_NAME);
  
};

migrate();
