export type UserCreate = {
  email: string;
  name: string;
  username: string;
  clerkId: string;
  imageUrl: string;
};

export interface Exam {
  date: string;
  subject: string;
  code: string;
}
