import { AppDataSource } from "../config/database";
import { courseResolvers } from "./courseResolver";
import { authResolvers } from "./authResolver";
import { collectionResolver } from "./collectionResolver";
import { Collection } from '../entities/Collection';
import { Course } from '../entities/Course';

const resolvers = {
  Query: {
    ...courseResolvers.Query,
    ...collectionResolver.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...courseResolvers.Mutation,
    ...collectionResolver.Mutation,
  },
  Course: {
    collection: async (parent: any) => {
      if (!parent.collection) return null;
      const collectionRepository = AppDataSource.getRepository(Collection);
      return await collectionRepository.findOne({ where: { id: parent.collection.id } });
    }
  },
  Collection: {
    courses: async (parent: any) => {
      const courseRepository = AppDataSource.getRepository(Course);
      return await courseRepository.find({ where: { collection: { id: parent.id } } });
    }
  }
};

export default resolvers;
