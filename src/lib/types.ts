export type ExamSection =
  | "vocabulary"
  | "reading"
  | "writing"
  | "listening"
  | "speaking";

export interface MCQChoice {
  key: "A" | "B" | "C" | "D";
  text: string;
}

export interface MCQQuestion {
  id: string;
  stem: string;
  choices: MCQChoice[];
  answer: "A" | "B" | "C" | "D";
  explanation: string;
}

export interface ReadingPassage {
  id: string;
  title: string;
  passage: string;
  questions: MCQQuestion[];
}

export interface ListeningItem {
  id: string;
  transcript: string;
  question: MCQQuestion;
}

export interface WritingPrompt {
  summary: {
    instruction: string;
    passage: string;
  };
  essay: {
    topic: string;
    points: string[];
    wordRange: string;
  };
}

export interface SpeakingCard {
  topic: string;
  instruction: string;
  followUpQuestions: string[];
}

export interface GradingResult {
  score: number;
  maxScore: number;
  feedback: string;
  criteria: Array<{ name: string; score: number; max: number; comment: string }>;
}
