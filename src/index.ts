import "reflect-metadata";
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { json } from 'body-parser';
import cors from 'cors';
import { AppDataSource } from "./config/database";
import { typeDefs } from "./schemas/schema";
import { authenticate } from "./middleware/auth";
import { UserPayload } from './types/user';
import depthLimit from 'graphql-depth-limit';
import resolvers from './resolvers';

interface ApolloContext {
  user?: UserPayload;
}

interface ExpressContext {
  req: express.Request;
  res: express.Response;
}

async function startServer() {
  try {
    await AppDataSource.initialize();
    console.log("Database connected successfully");

    const app = express();

    app.use(cors());
    app.use(json());

    const server = new ApolloServer<ApolloContext>({
      typeDefs,
      resolvers,
      validationRules: [depthLimit(3)],
      formatError: (error) => {
        if (error.message.startsWith('Query exceeds maximum depth')) {
          return new Error('Query too nested. Please reduce query depth.');
        }
        return error;
      },
      context: async ({ req }: ExpressContext): Promise<ApolloContext> => {
        const token = req.headers.authorization || '';
        return authenticate(token);
      },
      introspection: true,
    });

    await server.start();

    server.applyMiddleware({
      app: app as any,
      path: '/graphql',
      cors: {
        origin: true,
        credentials: true
      }
    });

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

startServer();
