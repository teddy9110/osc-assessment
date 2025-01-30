export interface CourseInput {
    title: string;
    description: string;
    duration: string;
    outcome: string;
    collectionId?: string;
  }
  
  export interface AuthPayload {
    token: string;
    user: {
      id: string;
      username: string;
      role: string;
    };
  }
  