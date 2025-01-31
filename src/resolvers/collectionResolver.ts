import { AppDataSource } from '../config/database';
import { Collection } from '../entities/Collection';
import { DeepPartial } from 'typeorm';
import { Context, checkAdmin } from '../middleware/auth';

interface CollectionInput {
  name: string;
}

export const collectionResolver = {
  Query: {
    collections: async () => {
      const collectionRepository = AppDataSource.getRepository(Collection);
      return collectionRepository.find({
        relations: ['courses']
      });
    },

    collection: async (_: any, { id }: { id: string }) => {
      const collectionRepository = AppDataSource.getRepository(Collection);
      const collection = await collectionRepository.findOne({
        where: { id },
        relations: ['courses']
      });

      if (!collection) {
        throw new Error('Collection not found');
      }

      return collection;
    },

    collectionCourses: async (_: any, { collectionId }: { collectionId: string }) => {
      const collectionRepository = AppDataSource.getRepository(Collection);
      const collection = await collectionRepository.findOne({
        where: { id: collectionId },
        relations: ['courses']
      });

      if (!collection) {
        throw new Error('Collection not found');
      }

      return collection.courses;
    }
  },

  Mutation: {
    addCollection: async (_: any, { input }: { input: CollectionInput }, context: Context) => {
      // Check if user is admin
      checkAdmin(context);

      const collectionRepository = AppDataSource.getRepository(Collection);

      // Check if collection with same name exists
      const existingCollection = await collectionRepository.findOne({
        where: { name: input.name }
      });

      if (existingCollection) {
        throw new Error('Collection with this name already exists');
      }

      const collectionData: DeepPartial<Collection> = {
        name: input.name
      };

      const collection = collectionRepository.create(collectionData);
      return collectionRepository.save(collection);
    },

    updateCollection: async (_: any, { id, input }: { id: string, input: CollectionInput }, context: Context) => {
      // Check if user is admin
      checkAdmin(context);

      const collectionRepository = AppDataSource.getRepository(Collection);

      const collection = await collectionRepository.findOne({
        where: { id },
        relations: ['courses']
      });

      if (!collection) {
        throw new Error('Collection not found');
      }

      // Check if new name conflicts with existing collection
      if (input.name !== collection.name) {
        const existingCollection = await collectionRepository.findOne({
          where: { name: input.name }
        });

        if (existingCollection) {
          throw new Error('Collection with this name already exists');
        }
      }

      collection.name = input.name;
      return collectionRepository.save(collection);
    },

    deleteCollection: async (_: any, { id }: { id: string }, context: Context) => {
      // Check if user is admin
      checkAdmin(context);

      const collectionRepository = AppDataSource.getRepository(Collection);

      const collection = await collectionRepository.findOne({
        where: { id },
        relations: ['courses']
      });

      if (!collection) {
        throw new Error('Collection not found');
      }

      // Remove collection but keep courses
      await collectionRepository.remove(collection);
      return true;
    }
  }
};
