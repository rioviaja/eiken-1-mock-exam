// Prompt templates for generating Eiken Grade 1 mock exam content.
// All prompts instruct the model to return strict JSON matching our schemas.

export const SYSTEM_JSON = `You are an expert content author for the Eiken Grade 1 (英検1級) examination.
You produce authentic-style practice items that match the real test's difficulty (CEFR C1).
Always respond with a single valid JSON object. Never include markdown fences or commentary.`;

export const VOCABULARY_USER = (count: number) => `
Create ${count} vocabulary fill-in-the-blank MCQs at Eiken Grade 1 level.
Each item must test an advanced single word (verb, noun, adjective) or phrasal verb.
Return JSON shape:
{
  "items": [
    {
      "id": "v1",
      "stem": "Sentence with ( ) where the blank appears.",
      "choices": [
        {"key":"A","text":"..."},
        {"key":"B","text":"..."},
        {"key":"C","text":"..."},
        {"key":"D","text":"..."}
      ],
      "answer": "A|B|C|D",
      "explanation": "Brief Japanese explanation of why the answer is correct and what the distractors mean."
    }
  ]
}
Distractors must be plausible words of similar register.
IMPORTANT: Distribute the correct answer position roughly evenly across A, B, C, and D. Do NOT place the correct answer at A for every item. Aim for roughly equal counts per position over the full set.`;

export const READING_USER = `
Create one Eiken Grade 1 style reading passage (roughly 380-450 words) on an academic
topic (science, social issues, history, economics). Provide 3 MCQs that test inference,
main idea, and vocabulary in context.
Return JSON shape:
{
  "id": "r1",
  "title": "Short title",
  "passage": "Full passage...",
  "questions": [
    {
      "id": "r1q1",
      "stem": "Question stem",
      "choices": [{"key":"A","text":"..."},{"key":"B","text":"..."},{"key":"C","text":"..."},{"key":"D","text":"..."}],
      "answer": "A|B|C|D",
      "explanation": "Brief Japanese explanation."
    }
  ]
}`;

export const LISTENING_USER = (count: number) => `
Create ${count} Eiken Grade 1 listening items. Each item has a short dialogue or
monologue (100-140 words) suitable for TTS playback, followed by one MCQ.
Return JSON shape:
{
  "items": [
    {
      "id": "l1",
      "transcript": "Full spoken text. Use speaker labels like 'Man:' and 'Woman:' for dialogues.",
      "question": {
        "id": "l1q",
        "stem": "Question stem (read once at the end)",
        "choices": [{"key":"A","text":"..."},{"key":"B","text":"..."},{"key":"C","text":"..."},{"key":"D","text":"..."}],
        "answer": "A|B|C|D",
        "explanation": "Brief Japanese explanation."
      }
    }
  ]
}`;

export const WRITING_USER = `
Create one Eiken Grade 1 writing set containing BOTH tasks:
1) Summary task: a 200-240 word non-fiction passage to summarize in 90-110 words.
2) Essay task: one opinion-essay topic with exactly three guidance points and a
   200-240 word range.
Return JSON shape:
{
  "summary": {
    "instruction": "Read the passage below and write a summary in 90-110 words.",
    "passage": "Full passage..."
  },
  "essay": {
    "topic": "Agree or disagree style topic as a declarative prompt.",
    "points": ["point 1","point 2","point 3"],
    "wordRange": "200-240 words"
  }
}`;

export const SPEAKING_USER = `
Create one Eiken Grade 1 二次試験 (interview) speaking card.
The candidate will give a 2-minute speech on ONE topic, then answer 4 follow-up questions.
Topics should be abstract/social/political in nature.
Return JSON shape:
{
  "topic": "The candidate's speech topic as a single question or statement.",
  "instruction": "You have 1 minute to prepare a 2-minute speech on the topic above.",
  "followUpQuestions": ["q1","q2","q3","q4"]
}`;

export const GRADE_WRITING_SUMMARY = (passage: string, studentAnswer: string) => `
You are an Eiken Grade 1 writing examiner. Grade the student's SUMMARY of the
passage below. Use the official 4-criteria rubric (内容 / 構成 / 語彙 / 文法),
each scored 0-4 (total 16).

[PASSAGE]
${passage}

[STUDENT SUMMARY]
${studentAnswer}

Return strict JSON:
{
  "score": <sum 0-16>,
  "maxScore": 16,
  "feedback": "Overall feedback in Japanese (3-5 sentences).",
  "criteria": [
    {"name":"内容","score":0-4,"max":4,"comment":"Japanese comment"},
    {"name":"構成","score":0-4,"max":4,"comment":"Japanese comment"},
    {"name":"語彙","score":0-4,"max":4,"comment":"Japanese comment"},
    {"name":"文法","score":0-4,"max":4,"comment":"Japanese comment"}
  ]
}`;

export const GRADE_WRITING_ESSAY = (
  topic: string,
  points: string[],
  studentAnswer: string
) => `
You are an Eiken Grade 1 writing examiner. Grade the student's ESSAY. Use the
official 4-criteria rubric (内容 / 構成 / 語彙 / 文法), each 0-4 (total 16).

[TOPIC]
${topic}

[REQUIRED POINTS TO REFERENCE (at least two)]
${points.map((p, i) => `${i + 1}. ${p}`).join("\n")}

[STUDENT ESSAY]
${studentAnswer}

Return strict JSON:
{
  "score": <sum 0-16>,
  "maxScore": 16,
  "feedback": "Overall feedback in Japanese (3-5 sentences).",
  "criteria": [
    {"name":"内容","score":0-4,"max":4,"comment":"Japanese comment"},
    {"name":"構成","score":0-4,"max":4,"comment":"Japanese comment"},
    {"name":"語彙","score":0-4,"max":4,"comment":"Japanese comment"},
    {"name":"文法","score":0-4,"max":4,"comment":"Japanese comment"}
  ]
}`;

export const GRADE_SPEAKING = (
  topic: string,
  followUpQuestions: string[],
  transcript: string
) => `
You are an Eiken Grade 1 二次試験 examiner. Grade the candidate's performance
based on the transcript below. Use the official rubric: Short Speech, Interaction,
Grammar & Vocabulary, Pronunciation — each scored 0-10 (total 40).

[TOPIC]
${topic}

[FOLLOW-UP QUESTIONS]
${followUpQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}

[TRANSCRIPT OF CANDIDATE]
${transcript}

Return strict JSON:
{
  "score": <sum 0-40>,
  "maxScore": 40,
  "feedback": "Overall feedback in Japanese (3-5 sentences).",
  "criteria": [
    {"name":"Short Speech","score":0-10,"max":10,"comment":"Japanese comment"},
    {"name":"Interaction","score":0-10,"max":10,"comment":"Japanese comment"},
    {"name":"Grammar & Vocabulary","score":0-10,"max":10,"comment":"Japanese comment"},
    {"name":"Pronunciation","score":0-10,"max":10,"comment":"Japanese comment (based on fluency/word-choice since you only see text)"}
  ]
}`;
