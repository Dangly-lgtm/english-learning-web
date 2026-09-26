"use client";

import { useState } from "react";

export default function Home() {
  const [xp, setXp] = useState(0);

  return (
    <main className="min-h-screen bg-green-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-green-600">
            English Learning
          </h1>

          <div className="flex gap-5 font-semibold">
            <span>🔥 0</span>
            <span>⭐ {xp} XP</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-10">
          <p className="mb-2 text-green-600 font-semibold">
            WELCOME BACK 👋
          </p>

          <h2 className="text-4xl font-bold text-gray-900">
            Learn English every day.
          </h2>

          <p className="mt-3 text-gray-600">
            Improve your vocabulary, grammar and English skills step by step.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-3 flex justify-between">
            <span className="font-semibold">Today's progress</span>
            <span className="text-gray-500">{xp}/20 XP</span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-green-500 transition-all"
              style={{ width: `${Math.min(xp * 5, 100)}%` }}
            />
          </div>
        </div>

        {/* Lesson */}
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <div className="mb-6">
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
              LESSON 1
            </span>

            <h3 className="mt-4 text-2xl font-bold">
              Everyday English
            </h3>

            <p className="mt-2 text-gray-600">
              Learn useful English words and phrases for everyday situations.
            </p>
          </div>

          <button
            onClick={() => setXp((current) => Math.min(current + 5, 20))}
            className="rounded-xl bg-green-600 px-6 py-3 font-bold text-white transition hover:bg-green-700"
          >
            Start Learning →
          </button>
        </div>
      </section>
    </main>
  );
}
