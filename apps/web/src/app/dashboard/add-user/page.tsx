'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Question, questionsData } from "../../data/questions";

interface StudentFormData {
  first_name: string;
  last_name: string;
  age: number | '';
  sex: 'male' | 'female' | '';
  email: string;
  create_login: boolean;
  use_generated_password: boolean;
  custom_password: string;
}

export default function AddUser() {
  const router = useRouter();
  
  // Student profile data
  const [formData, setFormData] = useState<StudentFormData>({
    first_name: '',
    last_name: '',
    age: '',
    sex: '',
    email: '',
    create_login: true,
    use_generated_password: true,
    custom_password: ''
  });
  
  // Evaluation data
  const [questions, setQuestions] = useState<Question[]>(questionsData);
  
  // UI state
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState<any>(null);

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

  // Calculate ability levels from evaluation responses
  const calculateAbilityLevels = () => {
    const responses = questions.filter(q => q.supportType !== null);
    
    if (responses.length === 0) {
      return {
        reading_level: 1,
        comprehension_level: 1,
        attention_span: 1,
        motor_skills: 1
      };
    }

    // Simple scoring algorithm based on evaluation responses
    const totalScore = responses.reduce((sum, q) => {
      let score = 0;
      if (q.supportType === "1") score = 2; // No support needed
      else if (q.supportType === "0" && q.frequency === "1") score = 1; // Sometimes support
      else if (q.supportType === "0" && q.frequency === "0") score = 0; // Always support
      return sum + score;
    }, 0);

    const maxScore = responses.length * 2;
    const percentage = totalScore / maxScore;
    
    // Convert to 1-5 scale
    const level = Math.ceil(percentage * 5) || 1;
    
    return {
      reading_level: Math.max(1, Math.min(5, level)),
      comprehension_level: Math.max(1, Math.min(5, level)),
      attention_span: Math.max(1, Math.min(5, level)),
      motor_skills: Math.max(1, Math.min(5, level))
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.first_name || !formData.last_name) {
      setError('Nombre y apellido son requeridos.');
      return;
    }

    if (!formData.sex) {
      setError('Por favor seleccione el sexo.');
      return;
    }

    if (formData.create_login && !formData.use_generated_password && !formData.custom_password) {
      setError('Por favor ingrese una contraseña personalizada o use una generada automáticamente.');
      return;
    }

    setIsLoading(true);

    try {
      // Calculate ability levels from evaluation
      const abilities = calculateAbilityLevels();
      
      // Prepare student data
      const studentData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        age: formData.age || undefined,
        sex: formData.sex,
        create_login: formData.create_login,
        email: formData.email || undefined,
        use_generated_password: formData.use_generated_password,
        custom_password: formData.custom_password || undefined,
        ...abilities,
        // Store evaluation data as additional notes
        notes: `Evaluación completada: ${questions.filter(q => q.supportType !== null).length} de ${questions.length} preguntas respondidas.`,
        additional_abilities: {
          evaluation_responses: questions.filter(q => q.supportType !== null),
          evaluation_date: new Date().toISOString()
        }
      };

      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al crear el estudiante');
      }

      setSuccess('¡Estudiante creado exitosamente!');
      
      // Store credentials if generated
      if (result.login_credentials) {
        setGeneratedCredentials(result.login_credentials);
      }

      // Reset form after 3 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);

    } catch (err) {
      console.error('Error creating student:', err);
      setError(err instanceof Error ? err.message : 'Error al crear el estudiante');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm mb-4">
            {success}
          </div>
        )}

        {generatedCredentials && (
          <div className="bg-blue-50 text-blue-700 p-4 rounded-lg text-sm mb-4">
            <h3 className="font-bold mb-2">Credenciales generadas:</h3>
            <p><strong>Usuario:</strong> {generatedCredentials.username}</p>
            <p><strong>Email:</strong> {generatedCredentials.email}</p>
            {generatedCredentials.generated_password && (
              <p><strong>Contraseña:</strong> "{generatedCredentials.generated_password}"</p>
            )}
            <p className="text-xs mt-2 text-blue-600">Guarde estas credenciales para el estudiante.</p>
          </div>
        )}
        
        {/* Student Information Form */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
          <h2 className="text-2xl font-bold mb-6">Información del Estudiante</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  NOMBRE *
                </label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  APELLIDO *
                </label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  EDAD
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value ? parseInt(e.target.value) : ''})}
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  SEXO *
                </label>
                <select
                  value={formData.sex}
                  onChange={(e) => setFormData({...formData, sex: e.target.value as 'male' | 'female' | ''})}
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  required
                >
                  <option value="">Seleccionar...</option>
                  <option value="male">Masculino</option>
                  <option value="female">Femenino</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                EMAIL (opcional)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
                placeholder="Se generará automáticamente si no se proporciona"
              />
            </div>

            {/* Login Creation Options */}
            <div className="border-t pt-4 mt-6">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="create_login"
                  checked={formData.create_login}
                  onChange={(e) => setFormData({...formData, create_login: e.target.checked})}
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                />
                <label htmlFor="create_login" className="ml-2 text-gray-700 font-medium">
                  Crear cuenta de acceso para el estudiante
                </label>
              </div>

              {formData.create_login && (
                <div className="ml-6 space-y-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <input
                        type="radio"
                        id="generated_password"
                        name="password_type"
                        checked={formData.use_generated_password}
                        onChange={() => setFormData({...formData, use_generated_password: true, custom_password: ''})}
                        className="h-4 w-4 text-pink-600 focus:ring-pink-500"
                      />
                      <label htmlFor="generated_password" className="ml-2 text-gray-700">
                        Generar contraseña automáticamente (recomendado)
                      </label>
                    </div>
                    <p className="text-sm text-gray-500 ml-6">
                      Se generará una contraseña con 3 palabras simples en español (ej: "gato azul correr")
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center mb-2">
                      <input
                        type="radio"
                        id="custom_password"
                        name="password_type"
                        checked={!formData.use_generated_password}
                        onChange={() => setFormData({...formData, use_generated_password: false})}
                        className="h-4 w-4 text-pink-600 focus:ring-pink-500"
                      />
                      <label htmlFor="custom_password" className="ml-2 text-gray-700">
                        Contraseña personalizada
                      </label>
                    </div>
                    {!formData.use_generated_password && (
                      <input
                        type="text"
                        value={formData.custom_password}
                        onChange={(e) => setFormData({...formData, custom_password: e.target.value})}
                        placeholder="ej: gato azul correr"
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400 ml-6"
                      />
                    )}
                    <p className="text-sm text-gray-500 ml-6 mt-1">
                      Debe ser 3 palabras simples separadas por espacios
                    </p>
                  </div>
                </div>
              )}
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
            disabled={isLoading}
            className={`w-full py-3 rounded-lg transition-colors ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-pink-600 hover:bg-pink-700'
            } text-white font-medium`}
          >
            {isLoading ? 'Creando estudiante...' : 'Crear Estudiante'}
          </button>
        </div>
      </div>
    </div>
  );
}