import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

const TOPICS = [
  { id: "locevanje", label: "ločevanje odpadkov" },
  { id: "recikliranje", label: "recikliranje materialov" },
  { id: "okoli", label: "okolje in narava" },
];

const LEVELS = [
  { level: 1, label: "Začetnik", points: 5, description: "Osnovna vprašanja za začetnike, zelo enostavna, primerna za osnovnošolce 1-3 razred" },
  { level: 2, label: "Raziskovalec", points: 10, description: "Enostavna vprašanja, primerna za osnovnošolce 3-5 razred" },
  { level: 3, label: "Učenec", points: 15, description: "Srednje lahka vprašanja za osnovnošolce 5-6 razred" },
  { level: 4, label: "Poznavalec", points: 20, description: "Srednje težka vprašanja za osnovnošolce 6-7 razred" },
  { level: 5, label: "Napredni", points: 30, description: "Nekoliko zahtevnejša vprašanja za osnovnošolce 7-8 razred" },
  { level: 6, label: "Specialist", points: 40, description: "Zahtevna vprašanja za osnovnošolce 8-9 razred" },
  { level: 7, label: "Strokovnjak", points: 50, description: "Težka vprašanja z detajli in zanimivostmi" },
  { level: 8, label: "Ekspert", points: 65, description: "Zelo težka vprašanja, specifična dejstva in statistike" },
  { level: 9, label: "Mojster", points: 80, description: "Ekspertna vprašanja, poglobljeno znanje o okoljevarstvu" },
  { level: 10, label: "Eko Junak", points: 100, description: "Vprašanja za prave eko junake, kompleksne teme in globalni vpliv" },
];

type GeneratedQuestion = {
  question: string;
  answers: string[];
  correctIndex: number;
  hint: string;
  explanation: string;
};

// Generate questions for one topic + level combination
const generateQuestionsForLevel = async (
  topic: { id: string; label: string },
  levelObj: { level: number; label: string; points: number; description: string },
  count: number = 20
): Promise<GeneratedQuestion[]> => {
  const prompt = `Ustvari ${count} vprašanj za kviz v slovenščini na temo "${topic.label}" za nivo "${levelObj.label}" (nivo ${levelObj.level}/10).

Navodila za težavnost: ${levelObj.description}

Zahteve:
- Vprašanja morajo biti v slovenščini
- Vsako vprašanje ima točno 4 odgovore
- Odgovori morajo biti kratki (max 5 besed)
- Vprašanja morajo biti raznolika in zanimiva
- Primerna za slovenske osnovnošolce
- Povezana z Slovenijo kjer je možno

Vrni SAMO JSON array brez kakršnegakoli drugega teksta:
[
  {
    "question": "Vprašanje tukaj?",
    "answers": ["Odgovor A", "Odgovor B", "Odgovor C", "Odgovor D"],
    "correctIndex": 0,
    "hint": "Kratek namig",
    "explanation": "Kratka razlaga zakaj je ta odgovor pravilen"
  }
]`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 8000,
          },
        }),
      }
    );

    if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    // Clean and parse JSON
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("No JSON array found in response");

    const questions: GeneratedQuestion[] = JSON.parse(jsonMatch[0]);
    return questions.slice(0, count);
  } catch (e) {
    console.error(`Error generating for ${topic.id} level ${levelObj.level}:`, e);
    return [];
  }
};

// Main generator — call this once to populate Firebase
export const generateAllQuestions = async (
  onProgress: (message: string, current: number, total: number) => void
): Promise<{ success: number; failed: number }> => {
  let success = 0;
  let failed = 0;
  const total = TOPICS.length * LEVELS.length;
  let current = 0;

  for (const topic of TOPICS) {
    for (const levelObj of LEVELS) {
      current++;
      onProgress(
        `Generiram: ${topic.label} - Nivo ${levelObj.level} (${levelObj.label})`,
        current,
        total
      );

      try {
        // Check if questions already exist for this topic+level
        const existing = await getDocs(
          query(
            collection(db, "quizQuestions"),
            where("topic", "==", topic.id),
            where("level", "==", levelObj.level)
          )
        );

        // Skip if already have enough questions
        if (existing.size >= 15) {
          onProgress(
            `✅ Preskočeno (že obstaja): ${topic.label} - Nivo ${levelObj.level}`,
            current,
            total
          );
          success++;
          continue;
        }

        // Generate questions
        const questions = await generateQuestionsForLevel(topic, levelObj, 20);

        if (questions.length === 0) {
          failed++;
          continue;
        }

        // Save to Firebase
        for (const q of questions) {
          await addDoc(collection(db, "quizQuestions"), {
            question: q.question,
            answers: q.answers,
            correctIndex: q.correctIndex,
            hint: q.hint,
            explanation: q.explanation ?? "",
            topic: topic.id,
            level: levelObj.level,
            levelLabel: levelObj.label,
            points: levelObj.points,
            aiGenerated: true,
            createdAt: new Date().toISOString(),
          });
        }

        success++;
        onProgress(
          `✅ Dodano ${questions.length} vprašanj: ${topic.label} - Nivo ${levelObj.level}`,
          current,
          total
        );

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (e) {
        console.error(`Failed for ${topic.id} level ${levelObj.level}:`, e);
        failed++;
      }
    }
  }

  return { success, failed };
};

// Generate only for specific topic + level (for quick refresh)
export const generateQuestionsForTopicLevel = async (
  topicId: string,
  level: number
): Promise<number> => {
  const topic = TOPICS.find(t => t.id === topicId);
  const levelObj = LEVELS.find(l => l.level === level);
  if (!topic || !levelObj) return 0;

  const questions = await generateQuestionsForLevel(topic, levelObj, 20);

  for (const q of questions) {
    await addDoc(collection(db, "quizQuestions"), {
      question: q.question,
      answers: q.answers,
      correctIndex: q.correctIndex,
      hint: q.hint,
      explanation: q.explanation ?? "",
      topic: topicId,
      level: level,
      levelLabel: levelObj.label,
      points: levelObj.points,
      aiGenerated: true,
      createdAt: new Date().toISOString(),
    });
  }

  return questions.length;
};