import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  enum SortOrder {
    ASC
    DESC
  }

  enum UserRole {
    ADMIN
    USER
  }

  type User {
    id: ID!
    username: String!
    role: UserRole!
    courses: [Course!]
  }

  type Collection {
    id: ID!
    name: String!
    courses: [Course!]
    createdAt: String!
    updatedAt: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input CourseInput {
    title: String!
    description: String!
    duration: String!
    outcome: String!
    collectionId: ID
  }

  input CollectionInput {
    name: String!
  }

  type Course {
    id: ID!
    title: String!
    description: String!
    duration: String!
    outcome: String!
    collection: Collection
    createdBy: User!
    createdAt: String!
    updatedAt: String
  }

  type Query {
    userCourses: [Course!]!  
    courses(limit: Int, sortOrder: SortOrder): [Course!]!
    course(id: ID!): Course
    collections: [Collection!]!
    collection(id: ID!): Collection
    collectionCourses(collectionId: ID!): [Course!]!
  }

  type Mutation {
    register(username: String!, password: String!): AuthPayload!
    login(username: String!, password: String!): AuthPayload!

    addCourse(input: CourseInput!): Course!
    updateCourse(id: ID!, input: CourseInput!): Course!
    deleteCourse(id: ID!): Boolean!

    addCollection(input: CollectionInput!): Collection!
    updateCollection(id: ID!, input: CollectionInput!): Collection!
    deleteCollection(id: ID!): Boolean!
  }
`;
