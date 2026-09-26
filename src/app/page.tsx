"use client";

import { useEffect, useMemo, useState } from "react";

type Stage =
  | "learn"
  | "practice"
  | "review"
  | "final"
  | "complete";

type QuestionType =
  | "image-choice"
  | "meaning-choice"
  | "translation"
  | "word-order"
  | "listening"
  | "fill-blank"
  | "memory";

type Question = {
  id: string;
  type: QuestionType;
  word: string;
  question: string;
  options?: string[];
  correct?: string;
  acceptableAnswers?: string[];
  almostAnswers?: string[];
  why?: string;
  words?: string[];
  xp?: number;
};

type AnswerStatus = "correct" | "almost" | "wrong";

type AnswerResult = {
  status: AnswerStatus;
  message?: string;
};

type ComboMilestone = 3 | 5 | 10 | null;

type Account = {
  name: string;
  email: string;
  password: string;
};

const vocabulary = [
  {
    word: "hello",
    meaning: "xin chào",
    pronunciation: "/həˈloʊ/",
    image: "👋",
    example: "Hello! Nice to meet you.",
  },
  {
    word: "friend",
    meaning: "bạn / người bạn",
    pronunciation: "/frend/",
    image: "🧑‍🤝‍🧑",
    example: "She is my friend.",
  },
  {
    word: "home",
    meaning: "nhà",
    pronunciation: "/hoʊm/",
    image: "🏠",
    example: "I am at home.",
  },
  {
    word: "book",
    meaning: "quyển sách",
    pronunciation: "/bʊk/",
    image: "📚",
    example: "I read a book.",
  },
  {
    word: "water",
    meaning: "nước",
    pronunciation: "/ˈwɔːtər/",
    image: "💧",
    example: "I drink water.",
  },
];

const questions: Question[] = [
  {
    id: "q1",
    type: "image-choice",
    word: "book",
    question: "Which word matches this picture?",
    options: ["water", "book", "home", "friend"],
    correct: "book",
    why: 'This picture shows a "book".',
    xp: 2,
  },
  {
    id: "q2",
    type: "meaning-choice",
    word: "friend",
    question: 'What does "friend" mean?',
    options: ["nhà", "nước", "người bạn", "quyển sách"],
    correct: "người bạn",
    why: '"Friend" means "người bạn".',
    xp: 2,
  },
  {
    id: "q3",
    type: "translation",
    word: "water",
    question: "Tôi uống nước.",
    correct: "I drink water",
    acceptableAnswers: [
      "I am drinking water",
      "I'm drinking water",
      "I drink some water",
    ],
    almostAnswers: [
      "I drinks water",
      "I drink waters",
      "I drink a water",
    ],
    why: 'We say "drink water" for this sentence. With "I", use "drink", not "drinks".',
    xp: 2,
  },
  {
    id: "q4",
    type: "word-order",
    word: "home",
    question: "Arrange the words:",
    words: ["home", "I", "at", "am"],
    correct: "I am at home",
    why: 'The correct sentence is "I am at home."',
    xp: 2,
  },
  {
    id: "q5",
    type: "listening",
    word: "water",
    question: "Listen and choose the word.",
    options: ["friend", "water", "hello", "home"],
    correct: "water",
    why: 'You heard the word "water".',
    xp: 2,
  },
  {
    id: "q6",
    type: "fill-blank",
    word: "water",
    question: "I drink ______ every morning.",
    options: ["book", "water", "home", "friend"],
    correct: "water",
    why: 'The natural phrase is "drink water".',
    xp: 2,
  },
  {
    id: "q7",
    type: "memory",
    word: "book",
    question: "Which word means 'quyển sách'?",
    options: ["home", "friend", "book", "water"],
    correct: "book",
    why: '"Book" means "quyển sách".',
    xp: 2,
  },
  {
    id: "q8",
    type: "meaning-choice",
    word: "home",
    question: 'What does "home" mean?',
    options: ["bạn", "nhà", "nước", "xin chào"],
    correct: "nhà",
    why: '"Home" means "nhà".',
    xp: 2,
  },
];

const finalQuestions: Question[] = [
  {
    id: "f1",
    type: "meaning-choice",
    word: "hello",
    question: 'What does "hello" mean?',
    options: ["xin chào", "nhà", "nước", "bạn"],
    correct: "xin chào",
  },
  {
    id: "f2",
    type: "image-choice",
    word: "friend",
    question: "Which word matches this picture?",
    options: ["book", "friend", "home", "water"],
    correct: "friend",
  },
  {
    id: "f3",
    type: "translation",
    word: "book",
    question: "Tôi đọc một quyển sách.",
    correct: "I read a book",
    acceptableAnswers: ["I read one book"],
    almostAnswers: ["I reads a book", "I read book"],
    why: 'Use "read a book" here. With "I", use "read", not "reads".',
  },
];

function normalize(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, " ")
    .replace(/[.!?,;:]+$/g, "");
}

