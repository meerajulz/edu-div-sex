'use client'

import React, { useState } from 'react';
import { Question, questionsData } from "../../data/questions";

export default function AddUser() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [questions, setQuestions] = useState<Question[]>(questionsData);
  const [error, setError] = useState('');

  // Handle TIPO DE APOYO change
  const handleSupportTypeChange = (id: number, value: "1" | "0") => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? { ...q, supportType: value, frequency: value === "1" ? null : q.frequency }
          : q
      )
    );
  };

  // Handle FRECUENCIA change
  const handleFrequencyChange = (id: number, value: "1" | "0") => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, frequency: value } : q))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !username || !password) {
      setError('Please fill in all fields.');
      return;
    }
    // Handle form submission
  };

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}
        
        {/* User Information Form */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
          <h2 className="text-2xl font-bold mb-6">Add New User</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                USERNAME
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                required
              />
            </div>
          </div>
        </div>

        {/* Evaluation Form */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Evaluación de Nivel</h2>
          {questions.map((q) => (
            <div key={q.id} className="mb-6 p-4 border border-gray-100 rounded-lg">
              {/* Question Text */}
              <label className="block text-gray-700 font-medium mb-4">{q.question}</label>

              {/* TIPO DE APOYO */}
              <div className="mb-4">
                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`supportType-${q.id}`}
                      value="1"
                      checked={q.supportType === "1"}
                      onChange={(e) => handleSupportTypeChange(q.id, e.target.value as "1" | "0")}
                      className="form-radio h-4 w-4 text-gray-600"
                    />
                    <span className="text-gray-700">Ninguno (1)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`supportType-${q.id}`}
                      value="0"
                      checked={q.supportType === "0"}
                      onChange={(e) => handleSupportTypeChange(q.id, e.target.value as "1" | "0")}
                      className="form-radio h-4 w-4 text-gray-600"
                    />
                    <span className="text-gray-700">Supervisión (0)</span>
                  </label>
                </div>
              </div>

              {/* FRECUENCIA */}
              {q.supportType === "0" && (
                <div className="ml-6 mt-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Frecuencia
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`frequency-${q.id}`}
                        value="0"
                        checked={q.frequency === "0"}
                        onChange={(e) => handleFrequencyChange(q.id, e.target.value as "1" | "0")}
                        className="form-radio h-4 w-4 text-gray-600"
                      />
                      <span className="text-gray-700">A veces (0)</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`frequency-${q.id}`}
                        value="1"
                        checked={q.frequency === "1"}
                        onChange={(e) => handleFrequencyChange(q.id, e.target.value as "1" | "0")}
                        className="form-radio h-4 w-4 text-gray-600"
                      />
                      <span className="text-gray-700">Siempre (1)</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Submit Button */}
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Create User
          </button>
        </div>
      </div>
    </div>
  );
}