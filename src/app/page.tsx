"use client";

import { useEffect, useRef, useState } from "react";

const words = [
  { en: "wake up", vi: "thức dậy" },
  { en: "eat breakfast", vi: "ăn sáng" },
  { en: "go to school", vi: "đi học" },
  { en: "study", vi: "học" },
  { en: "go home", vi: "về nhà" },
];

const buildWords = ["breakfast", "I", "eat", "morning", "in", "the"];

export default function Home() {
  const [step, setStep] = useState(1);
  const [wordIndex, setWordIndex] = useState(0);
  const [xp, setXp] = useState(0);
  const [message, setMessage] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [translate, setTranslate] = useState("");
  const [sentence, setSentence] = useState<string[]>([]);
  const [recording, setRecording] = useState(false);

  const recorderRef = useRef<MediaRecorder | null>(null);

  function speak(text: string) {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.85;

      window.speechSynthesis.speak(utterance);
    }
  }

  function next() {
    setMessage("");
    setSelectedAnswer("");
    setStep((current) => current + 1);
  }

  function checkMultipleChoice(answer: string) {
    setSelectedAnswer(answer);

    if (answer === "B") {
      setMessage("correct");
      setXp((current) => current + 2);
    } else {
      setMessage("wrong");
    }
  }

  function checkTranslate() {
    const answer = translate.trim().toLowerCase().replace(/[.!?]/g, "");

    if (
      answer === "i go to school every day" ||
      answer === "i go to school everyday"
    ) {
      setMessage("correct");
      setXp((current) => current + 2);
    } else {
      setMessage("wrong");
    }
  }

  // Add a word to the sentence
  function addWord(word: string) {
    if (!sentence.includes(word)) {
      setSentence((current) => [...current, word]);
    }
  }

  // Remove a word from the sentence by clicking it again
  function removeWord(index: number) {
    setSentence((current) =>
      current.filter((_, wordIndex) => wordIndex !== index)
    );
  }

  function resetSentence() {
    setSentence([]);
    setMessage("");
  }

  function checkSentence() {
    const answer = sentence.join(" ");

    if (answer === "I eat breakfast in the morning") {
      setMessage("correct");
      setXp((current) => current + 3);
    } else {
      setMessage("wrong");
    }
  }

  function startRecording() {
    if (!navigator.mediaDevices?.getUserMedia) {
      setMessage("Recording is not supported in this browser.");
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream);
        recorderRef.current = recorder;

        recorder.start();
        setRecording(true);

        recorder.onstop = () => {
          stream.getTracks().forEach((track) => track.stop());
        };
      })
      .catch(() => {
        setMessage("Microphone permission was not granted.");
      });
  }

  function stopRecording() {
    recorderRef.current?.stop();
    setRecording(false);
    setMessage("Recording saved for this session 🎤");
  }

  useEffect(() => {
    if (step === 10) {
      setXp(20);
    }
  }, [step]);

  return (
    <main className="min-h-screen bg-green-50 text-gray-900">
      {/* HEADER */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-extrabold text-green-700">
            English Learning
          </h1>

          <div className="flex gap-5 font-bold text-gray-800">
            <span>🔥 1</span>
            <span>⭐ {xp} XP</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-8">
        {/* PROGRESS */}
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-sm font-bold text-gray-800">
            <span>Lesson 1: Everyday English</span>
            <span>{Math.min(step, 10)}/10</span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-gray-300">
            <div
              className="h-full rounded-full bg-green-600 transition-all"
              style={{ width: `${Math.min((step / 10) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-md">
            <p className="font-extrabold text-green-700">
              🟢 LESSON 1
            </p>

            <h2 className="mt-2 text-3xl font-extrabold text-gray-950">
              Everyday English
            </h2>

            <p className="mt-2 font-medium text-gray-700">
              Level: Beginner · Topic: Daily activities · XP: 20
            </p>

            <div className="my-8 rounded-2xl bg-green-50 p-5">
              <h3 className="text-xl font-extrabold text-gray-900">
                🎯 Mục tiêu
              </h3>

              <p className="mt-2 font-medium text-gray-700">
                Học 5 từ + luyện nghe + dịch + sắp xếp câu.
              </p>
            </div>

            <button
              onClick={next}
              className="w-full rounded-xl bg-green-700 py-4 font-extrabold text-white shadow-sm transition hover:bg-green-800"
            >
              Start Lesson →
            </button>
          </section>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-md">
            <p className="font-extrabold text-green-700">
              1️⃣ Learn the words
            </p>

            <h2 className="mt-3 text-4xl font-extrabold text-gray-950">
              {words[wordIndex].en}
            </h2>

            <p className="mt-3 text-xl font-semibold text-gray-700">
              → {words[wordIndex].vi}
            </p>

            <button
              onClick={() => speak(words[wordIndex].en)}
              className="mt-6 rounded-xl border-2 border-green-600 bg-green-50 px-5 py-3 font-extrabold text-green-800 transition hover:bg-green-100"
            >
              🔊 Listen
            </button>

            <div className="mt-8 flex items-center justify-between">
              <span className="font-bold text-gray-700">
                {wordIndex + 1} / {words.length}
              </span>

              <button
                onClick={() => {
                  if (wordIndex < words.length - 1) {
                    setWordIndex((current) => current + 1);
                  } else {
                    next();
                  }
                }}
                className="rounded-xl bg-green-700 px-6 py-3 font-extrabold text-white hover:bg-green-800"
              >
                {wordIndex < words.length - 1 ? "Next →" : "Continue →"}
              </button>
            </div>
          </section>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-md">
            <p className="font-extrabold text-green-700">
              2️⃣ Multiple Choice
            </p>

            <h2 className="mt-4 text-2xl font-extrabold text-gray-950">
              What does &quot;wake up&quot; mean?
            </h2>

            <div className="mt-6 space-y-3">
              {[
                ["A", "đi ngủ"],
                ["B", "thức dậy"],
                ["C", "đi học"],
                ["D", "về nhà"],
              ].map(([letter, text]) => (
                <button
                  key={letter}
                  onClick={() => checkMultipleChoice(letter)}
                  className={`w-full rounded-xl border-2 p-4 text-left font-bold transition ${
                    selectedAnswer === letter
                      ? letter === "B"
                        ? "border-green-600 bg-green-100 text-green-900"
                        : "border-red-500 bg-red-50 text-red-800"
                      : "border-gray-300 bg-white text-gray-900 hover:border-green-500 hover:bg-green-50"
                  }`}
                >
                  {letter}. {text}
                </button>
              ))}
            </div>

            {message === "correct" && (
              <div className="mt-5 rounded-xl border border-green-300 bg-green-50 p-4 font-semibold text-green-800">
                <strong>✅ Correct!</strong>
                <p>wake up = thức dậy</p>
                <p>+2 XP</p>
              </div>
            )}

            {message === "wrong" && (
              <div className="mt-5 rounded-xl border border-red-300 bg-red-50 p-4 font-semibold text-red-800">
                <strong>❌ Not quite!</strong>
                <p>The correct answer is B. thức dậy</p>
              </div>
            )}

            {selectedAnswer && (
              <button
                onClick={next}
                className="mt-6 w-full rounded-xl bg-green-700 py-3 font-extrabold text-white hover:bg-green-800"
              >
                Continue →
              </button>
            )}
          </section>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-md">
            <p className="font-extrabold text-green-700">
              3️⃣ Listen & Choose 🎧
            </p>

            <h2 className="mt-4 text-2xl font-extrabold text-gray-950">
              Listen to the word
            </h2>

            <button
              onClick={() => speak("go to school")}
              className="mt-5 rounded-xl border-2 border-green-600 bg-green-50 px-6 py-4 text-lg font-extrabold text-green-800 hover:bg-green-100"
            >
              🔊 Play
            </button>

            <p className="mt-7 font-extrabold text-gray-950">
              Choose what you hear:
            </p>

            <div className="mt-4 space-y-3">
              {[
                "go home",
                "go to school",
                "eat breakfast",
                "wake up",
              ].map((answer) => (
                <button
                  key={answer}
                  onClick={() => {
                    if (answer === "go to school") {
                      setMessage("correct");
                      setXp((current) => current + 2);
                    } else {
                      setMessage("wrong");
                    }
                  }}
                  className="w-full rounded-xl border-2 border-gray-300 bg-white p-4 text-left font-bold text-gray-900 hover:border-green-500 hover:bg-green-50"
                >
                  {answer}
                </button>
              ))}
            </div>

            {message === "correct" && (
              <div className="mt-5 rounded-xl bg-green-50 p-4 font-bold text-green-800">
                ✅ Correct! +2 XP
              </div>
            )}

            {message === "wrong" && (
              <div className="mt-5 rounded-xl bg-red-50 p-4 font-bold text-red-800">
                ❌ Not quite. Try again!
              </div>
            )}

            {message === "correct" && (
              <button
                onClick={next}
                className="mt-6 w-full rounded-xl bg-green-700 py-3 font-extrabold text-white hover:bg-green-800"
              >
                Continue →
              </button>
            )}
          </section>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-md">
            <p className="font-extrabold text-green-700">
              4️⃣ Translate
            </p>

            <h2 className="mt-5 text-2xl font-extrabold text-gray-950">
              Translate this sentence
            </h2>

            <div className="mt-4 rounded-2xl bg-green-50 p-5">
              <p className="text-xl font-bold text-gray-950">
                Tôi đi học mỗi ngày.
              </p>
            </div>

            <p className="mt-7 font-extrabold text-gray-950">
              Your answer
            </p>

            <input
              value={translate}
              onChange={(e) => setTranslate(e.target.value)}
              placeholder="Type your answer..."
              className="mt-3 w-full rounded-xl border-2 border-gray-300 px-4 py-4 text-lg font-semibold text-gray-950 outline-none placeholder:text-gray-500 focus:border-green-600"
            />

            <button
              onClick={checkTranslate}
              className="mt-4 w-full rounded-xl bg-green-700 py-3 font-extrabold text-white hover:bg-green-800"
            >
              Check
            </button>

            {message === "correct" && (
              <div className="mt-5 rounded-xl bg-green-50 p-4 font-bold text-green-800">
                <strong>✅ Correct!</strong>
                <p>I go to school every day.</p>
                <p>+2 XP</p>
              </div>
            )}

            {message === "wrong" && (
              <div className="mt-5 rounded-xl bg-red-50 p-4 font-bold text-red-800">
                ❌ Not quite. Try: I go to school every day.
              </div>
            )}

            {message && (
              <button
                onClick={next}
                className="mt-6 w-full rounded-xl bg-green-700 py-3 font-extrabold text-white hover:bg-green-800"
              >
                Continue →
              </button>
            )}
          </section>
        )}

        {/* STEP 6 BUILD SENTENCE */}
        {step === 6 && (
          <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-md">
            <p className="font-extrabold text-green-700">
              5️⃣ Build the sentence 🧩
            </p>

            <h2 className="mt-5 text-2xl font-extrabold text-gray-950">
              Make a correct sentence
            </h2>

            <div className="mt-4 rounded-2xl bg-green-50 p-5">
              <p className="text-xl font-bold text-gray-950">
                Tôi ăn sáng vào buổi sáng.
              </p>
            </div>

            {/* YOUR ANSWER */}
            <div className="mt-7">
              <p className="mb-3 font-extrabold text-gray-950">
                Your answer
              </p>

              <div className="flex min-h-20 flex-wrap gap-3 rounded-2xl border-2 border-dashed border-gray-400 bg-gray-50 p-4">
                {sentence.length === 0 ? (
                  <span className="self-center font-semibold text-gray-500">
                    Click the words below...
                  </span>
                ) : (
                  sentence.map((word, index) => (
                    <button
                      key={`${word}-${index}`}
                      onClick={() => removeWord(index)}
                      title="Click to remove"
                      className="rounded-xl border-2 border-green-600 bg-green-100 px-4 py-3 font-extrabold text-green-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-green-200"
                    >
                      {word}
                    </button>
                  ))
                )}
              </div>

              <p className="mt-2 text-sm font-semibold text-gray-600">
                💡 Click a word in your answer to remove it.
              </p>
            </div>

            {/* WORD BANK */}
            <div className="mt-7">
              <p className="mb-3 font-extrabold text-gray-950">
                Word bank
              </p>

              <div className="flex flex-wrap gap-3">
                {buildWords
                  .filter((word) => !sentence.includes(word))
                  .map((word) => (
                    <button
                      key={word}
                      onClick={() => addWord(word)}
                      className="rounded-xl border-2 border-gray-400 bg-white px-4 py-3 font-extrabold text-gray-900 shadow-sm transition hover:-translate-y-0.5 hover:border-green-600 hover:bg-green-50"
                    >
                      {word}
                    </button>
                  ))}
              </div>
            </div>

            <div className="mt-7 flex gap-3">
              <button
                onClick={resetSentence}
                className="flex-1 rounded-xl border-2 border-gray-300 bg-white py-3 font-extrabold text-gray-800 hover:bg-gray-100"
              >
                Reset
              </button>

              <button
                onClick={checkSentence}
                className="flex-1 rounded-xl bg-green-700 py-3 font-extrabold text-white hover:bg-green-800"
              >
                Check
              </button>
            </div>

            {message === "correct" && (
              <div className="mt-5 rounded-xl bg-green-50 p-4 font-bold text-green-800">
                🎉 Correct! +3 XP
              </div>
            )}

            {message === "wrong" && (
              <div className="mt-5 rounded-xl bg-red-50 p-4 font-bold text-red-800">
                ❌ Not quite. Try again!
              </div>
            )}

            {message === "correct" && (
              <button
                onClick={next}
                className="mt-6 w-full rounded-xl bg-green-700 py-3 font-extrabold text-white hover:bg-green-800"
              >
                Continue →
              </button>
            )}
          </section>
        )}

        {/* STEP 7 */}
        {step === 7 && (
          <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-md">
            <p className="font-extrabold text-green-700">
              6️⃣ Fill in the blank
            </p>

            <h2 className="mt-5 text-2xl font-extrabold text-gray-950">
              I ___ up at 6 a.m. every day.
            </h2>

            <div className="mt-6 space-y-3">
              {["eat", "go", "wake", "study"].map((answer) => (
                <button
                  key={answer}
                  onClick={() => {
                    if (answer === "wake") {
                      setMessage("correct");
                      setXp((current) => current + 2);
                    } else {
                      setMessage("wrong");
                    }
                  }}
                  className="w-full rounded-xl border-2 border-gray-300 bg-white p-4 text-left font-bold text-gray-900 hover:border-green-500 hover:bg-green-50"
                >
                  {answer}
                </button>
              ))}
            </div>

            {message === "correct" && (
              <div className="mt-5 rounded-xl bg-green-50 p-4 font-bold text-green-800">
                ✅ Correct! The answer is <strong>wake</strong>.
              </div>
            )}

            {message === "wrong" && (
              <div className="mt-5 rounded-xl bg-red-50 p-4 font-bold text-red-800">
                ❌ Not quite. The correct answer is C. wake.
              </div>
            )}

            {message === "correct" && (
              <button
                onClick={next}
                className="mt-6 w-full rounded-xl bg-green-700 py-3 font-extrabold text-white hover:bg-green-800"
              >
                Continue →
              </button>
            )}
          </section>
        )}

        {/* STEP 8 */}
        {step === 8 && (
          <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-md">
            <p className="font-extrabold text-green-700">
              7️⃣ Listening 🎧
            </p>

            <button
              onClick={() =>
                speak(
                  "I wake up at six o'clock and eat breakfast."
                )
              }
              className="mt-6 rounded-xl bg-green-700 px-8 py-4 font-extrabold text-white hover:bg-green-800"
            >
              ▶ Play
            </button>

            <p className="mt-7 text-lg font-extrabold text-gray-950">
              I wake up at six o'clock and eat breakfast.
            </p>

            <h2 className="mt-8 text-2xl font-extrabold text-gray-950">
              What does the speaker do after waking up?
            </h2>

            <div className="mt-6 space-y-3">
              {[
                "Goes to school",
                "Eats breakfast",
                "Goes home",
                "Studies",
              ].map((answer) => (
                <button
                  key={answer}
                  onClick={() => {
                    if (answer === "Eats breakfast") {
                      setMessage("correct");
                      setXp((current) => current + 2);
                    } else {
                      setMessage("wrong");
                    }
                  }}
                  className="w-full rounded-xl border-2 border-gray-300 bg-white p-4 text-left font-bold text-gray-900 hover:border-green-500 hover:bg-green-50"
                >
                  {answer}
                </button>
              ))}
            </div>

            {message === "correct" && (
              <div className="mt-5 rounded-xl bg-green-50 p-4 font-bold text-green-800">
                ✅ Correct! +2 XP
              </div>
            )}

            {message === "wrong" && (
              <div className="mt-5 rounded-xl bg-red-50 p-4 font-bold text-red-800">
                ❌ Not quite. The answer is B. Eats breakfast.
              </div>
            )}

            {message === "correct" && (
              <button
                onClick={next}
                className="mt-6 w-full rounded-xl bg-green-700 py-3 font-extrabold text-white hover:bg-green-800"
              >
                Continue →
              </button>
            )}
          </section>
        )}

        {/* STEP 9 */}
        {step === 9 && (
          <section className="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-md">
            <p className="text-5xl">🎤</p>

            <p className="mt-4 font-extrabold text-green-700">
              8️⃣ Speaking
            </p>

            <h2 className="mt-4 text-3xl font-extrabold text-gray-950">
              Say this sentence
            </h2>

            <div className="mt-5 rounded-2xl bg-green-50 p-5">
              <p className="text-xl font-bold text-gray-950">
                &quot;I go to school every day.&quot;
              </p>
            </div>

            <button
              onClick={() =>
                recording ? stopRecording() : startRecording()
              }
              className={`mt-8 rounded-xl px-8 py-4 font-extrabold text-white ${
                recording
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-700 hover:bg-green-800"
              }`}
            >
              {recording
                ? "⏹ Stop recording"
                : "🎤 Hold to speak"}
            </button>

            {message && (
              <p className="mt-5 font-semibold text-green-700">
                {message}
              </p>
            )}

            <button
              onClick={() => setStep(10)}
              className="mt-8 w-full rounded-xl bg-green-700 py-3 font-extrabold text-white hover:bg-green-800"
            >
              Continue →
            </button>
          </section>
        )}

        {/* STEP 10 */}
        {step === 10 && (
          <section className="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-md">
            <div className="text-6xl">🎉</div>

            <h2 className="mt-5 text-3xl font-extrabold text-gray-950">
              Lesson Complete!
            </h2>

            <p className="mt-3 text-xl font-extrabold text-green-700">
              20 XP earned
            </p>

            <p className="mt-2 font-semibold text-gray-700">
              🔥 1 lesson completed
            </p>

            <div className="mt-8 rounded-2xl bg-green-50 p-6 text-left">
              <h3 className="font-extrabold text-gray-950">
                Words learned
              </h3>

              <ul className="mt-4 space-y-2 font-semibold text-gray-800">
                {words.map((word) => (
                  <li key={word.en}>✓ {word.en}</li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <div className="mb-2 flex justify-between text-sm font-extrabold text-gray-800">
                <span>Progress</span>
                <span>100%</span>
              </div>

              <div className="h-4 overflow-hidden rounded-full bg-gray-300">
                <div className="h-full w-full rounded-full bg-green-600" />
              </div>
            </div>

            <button
              onClick={() => {
                setStep(1);
                setWordIndex(0);
                setXp(0);
                setSentence([]);
                setMessage("");
                setSelectedAnswer("");
                setTranslate("");
              }}
              className="mt-8 w-full rounded-xl bg-green-700 py-4 font-extrabold text-white hover:bg-green-800"
            >
              Continue →
            </button>
          </section>
        )}
      </div>
    </main>
  );
}