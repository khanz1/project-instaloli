if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const { startStandaloneServer } = require("@apollo/server/standalone");
const { server, serverOptions } = require("./server");
const { createMongoDBConnection } = require("./db/mongodb");

const bootstrap = async () => {
  try {
    await createMongoDBConnection();
    const { url } = await startStandaloneServer(server, serverOptions);
    console.log(`🚀 Server ready at: ${url}`);
  } catch (err) {
    console.error("Error starting server", err);
    process.exit(1);
  }
};

bootstrap();
