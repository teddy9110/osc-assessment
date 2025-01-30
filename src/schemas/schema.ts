import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  enum SortOrder {
    ASC
    DESC
  }

  type Course {
    id: ID!
    title: String!
    description: String!
    duration: String!
    outcome: String!
    collection: Collection
    createdBy: User!
  }

  type Collection {
    id: ID!
    name: String!
    courses: [Course!]
  }

  type User {
    id: ID!
    username: String!
    role: UserRole!
    courses: [Course!]
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

  type Query {
    userCourses: [Course!]!  
    courses(limit: Int, sortOrder: SortOrder): [Course!]!
    course(id: ID!): Course
    collections: [Collection!]!
    collection(id: ID!): Collection
  }

  type Mutation {
    register(username: String!, password: String!): AuthPayload!
    login(username: String!, password: String!): AuthPayload!
    addCourse(input: CourseInput!): Course!
    updateCourse(id: ID!, input: CourseInput!): Course!
    deleteCourse(id: ID!): Boolean!
  }
`;
