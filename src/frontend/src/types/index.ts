export interface Profile {
  text: string;
  updatedAt: bigint;
}

export interface GeneratedAnswer {
  id: bigint;
  question: string;
  answer: string;
  createdAt: bigint;
}
