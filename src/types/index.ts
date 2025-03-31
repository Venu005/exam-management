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

export interface CreateTimetable {
  year: String;
  branch: String;
  startDate: String;
  endDate: String;
}

export interface Timetable {
  id: string;
  title: string;
  branch: string;
  year: number;
  startDate: string;
  endDate: string;
}
