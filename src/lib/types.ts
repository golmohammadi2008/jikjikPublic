export type PublicAnswer = {
  id: string;
  isAi: boolean;
  body: string;
  audioUrl: string | null;
  transcript: string | null;
  likeCount: number;
  createdAt: string;
  responder: { id: string; name: string; username: string; avatar: string | null } | null;
  page?: { name: string; specialty: string | null; category: string | null; ratingAvg: number; ratingCount: number } | null;
};

export type HotQuestion = {
  id: string;
  text: string;
  category: string;
  categoryLabel: string;
  answerCount: number;
  specialistAnswerCount: number;
  createdAt: string;
  preview: PublicAnswer[];
};

export type PublicPostAuthor = {
  id: string;
  name: string;
  username: string;
  avatar: string | null;
  specialty: string | null;
  category: string | null;
  categoryLabel?: string | null;
  ratingAvg: number;
  ratingCount?: number;
};

export type PublicPost = {
  id: string;
  caption: string;
  imageUrl: string;
  isVideo: boolean;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  author: PublicPostAuthor;
};

export type HomeData = {
  hotQuestions: HotQuestion[];
  posts: PublicPost[];
  categories: { key: string; label: string; count: number }[];
};

export type QuestionDetail = {
  question: {
    id: string;
    text: string;
    category: string;
    categoryLabel: string;
    specialty: string | null;
    createdAt: string;
    answerCount: number;
  };
  answers: PublicAnswer[];
  related: { id: string; text: string; answerCount: number }[];
};

export type PostDetail = {
  post: PublicPost;
  related: { id: string; text: string; answerCount: number }[];
};

export type SpecialistListItem = {
  id: string;
  name: string;
  username: string;
  avatar: string | null;
  specialty: string | null;
  category: string | null;
  categoryLabel: string | null;
  ratingAvg: number;
  ratingCount: number;
  online?: boolean;
};

export type SpecialistsList = { specialists: SpecialistListItem[] };

export type SpecialistPost = {
  id: string;
  caption: string;
  imageUrl: string;
  isVideo: boolean;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
};

export type SpecialistDetail = {
  specialist: SpecialistListItem;
  posts: SpecialistPost[];
  related: { id: string; text: string; answerCount: number }[];
};

export type CategoryQuestion = {
  id: string;
  text: string;
  category: string;
  categoryLabel: string;
  answerCount: number;
  specialistAnswerCount: number;
  createdAt: string;
};

export type CategoryDetail = {
  category: { key: string; label: string };
  questions: CategoryQuestion[];
};

export type QuestionsArchive = {
  questions: CategoryQuestion[];
  page: number;
  totalPages: number;
  total: number;
  categories: { key: string; label: string; count: number }[];
};