function expandContractions(value: string) {
  return normalize(value)
    .replace(/\bi'm\b/g, "i am")
    .replace(/\byou're\b/g, "you are")
    .replace(/\bhe's\b/g, "he is")
    .replace(/\bshe's\b/g, "she is")
    .replace(/\bit's\b/g, "it is")
    .replace(/\bwe're\b/g, "we are")
    .replace(/\bthey're\b/g, "they are")
    .replace(/\bi've\b/g, "i have")
    .replace(/\byou've\b/g, "you have")
    .replace(/\bwe've\b/g, "we have")
    .replace(/\bthey've\b/g, "they have")
    .replace(/\bi'll\b/g, "i will")
    .replace(/\byou'll\b/g, "you will")
    .replace(/\bhe'll\b/g, "he will")
    .replace(/\bshe'll\b/g, "she will")
    .replace(/\bwe'll\b/g, "we will")
    .replace(/\bthey'll\b/g, "they will")
    .replace(/\bdon't\b/g, "do not")
    .replace(/\bdoesn't\b/g, "does not")
    .replace(/\bdidn't\b/g, "did not");
}

function checkAnswer(
  answer: string,
  question: Question
): AnswerResult {
  const userAnswer = expandContractions(answer);

  const correctAnswer = expandContractions(
    question.correct || ""
  );

  const acceptableAnswers =
    question.acceptableAnswers?.map(expandContractions) || [];

  const almostAnswers =
    question.almostAnswers?.map(expandContractions) || [];

  if (userAnswer === correctAnswer) {
    return {
      status: "correct",
    };
  }

  if (acceptableAnswers.includes(userAnswer)) {
    return {
      status: "correct",
    };
  }

  if (almostAnswers.includes(userAnswer)) {
    return {
      status: "almost",
      message:
        question.why ||
        "Your meaning is close, but there is a small language mistake.",
    };
  }

  if (
    question.type === "translation" &&
    correctAnswer === "i drink water"
  ) {
    const hasWater = userAnswer.includes("water");

    const hasDrink =
      userAnswer.includes("drink") ||
      userAnswer.includes("drinks");

    if (hasWater && hasDrink) {
      if (userAnswer === "i drink water") {
        return {
          status: "correct",
        };
      }

      if (userAnswer === "i drinks water") {
        return {
          status: "almost",
          message:
            'With "I", use "drink", not "drinks".',
        };
      }

      if (
        userAnswer === "i drink waters" ||
        userAnswer === "i drink a water"
      ) {
        return {
          status: "almost",
          message:
            'For this sentence, we normally say "drink water", not "drink waters" or "drink a water".',
        };
      }

      return {
        status: "almost",
        message:
          'Your sentence is close. Check the verb and the expression "drink water".',
      };
    }

    if (
      userAnswer.includes("eat water") ||
      userAnswer.includes("read water") ||
      userAnswer.includes("go water")
    ) {
      return {
        status: "wrong",
        message:
          '"Drink water" means "uống nước". "Eat water" or "read water" does not have the intended meaning.',
      };
    }
  }

  if (
    question.type === "translation" &&
    correctAnswer === "i read a book"
  ) {
    if (userAnswer === "i reads a book") {
      return {
        status: "almost",
        message:
          'With "I", use "read", not "reads".',
      };
    }

    if (userAnswer === "i read book") {
      return {
        status: "almost",
        message:
          'In this sentence, say "I read a book" because "book" is a singular countable noun.',
      };
    }

    if (
      userAnswer === "i eat a book" ||
      userAnswer === "i drink a book"
    ) {
      return {
        status: "wrong",
        message:
          '"Read a book" means "đọc một quyển sách". The verb does not match the meaning here.',
      };
    }
  }

  return {
    status: "wrong",
    message:
      question.why ||
      "Your answer does not match the meaning of the sentence.",
  };
}

export default function Home() {
  const [account, setAccount] =
    useState<Account | null>(null);

  const [authReady, setAuthReady] =
    useState(false);

  const [authMode, setAuthMode] =
    useState<"login" | "register">("login");

  const [showWelcome, setShowWelcome] =
    useState(true);

  const [authName, setAuthName] =
    useState("");

  const [authEmail, setAuthEmail] =
    useState("");

  const [authPassword, setAuthPassword] =
    useState("");

  const [authError, setAuthError] =
    useState("");

  const [stage, setStage] =
    useState<Stage>("learn");

  const [vocabIndex, setVocabIndex] =
    useState(0);

  const [questionIndex, setQuestionIndex] =
    useState(0);

  const [finalIndex, setFinalIndex] =
    useState(0);

  const [selectedAnswer, setSelectedAnswer] =
    useState("");

  const [selectedWords, setSelectedWords] =
    useState<string[]>([]);

  const [answered, setAnswered] =
    useState(false);

  const [correct, setCorrect] =
    useState(false);

  const [answerStatus, setAnswerStatus] =
    useState<AnswerStatus | null>(null);

  const [feedbackMessage, setFeedbackMessage] =
    useState("");

  const [lessonXP, setLessonXP] =
    useState(0);

  const [strike, setStrike] =
    useState(0);

  const [maxStrike, setMaxStrike] =
    useState(0);

  const [mistakes, setMistakes] =
    useState<string[]>([]);

  const [reviewIndex, setReviewIndex] =
    useState(0);

  const [showReview, setShowReview] =
    useState(false);

  const [showFinal, setShowFinal] =
    useState(false);

  const [isListening, setIsListening] =
    useState(false);

  const [xpPulse, setXpPulse] =
    useState(false);

  /*
   * NEW:
   * Controls the big combo celebration.
   */
  const [comboMilestone, setComboMilestone] =
    useState<ComboMilestone>(null);

  useEffect(() => {
    const savedSession = window.localStorage.getItem(
      "english-learning-session"
    );

    if (savedSession) {
      setAccount(JSON.parse(savedSession));
    }

    setAuthReady(true);
  }, []);

  function handleAuthSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const email = authEmail.trim().toLowerCase();

    if (!email || !authPassword) {
      setAuthError("Please enter your email and password.");
      return;
    }

    const savedAccounts = JSON.parse(
      window.localStorage.getItem("english-learning-accounts") || "[]"
    ) as Account[];

    if (authMode === "register") {
      if (!authName.trim()) {
        setAuthError("Please enter your name.");
        return;
      }

      if (authPassword.length < 6) {
        setAuthError("Password must be at least 6 characters.");
        return;
      }

      if (savedAccounts.some((item) => item.email === email)) {
        setAuthError("This email is already registered.");
        return;
      }

      const newAccount = {
        name: authName.trim(),
        email,
        password: authPassword,
      };

      window.localStorage.setItem(
        "english-learning-accounts",
        JSON.stringify([...savedAccounts, newAccount])
      );
      window.localStorage.setItem(
        "english-learning-session",
        JSON.stringify(newAccount)
      );
      setAccount(newAccount);
      return;
    }

    const matchingAccount = savedAccounts.find(
      (item) => item.email === email && item.password === authPassword
    );

    if (!matchingAccount) {
      setAuthError("Incorrect email or password.");
      return;
    }

    window.localStorage.setItem(
      "english-learning-session",
      JSON.stringify(matchingAccount)
    );
    setAccount(matchingAccount);
  }

  function handleLogout() {
    window.localStorage.removeItem("english-learning-session");
    setAccount(null);
    setAuthError("");
    setAuthPassword("");
  }

  const currentQuestion =
    questions[questionIndex];

  const currentFinalQuestion =
    finalQuestions[finalIndex];

  const currentVocab =
    vocabulary[vocabIndex];

  const progress = useMemo(() => {
    if (stage === "learn") {
      return ((vocabIndex + 1) / vocabulary.length) * 20;
    }

    if (stage === "practice") {
      return (
        20 +
        ((questionIndex + 1) / questions.length) * 50
      );
    }

    if (stage === "review") {
      return 75;
    }

    if (stage === "final") {
      return (
        75 +
        ((finalIndex + 1) / finalQuestions.length) * 25
      );
    }

    return 100;
  }, [
    stage,
    vocabIndex,
    questionIndex,
    finalIndex,
  ]);

  /*
   * SOUND ENGINE
   */
  function playSound(
    type:
      | "click"
      | "correct"
      | "wrong"
      | "complete"
      | "combo3"
      | "combo5"
      | "combo10"
  ) {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (
          window as typeof window & {
            webkitAudioContext?: typeof AudioContext;
          }
        ).webkitAudioContext;

      if (!AudioContextClass) return;

      const context =
        new AudioContextClass();

      const now = context.currentTime;

      const playTone = (
        frequency: number,
        start: number,
        duration: number,
        volume = 0.04,
        type: OscillatorType = "sine"
      ) => {
        const oscillator =
          context.createOscillator();

        const gain =
          context.createGain();

        oscillator.type = type;
        oscillator.frequency.value =
          frequency;

        oscillator.connect(gain);
        gain.connect(context.destination);

        gain.gain.setValueAtTime(
          volume,
          now + start
        );

        gain.gain.exponentialRampToValueAtTime(
          0.001,
          now + start + duration
        );

        oscillator.start(
          now + start
        );

        oscillator.stop(
          now + start + duration
        );
      };

      if (type === "click") {
        playTone(
          420,
          0,
          0.08,
          0.025
        );
      }

      if (type === "correct") {
        playTone(
          660,
          0,
          0.16,
          0.045
        );
        playTone(
          880,
          0.08,
          0.2,
          0.035
        );
      }

      if (type === "wrong") {
        playTone(
          220,
          0,
          0.18,
          0.04,
          "triangle"
        );
      }

      if (type === "complete") {
        playTone(
          660,
          0,
          0.22,
          0.045
        );
        playTone(
          820,
          0.16,
          0.22,
          0.04
        );
        playTone(
          1040,
          0.32,
          0.35,
          0.04
        );
      }

      if (type === "combo3") {
        playTone(
          660,
          0,
          0.14,
          0.05
        );
        playTone(
          880,
          0.08,
          0.16,
          0.05
        );
        playTone(
          1040,
          0.18,
          0.24,
          0.055
        );
      }

      if (type === "combo5") {
        playTone(
          660,
          0,
          0.12,
          0.05
        );
        playTone(
          830,
          0.1,
          0.14,
          0.05
        );
        playTone(
          990,
          0.2,
          0.15,
          0.055
        );
        playTone(
          1320,
          0.32,
          0.35,
          0.06
        );
      }

      if (type === "combo10") {
        playTone(
          523,
          0,
          0.12,
          0.05
        );
        playTone(
          659,
          0.1,
          0.12,
          0.05
        );
        playTone(
          784,
          0.2,
          0.12,
          0.05
        );
        playTone(
          1046,
          0.32,
          0.16,
          0.055
        );
        playTone(
          1318,
          0.45,
          0.5,
          0.065
        );
      }

      setTimeout(() => {
        context.close();
      }, 1400);
    } catch {
      // Audio is optional.
    }
  }

  function speak(
    text: string,
    rate = 1
  ) {
    if (
      typeof window === "undefined" ||
      !("speechSynthesis" in window)
    ) {
      return;
    }

    window.speechSynthesis.cancel();
    setIsListening(true);

    const utterance =
      new SpeechSynthesisUtterance(text);

    utterance.lang = "en-US";
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.onend = () => setIsListening(false);
    utterance.onerror = () => setIsListening(false);

    window.speechSynthesis.speak(
      utterance
    );
  }

  function triggerCombo(
    nextStrike: number
  ) {
    let milestone: ComboMilestone =
      null;

    if (nextStrike === 10) {
      milestone = 10;
    } else if (nextStrike === 5) {
      milestone = 5;
    } else if (nextStrike === 3) {
      milestone = 3;
    }

    if (!milestone) return;

    setComboMilestone(milestone);

    if (milestone === 3) {
      playSound("combo3");
    }

    if (milestone === 5) {
      playSound("combo5");
    }

    if (milestone === 10) {
      playSound("combo10");
    }

    window.setTimeout(() => {
      setComboMilestone(null);
    }, milestone === 10 ? 1700 : 1200);
  }

  function startPractice() {
    playSound("click");

    setStage("practice");
    setQuestionIndex(0);
    setSelectedAnswer("");
    setSelectedWords([]);
    setAnswered(false);
    setAnswerStatus(null);
    setFeedbackMessage("");
  }

  function answerQuestion(
    answer: string,
    questionOverride?: Question
  ) {
    const questionToCheck =
      questionOverride || currentQuestion;

    if (
      answered ||
      !questionToCheck
    ) {
      return;
    }

    playSound("click");

    let result: AnswerResult;

    if (
      questionToCheck.type ===
        "translation" ||
      questionToCheck.type ===
        "word-order"
    ) {
      result = checkAnswer(
        answer,
        questionToCheck
      );
    } else {
      const isCorrect =
        answer === questionToCheck.correct;

      result = {
        status: isCorrect
          ? "correct"
          : "wrong",
        message: questionToCheck.why,
      };
    }

    const isCorrect =
      result.status === "correct";

    setSelectedAnswer(answer);
    setCorrect(isCorrect);
    setAnswerStatus(result.status);
    setFeedbackMessage(
      result.message || ""
    );
    setAnswered(true);

    if (result.status === "correct") {
      playSound("correct");

      const nextStrike =
        strike + 1;

      setStrike(nextStrike);

      setMaxStrike((maximum) =>
        Math.max(
          maximum,
          nextStrike
        )
      );

      triggerCombo(nextStrike);

      if (
        stage === "practice" &&
        questionToCheck.id.startsWith("q")
      ) {
        const xpGain =
          questionToCheck.xp || 0;

        setLessonXP(
          (previous) =>
            previous + xpGain
        );

        setXpPulse(true);
        window.setTimeout(() => {
          setXpPulse(false);
        }, 450);
      }
    } else {
      playSound("wrong");

      setStrike(0);

      if (
        stage === "practice" &&
        !mistakes.includes(
          questionToCheck.word
        )
      ) {
        setMistakes((previous) => [
          ...previous,
          questionToCheck.word,
        ]);
      }
    }
  }

  function handleWordClick(
    word: string
  ) {
    if (
      answered ||
      !currentQuestion ||
      currentQuestion.type !==
        "word-order"
    ) {
      return;
    }

    playSound("click");

    const nextWords = [
      ...selectedWords,
      word,
    ];

    setSelectedWords(nextWords);

    const totalWords =
      currentQuestion.words || [];

    if (
      nextWords.length >=
      totalWords.length
    ) {
      const finalSentence =
        nextWords.join(" ");

      answerQuestion(
        finalSentence
      );
    }
  }

  function removeSelectedWord(
    index: number
  ) {
    if (answered) return;

    playSound("click");

    setSelectedWords((previous) =>
      previous.filter(
        (_, wordIndex) =>
          wordIndex !== index
      )
    );
  }

  function continueQuestion() {
    if (!answered) return;

    if (
      questionIndex <
      questions.length - 1
    ) {
      setQuestionIndex(
        (previous) =>
          previous + 1
      );

      setSelectedAnswer("");
      setSelectedWords([]);
      setAnswered(false);
      setCorrect(false);
      setAnswerStatus(null);
      setFeedbackMessage("");

      return;
    }

    if (mistakes.length > 0) {
      setStage("review");
      setReviewIndex(0);
      return;
    }

    setStage("final");
    setFinalIndex(0);
    setShowFinal(true);
  }

  function answerFinalQuestion(
    answer: string
  ) {
    if (
      answered ||
      !currentFinalQuestion
    ) {
      return;
    }

    playSound("click");

    const result =
      checkAnswer(
        answer,
        currentFinalQuestion
      );

    setSelectedAnswer(answer);
    setAnswerStatus(result.status);
    setFeedbackMessage(
      result.message || ""
    );
    setCorrect(
      result.status === "correct"
    );
    setAnswered(true);
  }

  function continueFinal() {
    if (
      finalIndex <
      finalQuestions.length - 1
    ) {
      setFinalIndex(
        (previous) =>
          previous + 1
      );

      setSelectedAnswer("");
      setSelectedWords([]);
      setAnswered(false);
      setCorrect(false);
      setAnswerStatus(null);
      setFeedbackMessage("");

      return;
    }

    playSound("complete");

    setShowFinal(false);
    setStage("complete");
  }

  function finishReview() {
    setShowReview(false);

    setStage("final");
    setFinalIndex(0);
    setShowFinal(true);
  }

  useEffect(() => {
    setSelectedAnswer("");
    setSelectedWords([]);
    setAnswered(false);
    setCorrect(false);
    setAnswerStatus(null);
    setFeedbackMessage("");
  }, [
    questionIndex,
    finalIndex,
  ]);

  const earnedTotal = Math.min(
    20,
    lessonXP + 4
  );

  const accuracy =
    questions.length === 0
      ? 0
      : Math.round(
          (lessonXP /
            (questions.length * 2)) *
            100
        );

  const confettiPieces = useMemo(
    () =>
      Array.from({ length: 20 }, (_, index) => ({
        id: index,
        left: 50 + ((index % 5) - 2) * 16,
        delay: (index % 6) * 0.04,
        duration: 0.9 + (index % 5) * 0.12,
        spreadX: -120 + (index % 7) * 35,
        spreadY: -140 + (index % 5) * 25,
        rotate: (index % 8) * 45,
        color: [
          "#5B5FEF",
          "#FFB703",
          "#22C55E",
          "#F472B6",
          "#F97316",
          "#38BDF8",
        ][index % 6],
      })),
    []
  );

  /*
   * FINAL IMAGE
   */
  const finalImage =
    vocabulary.find(
      (item) =>
        item.word ===
        currentFinalQuestion?.word
    )?.image;

  if (!authReady) {
    return null;
  }

  if (!account) {
    if (showWelcome) {
      return (
        <main className="auth-shell flex min-h-screen items-center justify-center overflow-hidden px-5 py-10 text-[#202331]">
          <style jsx global>{`
            @keyframes authRise {
              from { opacity: 0; transform: translateY(22px); }
              to { opacity: 1; transform: translateY(0); }
            }

            @keyframes authDrift {
              0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
              50% { transform: translate3d(18px, -14px, 0) scale(1.06); }
            }

            @keyframes authShimmer {
              from { transform: translateX(-120%); }
              to { transform: translateX(120%); }
            }

            .auth-shell {
              position: relative;
              isolation: isolate;
              background: #f7f8fc;
            }

            .auth-shell::before,
            .auth-shell::after {
              position: absolute;
              z-index: -1;
              width: 320px;
              height: 320px;
              border-radius: 999px;
              content: "";
              filter: blur(4px);
              opacity: 0.7;
              animation: authDrift 9s ease-in-out infinite;
            }

            .auth-shell::before {
              top: -120px;
              left: -120px;
              background: #dfe2ff;
            }

            .auth-shell::after {
              right: -130px;
              bottom: -120px;
              background: #d8f5e7;
              animation-delay: -4s;
            }

            .auth-reveal {
              animation: authRise 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
            }

            .auth-reveal-delay {
              animation: authRise 0.8s 0.12s cubic-bezier(0.22, 1, 0.36, 1) both;
            }

            .auth-primary {
              position: relative;
              overflow: hidden;
              transition: transform 0.2s ease, box-shadow 0.2s ease;
            }

            .auth-primary::after {
              position: absolute;
              inset: 0;
              width: 45%;
              background: rgba(255, 255, 255, 0.18);
              content: "";
              transform: translateX(-120%) skewX(-18deg);
            }

            .auth-primary:hover {
              transform: translateY(-2px);
              box-shadow: 0 14px 28px rgba(91, 95, 239, 0.2);
            }

            .auth-primary:hover::after {
              animation: authShimmer 0.8s ease;
            }

            @media (prefers-reduced-motion: reduce) {
              .auth-shell::before,
              .auth-shell::after,
              .auth-reveal,
              .auth-reveal-delay,
              .auth-primary,
              .auth-primary::after {
                animation: none !important;
                transition: none !important;
              }
            }
          `}</style>

          <section className="auth-reveal w-full max-w-2xl text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[30px] bg-white text-5xl shadow-[0_18px_50px_rgba(91,95,239,0.14)]">
              🌱
            </div>
            <div className="auth-reveal-delay">
              <p className="mt-8 text-sm font-extrabold uppercase tracking-[0.24em] text-[#5B5FEF]">
                English learning studio
              </p>
              <h1 className="mt-4 text-5xl font-black tracking-tight sm:text-7xl">
                Welcome to<br />
                <span className="text-[#5B5FEF]">Dan&apos;s Class</span>
              </h1>
              <p className="mx-auto mt-6 max-w-md text-lg leading-8 text-[#737789]">
                Build better English habits, one small win at a time.
              </p>
              <button
                onClick={() => setShowWelcome(false)}
                className="auth-primary mt-10 rounded-2xl bg-[#5B5FEF] px-8 py-4 font-extrabold text-white shadow-lg shadow-[#5B5FEF]/20 active:scale-[0.98]"
              >
                Enter the class <span className="ml-2">→</span>
              </button>
              <div className="mt-8 flex items-center justify-center gap-3 text-sm font-semibold text-[#737789]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#5B5FEF]" />
                Learn at your own pace
                <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
              </div>
            </div>
          </section>
        </main>
      );
    }

    return (
      <main className="auth-shell flex min-h-screen items-center justify-center overflow-hidden px-5 py-10 text-[#202331]">
        <section className="auth-reveal w-full max-w-md rounded-[32px] border border-white/80 bg-white/90 p-8 shadow-[0_24px_70px_rgba(32,35,49,0.08)] backdrop-blur-xl sm:p-10">
          <div className="text-center">
            <button
              onClick={() => setShowWelcome(true)}
              className="text-5xl transition hover:-translate-y-1 active:scale-95"
              aria-label="Back to welcome"
            >
              🌱
            </button>
            <div className="mt-4 text-sm font-bold uppercase tracking-wider text-[#5B5FEF]">
              Dan&apos;s Class
            </div>
            <h1 className="mt-2 text-3xl font-extrabold">
              {authMode === "login" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-2 text-[#737789]">
              {authMode === "login"
                ? "Continue your English learning journey."
                : "Save your progress and learn at your own pace."}
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="mt-8 space-y-4">
            {authMode === "register" && (
              <label className="block text-sm font-bold">
                Your name
                <input
                  value={authName}
                  onChange={(event) => setAuthName(event.target.value)}
                  placeholder="Alex"
                  className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 font-normal outline-none transition focus:border-[#5B5FEF] focus:ring-4 focus:ring-[#5B5FEF]/10"
                />
              </label>
            )}

            <label className="block text-sm font-bold">
              Email
              <input
                type="email"
                required
                value={authEmail}
                onChange={(event) => setAuthEmail(event.target.value)}
                placeholder="you@example.com"
                className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 font-normal outline-none transition focus:border-[#5B5FEF] focus:ring-4 focus:ring-[#5B5FEF]/10"
              />
            </label>

            <label className="block text-sm font-bold">
              Password
              <input
                type="password"
                required
                minLength={6}
                value={authPassword}
                onChange={(event) => setAuthPassword(event.target.value)}
                placeholder="At least 6 characters"
                className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 font-normal outline-none transition focus:border-[#5B5FEF] focus:ring-4 focus:ring-[#5B5FEF]/10"
              />
            </label>

            {authError && (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="auth-primary w-full rounded-2xl bg-[#5B5FEF] px-6 py-4 font-bold text-white shadow-lg shadow-[#5B5FEF]/15 active:scale-[0.98]"
            >
              {authMode === "login" ? "Log in" : "Create account"}
            </button>
          </form>

          <button
            onClick={() => {
              setAuthMode((mode) => (mode === "login" ? "register" : "login"));
              setAuthError("");
            }}
            className="mt-6 w-full text-center text-sm font-bold text-[#5B5FEF]"
          >
            {authMode === "login"
              ? "New here? Create an account"
              : "Already have an account? Log in"}
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F8FC] text-[#202331]">
      <style jsx global>{`
        @keyframes pop {
          0% {
            transform: scale(0.92);
            opacity: 0;
          }
          65% {
            transform: scale(1.04);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes microShake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-3px);
          }
          50% {
            transform: translateX(3px);
          }
          75% {
            transform: translateX(-2px);
          }
        }

        @keyframes listenRipple {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          25% {
            opacity: 0.45;
          }
          100% {
            opacity: 0;
            transform: scale(1.35);
          }
        }

        @keyframes badgeValueFlip {
          0% {
            opacity: 0;
            transform: translateY(8px);
          }
          30% {
            opacity: 1;
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes xpPulse {
          0% {
            opacity: 0;
            transform: translateY(6px);
          }
          25% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-12px);
          }
        }

        @keyframes touchScale {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(0.97);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes panelIn {
          0% {
            opacity: 0;
            transform: translateX(8px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes subtlePulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.82;
          }
          50% {
            transform: scale(1.12);
            opacity: 1;
          }
        }

        @keyframes checkPop {
          0% {
            opacity: 0;
            transform: scale(0.7);
          }
          55% {
            opacity: 1;
            transform: scale(1.06);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          20% {
            transform: translateX(-3px);
          }
          40% {
            transform: translateX(3px);
          }
          60% {
            transform: translateX(-2px);
          }
          80% {
            transform: translateX(2px);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-7px);
          }
        }

        @keyframes streakBounce {
          0% {
            transform: scale(1);
          }
          35% {
            transform: scale(1.35) rotate(-4deg);
          }
          65% {
            transform: scale(0.92) rotate(3deg);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes xpFloat {
          0% {
            opacity: 0;
            transform: translateY(10px) scale(0.8);
          }
          25% {
            opacity: 1;
            transform: translateY(0) scale(1.1);
          }
          100% {
            opacity: 0;
            transform: translateY(-55px) scale(1);
          }
        }

        @keyframes comboFlash {
          0% {
            opacity: 0;
          }
          15% {
            opacity: 0.9;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes subtleGlow {
          0%,
          100% {
            opacity: 0.65;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.08);
          }
        }

        @keyframes comboCard {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes particleOne {
          0% {
            opacity: 1;
            transform: translate(0, 0)
              scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-120px, -130px)
              rotate(120deg)
              scale(0.2);
          }
        }

        @keyframes particleTwo {
          0% {
            opacity: 1;
            transform: translate(0, 0)
              scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(125px, -110px)
              rotate(-100deg)
              scale(0.2);
          }
        }

        @keyframes particleThree {
          0% {
            opacity: 1;
            transform: translate(0, 0)
              scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-145px, 70px)
              rotate(150deg)
              scale(0.2);
          }
        }

        @keyframes particleFour {
          0% {
            opacity: 1;
            transform: translate(0, 0)
              scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(145px, 65px)
              rotate(-150deg)
              scale(0.2);
          }
        }

        @keyframes particleFive {
          0% {
            opacity: 1;
            transform: translate(0, 0)
              scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(45px, -150px)
              rotate(100deg)
              scale(0.2);
          }
        }

        @keyframes particleSix {
          0% {
            opacity: 1;
            transform: translate(0, 0)
              scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-40px, 145px)
              rotate(-100deg)
              scale(0.2);
          }
        }

        @keyframes firePulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.18);
          }
        }

        @keyframes imageSuccess {
          0% {
            transform: scale(1);
          }
          35% {
            transform: scale(1.18)
              rotate(-4deg);
          }
          65% {
            transform: scale(0.96)
              rotate(3deg);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes optionCorrect {
          0% {
            transform: scale(1);
          }
          45% {
            transform: scale(1.045);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes finishBurst {
          0% {
            opacity: 0;
            transform: scale(0.6);
          }
          50% {
            opacity: 1;
            transform: scale(1.08);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes confettiBurst {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5) rotate(0deg);
          }
          15% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y))) rotate(var(--r)) scale(0.9);
          }
        }

        .animate-pop {
          animation: pop 0.3s ease-out;
        }

        .animate-shake {
          animation: shake 0.22s ease-in-out;
        }

        .animate-slide {
          animation: panelIn 0.28s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .micro-shake {
          animation: microShake 0.22s ease-in-out;
        }

        .animate-check {
          animation: checkPop 0.22s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .touch-scale {
          animation: touchScale 0.15s ease-out;
        }

        .listen-button {
          position: relative;
          transition: transform 0.15s ease-out, box-shadow 0.15s ease-out, border-color 0.15s ease-out;
        }

        .listen-button:hover {
          transform: translateY(-1px);
        }

        .listen-button:active {
          transform: scale(0.97);
        }

        .listen-button[data-active="true"] {
          box-shadow: 0 0 0 4px rgba(91, 95, 239, 0.08);
        }

        .listen-ripple {
          position: absolute;
          inset: -10px;
          border: 1px solid rgba(91, 95, 239, 0.2);
          border-radius: 999px;
          animation: listenRipple 0.9s ease-out forwards;
        }

        .choice-button {
          transition: transform 0.12s ease-out, box-shadow 0.12s ease-out, border-color 0.12s ease-out, background-color 0.12s ease-out;
        }

        .choice-button:hover {
          transform: translateY(-1px) scale(1.01);
          box-shadow: 0 6px 16px rgba(91, 95, 239, 0.08);
        }

        .choice-button:active {
          transform: scale(0.98);
        }

        .strike-value {
          display: inline-block;
          transform-origin: center;
          animation: badgeValueFlip 0.25s ease-out;
        }

        .xp-toast {
          position: absolute;
          right: 10px;
          top: -8px;
          font-size: 12px;
          font-weight: 800;
          color: #5b5fef;
          animation: xpPulse 0.45s ease-out forwards;
          white-space: nowrap;
        }

        .progress-dot {
          display: inline-block;
          animation: subtlePulse 1.5s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }

        .animate-float {
          animation: float 2s ease-in-out infinite;
        }

        .animate-streak {
          animation: streakBounce 0.5s ease-out;
        }

        .animate-xp {
          animation: xpFloat 0.8s ease-out forwards;
        }

        .animate-combo-card {
          animation: comboCard 0.65s cubic-bezier(
              0.2,
              0.9,
              0.25,
              1
            );
        }

        .animate-combo-glow {
          animation: subtleGlow 0.9s ease-in-out
            1;
        }

        .animate-particle-one {
          animation: particleOne 1.1s
            ease-out forwards;
        }

        .animate-particle-two {
          animation: particleTwo 1.1s
            ease-out forwards;
        }

        .animate-particle-three {
          animation: particleThree 1.1s
            ease-out forwards;
        }

        .animate-particle-four {
          animation: particleFour 1.1s
            ease-out forwards;
        }

        .animate-particle-five {
          animation: particleFive 1.1s
            ease-out forwards;
        }

        .animate-particle-six {
          animation: particleSix 1.1s
            ease-out forwards;
        }

        .animate-fire {
          animation: firePulse 0.55s
            ease-in-out infinite;
        }

        .animate-image-success {
          animation: imageSuccess 0.55s
            ease-out;
        }

        .animate-option-correct {
          animation: optionCorrect 0.45s
            ease-out;
        }

        .animate-finish {
          animation: finishBurst 0.65s
            cubic-bezier(
              0.2,
              0.9,
              0.25,
              1
            );
        }

        .confetti-piece {
          position: absolute;
          left: 50%;
          top: 38%;
          width: 10px;
          height: 18px;
          border-radius: 3px;
          opacity: 0;
          transform-origin: center;
          animation: confettiBurst var(--dur) cubic-bezier(0.22, 1, 0.36, 1) forwards;
          animation-delay: var(--delay);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
        }
      `}</style>

      {stage === "complete" && (
        <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
          {confettiPieces.map((piece) => (
            <span
              key={piece.id}
              className="confetti-piece"
              style={{
                background: piece.color,
                ['--x' as string]: `${piece.spreadX}px`,
                ['--y' as string]: `${piece.spreadY}px`,
                ['--r' as string]: `${piece.rotate}deg`,
                ['--dur' as string]: `${piece.duration}s`,
                ['--delay' as string]: `${piece.delay}s`,
                left: `${piece.left}%`,
              }}
            />
          ))}
        </div>
      )}

      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-5 py-4">
          <button
            onClick={() => {
              playSound("click");
              setStage("learn");
              setVocabIndex(0);
              setComboMilestone(null);
            }}
            className="rounded-xl px-2 py-1 text-2xl transition hover:-translate-y-[1px] hover:bg-gray-100 active:scale-95"
          >
            ←
          </button>

          <div className="flex-1">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-bold">
                Lesson 1
              </span>

              <div className="flex items-center gap-4 text-sm font-semibold">
                <span
                  className={
                    strike > 0
                      ? "inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1.5 text-orange-600"
                      : "inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1.5 text-orange-600"
                  }
                >
                  <span className={comboMilestone ? "animate-combo-glow inline-block rotate-[-4deg] transition-transform duration-200" : "inline-block rotate-[-4deg] transition-transform duration-200"}>
                    🔥
                  </span>
                  <span key={strike} className="strike-value">
                    {strike}
                  </span>
                  {comboMilestone && (
                    <span className="ml-0.5 text-xs text-amber-500">
                      ✨
                    </span>
                  )}
                </span>

                <span className="relative inline-flex items-center rounded-full bg-[#EEF0FF] px-2.5 py-1.5 text-[#4548C7]">
                  ⭐ {lessonXP} XP
                  {xpPulse && (
                    <span className="xp-toast">+{currentQuestion?.xp || 2} XP</span>
                  )}
                </span>
              </div>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-[#5B5FEF] transition-all duration-500"
                style={{
                  width: `${Math.min(
                    progress,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <span className="max-w-24 truncate text-sm font-semibold text-[#737789]">
              {account.name}
            </span>
            <button
              onClick={handleLogout}
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm font-bold transition hover:border-[#5B5FEF] hover:text-[#5B5FEF] active:scale-95"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-5 py-10">
        {/* LEARN */}
        {stage === "learn" && (
          <section className="animate-slide">
            <div className="mb-8 text-center">
              <div className="mb-2 text-sm font-bold uppercase tracking-wider text-[#5B5FEF]">
                Level A1 • Everyday Life
              </div>

              <h1 className="text-3xl font-extrabold">
                My First English Words
              </h1>

              <p className="mt-2 text-[#737789]">
                Learn the word before
                you practice it.
              </p>
            </div>

            <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm">
              <div className="flex min-h-[230px] items-center justify-center bg-gradient-to-b from-[#EEF0FF] to-white">
                <div className="animate-float text-8xl">
                  {currentVocab.image}
                </div>
              </div>

              <div className="p-8 text-center">
                <h2 className="text-4xl font-extrabold">
                  {currentVocab.word}
                </h2>

                <p className="mt-2 text-sm text-[#737789]">
                  {currentVocab.pronunciation}
                </p>

                <p className="mt-3 text-lg font-semibold">
                  {currentVocab.meaning}
                </p>

                <div className="mx-auto mt-6 max-w-md rounded-2xl bg-[#F7F8FC] p-4 text-[#737789]">
                  “{currentVocab.example}”
                </div>

                <div className="mt-6 flex justify-center gap-3">
                  <button
                    onClick={() =>
                      speak(currentVocab.word)
                    }
                    data-active={isListening}
                    className="listen-button relative rounded-xl border border-gray-200 bg-white px-5 py-3 font-bold text-[#202331]"
                  >
                    {isListening && <span className="listen-ripple" />}
                    <span className="relative inline-flex items-center gap-2">
                      <span className={isListening ? "inline-block transition-transform duration-200" : ""}>🔊</span>
                      {isListening ? "Playing..." : "Listen"}
                    </span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    playSound("click");

                    if (
                      vocabIndex <
                      vocabulary.length - 1
                    ) {
                      setVocabIndex(
                        (previous) =>
                          previous + 1
                      );
                    } else {
                      startPractice();
                    }
                  }}
                  className="mt-8 w-full rounded-2xl bg-[#5B5FEF] px-6 py-4 font-bold text-white shadow-sm transition hover:-translate-y-[1px] hover:bg-[#4548C7] active:scale-[0.98]"
                >
                  {vocabIndex <
                  vocabulary.length - 1
                    ? "Next word →"
                    : "Start practice →"}
                </button>
              </div>
            </div>

            <div className="mt-5 text-center text-sm text-[#737789]">
              Word {vocabIndex + 1} of{" "}
              {vocabulary.length}
            </div>
          </section>
        )}

        {/* PRACTICE */}
        {stage === "practice" &&
          currentQuestion && (
            <section
              className={`animate-slide ${
                answerStatus === "wrong"
                  ? "animate-shake"
                  : ""
              }`}
            >
              <div className="mb-7">
                <div className="mb-2 text-sm font-bold text-[#5B5FEF]">
                  Practice{" "}
                  {questionIndex + 1}/
                  {questions.length}
                </div>

                <h1 className="text-2xl font-extrabold">
                  {currentQuestion.question}
                </h1>
              </div>

              {/* IMAGE CHOICE */}
              {currentQuestion.type ===
                "image-choice" && (
                <div className="space-y-5">
                  <div
                    className={`flex h-48 items-center justify-center rounded-3xl bg-[#EEF0FF] text-8xl ${
                      answered &&
                      answerStatus ===
                        "correct"
                        ? "animate-image-success"
                        : ""
                    }`}
                  >
                    {
                      vocabulary.find(
                        (item) =>
                          item.word ===
                          currentQuestion.word
                      )?.image
                    }
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {currentQuestion.options?.map(
                      (option) => (
                        <button
                          key={option}
                          disabled={answered}
                          onClick={() =>
                            answerQuestion(
                              option
                            )
                          }
                          className={`choice-button rounded-2xl border bg-white p-5 text-lg font-bold ${
                            answered &&
                            option ===
                              currentQuestion.correct
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200"
                          }`}
                        >
                          {option}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* MEANING CHOICE */}
              {currentQuestion.type ===
                "meaning-choice" && (
                <div className="space-y-5">
                  <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
                    <div className="text-5xl font-extrabold">
                      {currentQuestion.word}
                    </div>

                    <button
                      onClick={() =>
                        speak(
                          currentQuestion.word
                        )
                      }
                      className="mt-4 text-[#5B5FEF]"
                    >
                      🔊 Listen
                    </button>
                  </div>

                  <div className="grid gap-3">
                    {currentQuestion.options?.map(
                      (option) => (
                        <button
                          key={option}
                          disabled={answered}
                          onClick={() =>
                            answerQuestion(
                              option
                            )
                          }
                          className={`choice-button rounded-2xl border bg-white p-5 text-left font-semibold ${
                            answered &&
                            option ===
                              currentQuestion.correct
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200"
                          }`}
                        >
                          {option}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* TRANSLATION */}
              {currentQuestion.type ===
                "translation" && (
                <div className="space-y-5">
                  <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
                    <div className="text-2xl font-bold">
                      {currentQuestion.question}
                    </div>
                  </div>

                  <input
                    disabled={answered}
                    value={selectedAnswer}
                    onChange={(event) =>
                      setSelectedAnswer(
                        event.target.value
                      )
                    }
                    onKeyDown={(event) => {
                      if (
                        event.key ===
                          "Enter" &&
                        !answered
                      ) {
                        answerQuestion(
                          selectedAnswer
                        );
                      }
                    }}
                    placeholder="Type your answer in English..."
                    className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-lg outline-none transition focus:border-[#5B5FEF] focus:ring-4 focus:ring-[#5B5FEF]/10"
                  />

                  {!answered && (
                    <button
                      onClick={() =>
                        answerQuestion(
                          selectedAnswer
                        )
                      }
                      disabled={
                        !selectedAnswer.trim()
                      }
                      className="w-full rounded-2xl bg-[#5B5FEF] px-6 py-4 font-bold text-white transition hover:bg-[#4548C7] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Check answer
                    </button>
                  )}
                </div>
              )}

              {/* WORD ORDER */}
              {currentQuestion.type ===
                "word-order" && (
                <div className="space-y-6">
                  <div className="min-h-20 rounded-2xl border-2 border-dashed border-gray-300 bg-white p-4">
                    <div className="flex flex-wrap gap-2">
                      {selectedWords.map(
                        (word, index) => (
                          <button
                            key={`${word}-${index}`}
                            onClick={() =>
                              removeSelectedWord(
                                index
                              )
                            }
                            className="rounded-xl bg-[#EEF0FF] px-4 py-2 font-bold text-[#4548C7] transition hover:-translate-y-[1px] active:scale-95"
                          >
                            {word}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center gap-3">
                    {currentQuestion.words?.map(
                      (word, index) => {
                        const usedCount =
                          selectedWords.filter(
                            (item) =>
                              item === word
                          ).length;

                        const totalCount =
                          currentQuestion.words?.filter(
                            (item) =>
                              item === word
                          ).length || 0;

                        const disabled =
                          usedCount >=
                          totalCount;

                        return (
                          <button
                            key={`${word}-${index}`}
                            disabled={
                              disabled ||
                              answered
                            }
                            onClick={() =>
                              handleWordClick(
                                word
                              )
                            }
                            className="rounded-xl border border-gray-200 bg-white px-5 py-3 font-bold shadow-sm transition hover:-translate-y-[2px] hover:shadow-md active:scale-95 disabled:opacity-30"
                          >
                            {word}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
              )}

              {/* LISTENING */}
              {currentQuestion.type ===
                "listening" && (
                <div className="space-y-6">
                  <div className="flex flex-col items-center rounded-3xl bg-white p-10 shadow-sm">
                    <button
                      onClick={() =>
                        speak(
                          currentQuestion.word
                        )
                      }
                      className="flex h-24 w-24 items-center justify-center rounded-full bg-[#5B5FEF] text-4xl text-white shadow-lg transition hover:scale-105 active:scale-95"
                    >
                      🔊
                    </button>

                    <p className="mt-5 text-[#737789]">
                      Listen carefully.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {currentQuestion.options?.map(
                      (option) => (
                        <button
                          key={option}
                          disabled={answered}
                          onClick={() =>
                            answerQuestion(
                              option
                            )
                          }
                          className={`rounded-2xl border bg-white p-5 font-bold transition hover:-translate-y-[1px] active:scale-[0.98] ${
                            answered &&
                            option ===
                              currentQuestion.correct
                              ? "animate-option-correct border-green-500 bg-green-50"
                              : "border-gray-200"
                          }`}
                        >
                          {option}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* FILL BLANK */}
              {currentQuestion.type ===
                "fill-blank" && (
                <div className="space-y-5">
                  <div className="rounded-3xl bg-white p-8 text-center text-2xl font-bold shadow-sm">
                    {currentQuestion.question}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {currentQuestion.options?.map(
                      (option) => (
                        <button
                          key={option}
                          disabled={answered}
                          onClick={() =>
                            answerQuestion(
                              option
                            )
                          }
                          className={`rounded-2xl border bg-white p-5 font-bold transition hover:-translate-y-[1px] active:scale-[0.98] ${
                            answered &&
                            option ===
                              currentQuestion.correct
                              ? "animate-option-correct border-green-500 bg-green-50"
                              : "border-gray-200"
                          }`}
                        >
                          {option}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* MEMORY */}
              {currentQuestion.type ===
                "memory" && (
                <div className="space-y-5">
                  <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
                    <div className="text-xl text-[#737789]">
                      Vietnamese meaning
                    </div>

                    <div className="mt-3 text-3xl font-extrabold">
                      quyển sách
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {currentQuestion.options?.map(
                      (option) => (
                        <button
                          key={option}
                          disabled={answered}
                          onClick={() =>
                            answerQuestion(
                              option
                            )
                          }
                          className={`rounded-2xl border bg-white p-5 font-bold transition hover:-translate-y-[1px] active:scale-[0.98] ${
                            answered &&
                            option ===
                              currentQuestion.correct
                              ? "animate-option-correct border-green-500 bg-green-50"
                              : "border-gray-200"
                          }`}
                        >
                          {option}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* FEEDBACK */}
              {answered &&
                answerStatus && (
                  <div className="mt-7 animate-pop">
                    {answerStatus ===
                      "correct" && (
                      <div className="rounded-3xl border border-green-200 bg-green-50 p-6">
                        <div className="flex items-start gap-4">
                          <div className="animate-check flex h-11 w-11 items-center justify-center rounded-full bg-green-500 text-xl text-white">
                            ✓
                          </div>

                          <div className="flex-1">
                            <div className="text-xl font-extrabold text-green-700">
                              Correct
                            </div>

                            <p className="mt-1 text-green-700">
                              You got it right.
                            </p>

                            <div className="mt-4 flex flex-wrap gap-3">
                              <span className="relative inline-flex items-center rounded-full bg-white px-4 py-2 font-bold text-green-700">
                                +{currentQuestion.xp || 0} XP
                                {xpPulse && (
                                  <span className="xp-toast">+{currentQuestion.xp || 0} XP</span>
                                )}
                              </span>

                              <span className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 font-bold text-green-700">
                                <span>🔥</span>
                                <span>{strike} streak</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {answerStatus ===
                      "almost" && (
                      <div className="rounded-3xl border border-orange-200 bg-orange-50 p-6">
                        <div className="flex items-start gap-4">
                          <div className="text-3xl">
                            💡
                          </div>

                          <div className="flex-1">
                            <div className="text-xl font-extrabold text-orange-700">
                              Almost!
                            </div>

                            <p className="mt-2 text-orange-800">
                              Your meaning is close,
                              but there is a small
                              language mistake.
                            </p>

                            {selectedAnswer && (
                              <div className="mt-4 rounded-2xl bg-white p-4">
                                <div className="text-sm text-[#737789]">
                                  Your answer
                                </div>

                                <div className="mt-1 font-bold">
                                  {selectedAnswer}
                                </div>
                              </div>
                            )}

                            <div className="mt-3 rounded-2xl bg-white p-4">
                              <div className="text-sm text-[#737789]">
                                Correct answer
                              </div>

                              <div className="mt-1 font-bold text-green-700">
                                {
                                  currentQuestion.correct
                                }
                              </div>
                            </div>

                            {feedbackMessage && (
                              <div className="mt-3 rounded-2xl bg-orange-100 p-4 text-sm font-medium text-orange-900">
                                <strong>
                                  Why?
                                </strong>{" "}
                                {feedbackMessage}
                              </div>
                            )}

                            <div className="mt-4 text-sm font-bold text-orange-700">
                              No XP for this attempt. Keep going!
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {answerStatus ===
                      "wrong" && (
                      <div className="micro-shake rounded-3xl border border-red-200 bg-red-50 p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-500 text-xl text-white">
                            ×
                          </div>

                          <div className="flex-1">
                            <div className="text-xl font-extrabold text-red-700">
                              Not quite
                            </div>

                            <p className="mt-1 text-red-700">
                              Keep going. Mistakes are part of learning.
                            </p>

                            <div className="mt-4 rounded-2xl bg-white p-4">
                              <div className="text-sm text-[#737789]">
                                Correct answer
                              </div>

                              <div className="mt-1 font-bold text-green-700">
                                {
                                  currentQuestion.correct
                                }
                              </div>
                            </div>

                            {feedbackMessage && (
                              <div className="mt-3 rounded-2xl bg-red-100 p-4 text-sm font-medium text-red-900">
                                <strong>
                                  Why?
                                </strong>{" "}
                                {feedbackMessage}
                              </div>
                            )}

                            <div className="mt-4 text-sm font-bold text-red-700">
                              🔥 Strike reset to 0
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={
                        continueQuestion
                      }
                      className="group mt-4 w-full rounded-2xl bg-[#5B5FEF] px-6 py-4 font-bold text-white transition hover:bg-[#4548C7] active:scale-[0.98]"
                    >
                      <span className="inline-flex items-center gap-2">
                        Continue
                        <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                      </span>
                    </button>
                  </div>
                )}
            </section>
          )}

        {/* REVIEW */}
        {stage === "review" && (
          <section className="animate-slide">
            <div className="text-center">
              <div className="text-5xl">
                🔁
              </div>

              <h1 className="mt-4 text-3xl font-extrabold">
                Review your mistakes
              </h1>

              <p className="mt-2 text-[#737789]">
                Let&apos;s strengthen the words
                that were difficult.
              </p>
            </div>

            <div className="mt-8 rounded-3xl bg-white p-8 text-center shadow-sm">
              <div className="text-sm font-bold uppercase tracking-wider text-[#5B5FEF]">
                Word to review
              </div>

              <div className="mt-3 text-4xl font-extrabold">
                {mistakes[reviewIndex]}
              </div>

              <div className="mt-3 text-[#737789]">
                {
                  vocabulary.find(
                    (item) =>
                      item.word ===
                      mistakes[reviewIndex]
                  )?.meaning
                }
              </div>

              <button
                onClick={() =>
                  speak(
                    mistakes[reviewIndex]
                  )
                }
                className="mt-5 rounded-xl bg-[#EEF0FF] px-5 py-3 font-bold text-[#4548C7]"
              >
                🔊 Listen
              </button>

              <button
                onClick={() => {
                  playSound("click");

                  if (
                    reviewIndex <
                    mistakes.length - 1
                  ) {
                    setReviewIndex(
                      (previous) =>
                        previous + 1
                    );
                  } else {
                    finishReview();
                  }
                }}
                className="mt-6 w-full rounded-2xl bg-[#5B5FEF] px-6 py-4 font-bold text-white transition hover:bg-[#4548C7] active:scale-[0.98]"
              >
                {reviewIndex <
                mistakes.length - 1
                  ? "Next mistake →"
                  : "Start final challenge →"}
              </button>
            </div>

            <div className="mt-5 text-center text-sm text-[#737789]">
              Review {reviewIndex + 1} of{" "}
              {mistakes.length}
            </div>
          </section>
        )}

        {/* FINAL CHALLENGE */}
        {stage === "final" &&
          currentFinalQuestion && (
            <section className="animate-slide">
              <div className="mb-8 text-center">
                <div className="text-5xl">
                  🏆
                </div>

                <h1 className="mt-3 text-3xl font-extrabold">
                  Final Challenge
                </h1>

                <p className="mt-2 text-[#737789]">
                  Show what you remember.
                </p>
              </div>

              <div className="rounded-3xl bg-white p-8 shadow-sm">
                <div className="text-sm font-bold text-[#5B5FEF]">
                  Challenge{" "}
                  {finalIndex + 1}/
                  {finalQuestions.length}
                </div>

                <h2 className="mt-3 text-2xl font-extrabold">
                  {
                    currentFinalQuestion.question
                  }
                </h2>

                {/* FIXED FINAL IMAGE */}
                {currentFinalQuestion.type ===
                  "image-choice" && (
                  <div
                    className={`mt-6 flex h-56 items-center justify-center rounded-3xl bg-[#EEF0FF] text-9xl ${
                      answered &&
                      answerStatus ===
                        "correct"
                        ? "animate-image-success"
                        : "animate-float"
                    }`}
                  >
                    {finalImage}
                  </div>
                )}

                {currentFinalQuestion.type ===
                  "translation" && (
                  <div className="mt-6">
                    <input
                      disabled={answered}
                      value={selectedAnswer}
                      onChange={(event) =>
                        setSelectedAnswer(
                          event.target.value
                        )
                      }
                      onKeyDown={(event) => {
                        if (
                          event.key ===
                            "Enter" &&
                          !answered
                        ) {
                          answerFinalQuestion(
                            selectedAnswer
                          );
                        }
                      }}
                      placeholder="Type your answer..."
                      className="w-full rounded-2xl border border-gray-200 px-5 py-4 text-lg outline-none focus:border-[#5B5FEF] focus:ring-4 focus:ring-[#5B5FEF]/10"
                    />

                    {!answered && (
                      <button
                        onClick={() =>
                          answerFinalQuestion(
                            selectedAnswer
                          )
                        }
                        disabled={
                          !selectedAnswer.trim()
                        }
                        className="mt-4 w-full rounded-2xl bg-[#5B5FEF] px-6 py-4 font-bold text-white disabled:opacity-40"
                      >
                        Check
                      </button>
                    )}
                  </div>
                )}

                {currentFinalQuestion.type !==
                  "translation" && (
                  <div className="mt-6 grid gap-3">
                    {currentFinalQuestion.options?.map(
                      (option) => (
                        <button
                          key={option}
                          disabled={answered}
                          onClick={() =>
                            answerFinalQuestion(
                              option
                            )
                          }
                          className={`rounded-2xl border p-5 text-left font-bold transition hover:-translate-y-[1px] active:scale-[0.98] ${
                            answered &&
                            option ===
                              currentFinalQuestion.correct
                              ? "animate-option-correct border-green-500 bg-green-50"
                              : "border-gray-200"
                          }`}
                        >
                          {option}
                        </button>
                      )
                    )}
                  </div>
                )}

                {answered && (
                  <div className="mt-6 animate-pop">
                    {answerStatus ===
                      "correct" ? (
                      <div className="rounded-2xl bg-green-50 p-5 text-green-800">
                        <div className="text-xl font-extrabold">
                          🎉 Correct!
                        </div>

                        <p className="mt-1">
                          Great memory.
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-2xl bg-red-50 p-5 text-red-800">
                        <div className="text-xl font-extrabold">
                          Keep going!
                        </div>

                        <p className="mt-2">
                          Correct answer:{" "}
                          <strong>
                            {
                              currentFinalQuestion.correct
                            }
                          </strong>
                        </p>

                        {feedbackMessage && (
                          <p className="mt-2 text-sm">
                            {feedbackMessage}
                          </p>
                        )}
                      </div>
                    )}

                    <button
                      onClick={
                        continueFinal
                      }
                      className="mt-4 w-full rounded-2xl bg-[#5B5FEF] px-6 py-4 font-bold text-white"
                    >
                      {finalIndex <
                      finalQuestions.length - 1
                        ? "Next challenge →"
                        : "Finish lesson 🎉"}
                    </button>
                  </div>
                )}
              </div>
            </section>
          )}

        {/* COMPLETE */}
        {stage === "complete" && (
          <section className="animate-finish text-center">
            <div className="mx-auto max-w-xl rounded-[32px] bg-white p-10 shadow-sm">
              <div className="text-7xl">
                🎉
              </div>

              <h1 className="mt-5 text-4xl font-extrabold">
                Lesson Complete!
              </h1>

              <p className="mt-3 text-[#737789]">
                You finished My First English
                Words.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-[#F7F8FC] p-5">
                  <div className="text-sm text-[#737789]">
                    XP earned
                  </div>

                  <div className="mt-1 text-3xl font-extrabold text-[#5B5FEF]">
                    {earnedTotal}
                  </div>
                </div>

                <div className="rounded-2xl bg-[#F7F8FC] p-5">
                  <div className="text-sm text-[#737789]">
                    Best strike
                  </div>

                  <div className="mt-1 text-3xl font-extrabold">
                    🔥 {maxStrike}
                  </div>
                </div>

                <div className="rounded-2xl bg-[#F7F8FC] p-5">
                  <div className="text-sm text-[#737789]">
                    Words studied
                  </div>

                  <div className="mt-1 text-3xl font-extrabold">
                    {vocabulary.length}
                  </div>
                </div>

                <div className="rounded-2xl bg-[#F7F8FC] p-5">
                  <div className="text-sm text-[#737789]">
                    Accuracy
                  </div>

                  <div className="mt-1 text-3xl font-extrabold">
                    {accuracy}%
                  </div>
                </div>
              </div>

              {mistakes.length > 0 && (
                <div className="mt-5 rounded-2xl bg-orange-50 p-5 text-left">
                  <div className="font-extrabold text-orange-800">
                    📚 Words to review
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {mistakes.map(
                      (mistake) => (
                        <span
                          key={mistake}
                          className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-orange-800"
                        >
                          {mistake}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}

              <div className="mt-8 rounded-2xl bg-[#EEF0FF] p-5">
                <div className="text-lg font-extrabold text-[#4548C7]">
                  🌱 Vocabulary progress
                </div>

                <p className="mt-1 text-sm text-[#737789]">
                  You studied {vocabulary.length}{" "}
                  new words. Mastery will improve
                  as you review them again.
                </p>
              </div>

              <button
                onClick={() => {
                  playSound("click");

                  setStage("learn");
                  setVocabIndex(0);
                  setQuestionIndex(0);
                  setFinalIndex(0);
                  setLessonXP(0);
                  setStrike(0);
                  setMaxStrike(0);
                  setMistakes([]);
                  setReviewIndex(0);
                  setSelectedAnswer("");
                  setSelectedWords([]);
                  setAnswered(false);
                  setCorrect(false);
                  setAnswerStatus(null);
                  setFeedbackMessage("");
                  setComboMilestone(null);
                }}
                className="mt-8 w-full rounded-2xl bg-[#5B5FEF] px-6 py-4 font-bold text-white transition hover:bg-[#4548C7] active:scale-[0.98]"
              >
                Learn again
              </button>
            </div>
          </section>
        )}
      </div>

      {/* OPTIONAL REVIEW MODAL */}
      {showReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-xl">
            <div className="text-3xl">
              🔁
            </div>

            <h2 className="mt-3 text-2xl font-extrabold">
              Review mistakes
            </h2>

            <p className="mt-2 text-[#737789]">
              You have {mistakes.length} word
              {mistakes.length > 1
                ? "s"
                : ""} to review.
            </p>

            <button
              onClick={() => {
                setShowReview(false);
                setStage("review");
                setReviewIndex(0);
              }}
              className="mt-6 w-full rounded-2xl bg-[#5B5FEF] px-6 py-4 font-bold text-white"
            >
              Start review
            </button>
          </div>
        </div>
      )}

      {/* FINAL MODAL PLACEHOLDER */}
      {showFinal && stage === "final" && (
        <div className="pointer-events-none fixed inset-0 z-40" />
      )}
    </main>
  );
}