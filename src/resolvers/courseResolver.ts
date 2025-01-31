
import { AppDataSource } from '../config/database';
import { Course } from '../entities/Course';
import { Collection } from '../entities/Collection';
import { Context, checkAdmin } from '../middleware/auth';
import { DeepPartial } from 'typeorm';

interface CourseInput {
  title: string;
  description: string;
  duration: string;
  outcome: string;
  collectionId?: string;
  createdAt?: Date;
}

export const courseResolvers = {
  Query: {
    courses: async (_: any, { limit, sortOrder }: { limit?: number; sortOrder?: 'ASC' | 'DESC' }, context: Context) => {
      const courseRepository = AppDataSource.getRepository(Course);

      const options: any = {
        order: {
          title: sortOrder || 'ASC'
        },
        relations: ['collection']
      };

      if (limit) {
        options.take = limit;
      }

      return courseRepository.find(options);
    },

    course: async (_: any, { id }: { id: string }, context: Context) => {
      const courseRepository = AppDataSource.getRepository(Course);
      return courseRepository.findOne({ 
        where: { id },
        relations: ['collection']
      });
    },

    collections: async (_: any, __: any, context: Context) => {
      const collectionRepository = AppDataSource.getRepository(Collection);
      return collectionRepository.find({
        relations: ['courses']
      });
    },

    collection: async (_: any, { id }: { id: string }, context: Context) => {
      const collectionRepository = AppDataSource.getRepository(Collection);
      return collectionRepository.findOne({
        where: { id },
        relations: ['courses']
      });
    }
  },

  Mutation: {
    addCourse: async (_: any, { input }: { input: CourseInput }, context: Context) => {
      // Check authentication
      const User = checkAdmin(context);

      const courseRepository = AppDataSource.getRepository(Course);
      const collectionRepository = AppDataSource.getRepository(Collection);

      let collection: Collection | null = null;
      if (input.collectionId) {
        collection = await collectionRepository.findOneBy({ id: input.collectionId });
        if (!collection) {
          throw new Error('Collection not found');
        }
      }

      const courseData: DeepPartial<Course> = {
        title: input.title,
        description: input.description,
        duration: input.duration,
        outcome: input.outcome,
        collection: collection || undefined
      };

      const course = courseRepository.create(courseData);
      return courseRepository.save(course);
    },

    updateCourse: async (_: any, { id, input }: { id: string; input: CourseInput }, context: Context) => {
      // Check authentication
      const User = checkAdmin(context);

      const courseRepository = AppDataSource.getRepository(Course);
      const collectionRepository = AppDataSource.getRepository(Collection);

      const course = await courseRepository.findOneBy({ id });
      if (!course) {
        throw new Error('Course not found');
      }

      let collection: Collection | undefined = undefined;

      if (input.collectionId) {
        const foundCollection = await collectionRepository.findOneBy({ id: input.collectionId });
        if (!foundCollection) {
          throw new Error('Collection not found');
        }
        collection = foundCollection;
      }

      const courseData: DeepPartial<Course> = {
        title: input.title,
        description: input.description,
        duration: input.duration,
        outcome: input.outcome,
        collection: collection
      };

      Object.assign(course, courseData);
      return courseRepository.save(course);
    },
    
    deleteCourse: async (_: any, { id }: { id: string }, context: Context) => {
      // Check authentication
      const User = checkAdmin(context);

      const courseRepository = AppDataSource.getRepository(Course);
      const course = await courseRepository.findOneBy({ id });

      if (!course) {
        throw new Error('Course not found');
      }

      await courseRepository.remove(course);
      return true;
    }
  }
};
