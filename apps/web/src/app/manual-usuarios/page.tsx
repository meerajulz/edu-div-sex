'use client';

import React from 'react';
import Link from 'next/link';

export default function ManualUsuariosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50 print:relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-3xl">📚</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Manual de Gestión de Usuarios</h1>
                <p className="text-sm text-gray-600">Sistema EduDivSex - Dashboard Administrativo</p>
              </div>
            </div>
            <Link
              href="/"
              className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors text-sm print:hidden"
            >
              Volver al Inicio
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar - Table of Contents */}
          <aside className="lg:col-span-1 print:hidden">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">📑 Contenidos</h2>
              <nav className="space-y-2">
                {/* Destacado - Primer elemento */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-3 mb-3 shadow-lg">
                  <a href="#acceso-navegacion" className="block text-sm font-bold text-white hover:text-yellow-200 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🚪</span>
                      <div>
                        <div className="font-bold">Acceso y Navegación</div>
                        <div className="text-xs text-blue-100 mt-0.5">¡Click aquí para empezar! →</div>
                      </div>
                    </div>
                  </a>
                </div>

                <div className="border-t border-gray-200 pt-2 mt-2">
                  <a href="#tipos-usuarios" className="block text-sm text-gray-600 hover:text-pink-600 transition-colors">Tipos de Usuarios</a>
                  <a href="#jerarquia" className="block text-sm text-gray-600 hover:text-pink-600 transition-colors mt-2">Jerarquía de Permisos</a>
                  <a href="#crear-owner" className="block text-sm text-gray-600 hover:text-pink-600 transition-colors pl-4 mt-2">→ Crear Propietario</a>
                  <a href="#crear-admin" className="block text-sm text-gray-600 hover:text-pink-600 transition-colors pl-4 mt-2">→ Crear Administrador</a>
                  <a href="#crear-teacher" className="block text-sm text-gray-600 hover:text-pink-600 transition-colors pl-4 mt-2">→ Crear Profesor</a>
                  <a href="#crear-student" className="block text-sm text-gray-600 hover:text-pink-600 transition-colors pl-4 mt-2">→ Crear Estudiante</a>
                  <a href="#evaluacion" className="block text-sm text-gray-600 hover:text-pink-600 transition-colors pl-4 mt-2">→ Evaluación de Nivel</a>
                  <a href="#passwords" className="block text-sm text-gray-600 hover:text-pink-600 transition-colors mt-2">Gestión de Contraseñas</a>
                  <a href="#despues-crear" className="block text-sm text-gray-600 hover:text-pink-600 transition-colors mt-2">Después de Crear</a>
                  <a href="#faqs" className="block text-sm text-gray-600 hover:text-pink-600 transition-colors mt-2">Preguntas Frecuentes</a>
                  <a href="#resumen" className="block text-sm text-gray-600 hover:text-pink-600 transition-colors mt-2">Resumen Rápido</a>
                </div>
              </nav>

              {/* Print Button */}
              <button
                onClick={() => window.print()}
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm flex items-center justify-center space-x-2"
              >
                <span>🖨️</span>
                <span>Imprimir Manual</span>
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-8 space-y-12">

              {/* Intro Section */}
              <section>
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Bienvenido al Manual de Gestión de Usuarios</h2>
                  <p className="text-gray-700 mb-4">
                    Este manual te guiará paso a paso en la creación y gestión de usuarios en el sistema EduDivSex.
                    El sistema maneja 4 tipos de usuarios con diferentes niveles de acceso y responsabilidades.
                  </p>
                  <div className="bg-white/70 rounded-lg p-4">
                    <p className="text-sm text-gray-600">
                      <strong>💡 Consejo:</strong> Usa el menú de navegación lateral para saltar directamente a la sección que necesites.
                    </p>
                  </div>
                </div>

                {/* Placeholder for intro image */}
                <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <div className="text-6xl mb-4">🖼️</div>
                  <p className="text-gray-500 text-sm">
                    <strong>Imagen Placeholder:</strong> Dashboard Overview Screenshot
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Reemplazar con: Captura de pantalla del dashboard principal mostrando las opciones de gestión de usuarios
                  </p>
                </div>
              </section>

              {/* Tipos de Usuarios */}
              <section id="tipos-usuarios" className="scroll-mt-24">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-pink-200">
                  👥 Tipos de Usuarios
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Owner Card */}
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-6 border-2 border-yellow-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="text-4xl">👑</span>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Propietario (Owner)</h3>
                        <p className="text-sm text-gray-600">Nivel más alto de acceso</p>
                      </div>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✅</span>
                        <span>Acceso completo al sistema</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✅</span>
                        <span>Puede crear todos los tipos de usuarios</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✅</span>
                        <span>Puede modificar y eliminar datos</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">🔑</span>
                        <span><strong>Login:</strong> Email + Contraseña</span>
                      </li>
                    </ul>
                  </div>

                  {/* Admin Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border-2 border-blue-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="text-4xl">🏫</span>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Administrador (Admin)</h3>
                        <p className="text-sm text-gray-600">Para Centros Educativos</p>
                      </div>
                    </div>
                    <div className="bg-blue-100 rounded-lg p-3 mb-3">
                      <p className="text-xs text-blue-900 font-semibold">
                        🏫 Representa un centro educativo (escuela, colegio, institución)
                      </p>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✅</span>
                        <span>Añade profesores a su centro educativo</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">📋</span>
                        <span>Los profesores luego añaden sus estudiantes</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✅</span>
                        <span>Ve reportes de todo su centro</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">🔑</span>
                        <span><strong>Login:</strong> Email + Contraseña</span>
                      </li>
                    </ul>
                  </div>

                  {/* Teacher Card */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border-2 border-green-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="text-4xl">👨‍🏫</span>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Profesor (Teacher)</h3>
                        <p className="text-sm text-gray-600">Gestión de estudiantes</p>
                      </div>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✅</span>
                        <span>Crea y gestiona sus estudiantes</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✅</span>
                        <span>Acceso a progreso de estudiantes</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✅</span>
                        <span>Genera reportes</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">🔑</span>
                        <span><strong>Login:</strong> Email + Contraseña</span>
                      </li>
                    </ul>
                  </div>

                  {/* Student Card */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border-2 border-purple-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="text-4xl">👦</span>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Estudiante (Student)</h3>
                        <p className="text-sm text-gray-600">Acceso a actividades</p>
                      </div>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✅</span>
                        <span>Acceso a actividades educativas</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✅</span>
                        <span>Perfil personalizado</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✅</span>
                        <span>Progreso rastreado automáticamente</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">🔑</span>
                        <span><strong>Login:</strong> Usuario + Contraseña (NO email)</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Placeholder for user types diagram */}
                <div className="mt-8 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <div className="text-6xl mb-4">🖼️</div>
                  <p className="text-gray-500 text-sm">
                    <strong>Imagen Placeholder:</strong> User Types Diagram
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Reemplazar con: Diagrama mostrando los 4 tipos de usuarios con iconos y sus características principales
                  </p>
                </div>
              </section>

              {/* Jerarquía de Permisos */}
              <section id="jerarquia" className="scroll-mt-24">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-pink-200">
                  🏛️ Jerarquía de Permisos
                </h2>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
                  <div className="bg-white/70 rounded-lg p-4 mb-4">
                    <h3 className="text-lg font-bold text-blue-900 mb-2">📚 Flujo de Trabajo Recomendado:</h3>
                    <div className="space-y-2 text-sm text-gray-800">
                      <div className="flex items-start">
                        <span className="text-yellow-600 mr-2">👑</span>
                        <div>
                          <strong>1. Owner</strong> crea <strong>Administradores</strong> (uno por cada centro educativo)
                        </div>
                      </div>
                      <div className="flex items-start">
                        <span className="text-blue-600 mr-2">🏫</span>
                        <div>
                          <strong>2. Administrador</strong> (centro educativo) añade <strong>Profesores</strong> de su institución
                        </div>
                      </div>
                      <div className="flex items-start">
                        <span className="text-green-600 mr-2">👨‍🏫</span>
                        <div>
                          <strong>3. Profesor</strong> añade sus propios <strong>Estudiantes</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  <pre className="text-sm text-gray-800 overflow-x-auto font-mono leading-relaxed">
{`Owner (Propietario)
  ├── Puede crear: Owners, Admins, Teachers, Students
  ├── Puede gestionar: Todos los usuarios
  └── Acceso: Completo

Admin (Administrador - Centro Educativo) 🏫
  ├── Representa: Un centro educativo (escuela/colegio)
  ├── Puede crear: Teachers (profesores de su centro)
  ├── Flujo: Admin → Añade Teachers → Teachers añaden Students
  └── Acceso: Solo su centro educativo

Teacher (Profesor) 👨‍🏫
  ├── Puede crear: Students (estudiantes de sus clases)
  ├── Puede gestionar: Solo sus propios Students
  └── Acceso: Solo sus estudiantes

Student (Estudiante) 👦
  └── Acceso: Solo actividades educativas`}
                  </pre>
                </div>

                {/* Placeholder for hierarchy diagram */}
                <div className="mt-8 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <div className="text-6xl mb-4">🖼️</div>
                  <p className="text-gray-500 text-sm">
                    <strong>Imagen Placeholder:</strong> Permission Hierarchy Flowchart
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Reemplazar con: Diagrama de flujo visual mostrando la jerarquía de permisos en forma de árbol
                  </p>
                </div>
              </section>

              {/* Crear Propietario */}
              <section id="crear-owner" className="scroll-mt-24">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-pink-200">
                  👑 Crear Propietario (Owner)
                </h2>

                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">⚠️</span>
                    <div>
                      <h4 className="font-bold text-red-900 mb-2">ADVERTENCIA</h4>
                      <p className="text-red-800 text-sm">
                        Solo los propietarios existentes pueden crear nuevos propietarios. Este rol tiene acceso completo al sistema
                        y puede modificar o eliminar cualquier dato.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Campos Requeridos:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✅</span>
                        <span><strong>Nombre Completo</strong> - Nombre y apellido del propietario</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✅</span>
                        <span><strong>Email</strong> - Email único en el sistema (se verifica automáticamente)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✅</span>
                        <span><strong>Rol</strong> - Propietario (pre-seleccionado)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✅</span>
                        <span><strong>Contraseña</strong> - Generada o personalizada</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Pasos:</h3>
                    <ol className="list-decimal list-inside space-y-3 text-gray-700">
                      <li>Navegar a <code className="bg-gray-200 px-2 py-1 rounded text-sm">/dashboard/owner/users/create</code></li>
                      <li>Seleccionar rol &quot;Propietario&quot;</li>
                      <li>Llenar el formulario con los datos del nuevo propietario</li>
                      <li>Configurar contraseña (generada automáticamente recomendada)</li>
                      <li>Revisar advertencia de seguridad</li>
                      <li>Click &quot;Crear Propietario&quot;</li>
                      <li><strong className="text-red-600">IMPORTANTE:</strong> Guardar o enviar las credenciales mostradas</li>
                    </ol>
                  </div>
                </div>

                {/* Placeholder for owner creation screenshot */}
                <div className="mt-8 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <div className="text-6xl mb-4">🖼️</div>
                  <p className="text-gray-500 text-sm">
                    <strong>Imagen Placeholder:</strong> Owner Creation Form Screenshot
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Reemplazar con: Captura de pantalla del formulario de creación de propietario con campos llenos de ejemplo
                  </p>
                </div>
              </section>

              {/* Crear Administrador */}
              <section id="crear-admin" className="scroll-mt-24">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-pink-200">
                  🏫 Crear Administrador (Admin)
                </h2>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                  <div className="flex items-start">
                    <span className="text-3xl mr-3">🏫</span>
                    <div>
                      <h4 className="font-bold text-blue-900 mb-2">El Administrador representa un Centro Educativo</h4>
                      <p className="text-blue-800 text-sm mb-2">
                        Cada administrador gestiona una institución educativa completa (escuela, colegio, centro).
                      </p>
                      <div className="bg-blue-100 rounded p-3 mt-3">
                        <p className="text-sm font-semibold text-blue-900 mb-2">Flujo de trabajo:</p>
                        <ol className="text-sm text-blue-800 space-y-1">
                          <li>1️⃣ Owner crea Administrador (= un centro educativo)</li>
                          <li>2️⃣ Administrador añade Profesores de su centro</li>
                          <li>3️⃣ Cada Profesor añade sus propios Estudiantes</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
                  <p className="text-amber-800 text-sm">
                    <strong>⚠️ Nota:</strong> Solo los Propietarios pueden crear administradores.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Campos Requeridos:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✅</span>
                        <span><strong>Nombre Completo</strong> - Nombre y apellido del administrador</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✅</span>
                        <span><strong>Email</strong> - Email único en el sistema</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✅</span>
                        <span><strong>Rol</strong> - Administrador (pre-seleccionado)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✅</span>
                        <span><strong>Contraseña</strong> - Generada o personalizada</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Pasos:</h3>
                    <ol className="list-decimal list-inside space-y-3 text-gray-700">
                      <li>Navegar a <code className="bg-gray-200 px-2 py-1 rounded text-sm">/dashboard/owner/admins</code></li>
                      <li>Click &quot;+ Crear Administrador&quot;</li>
                      <li>Llenar el formulario con los datos</li>
                      <li>Configurar contraseña</li>
                      <li>Click &quot;Crear Administrador&quot;</li>
                      <li>Guardar las credenciales de acceso</li>
                    </ol>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-bold text-blue-900 mb-3">Responsabilidades del Administrador (Centro Educativo):</h4>
                    <div className="space-y-3">
                      <div className="bg-white/70 rounded p-3">
                        <h5 className="font-bold text-blue-800 text-sm mb-2">✅ Lo que SÍ hace:</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div className="flex items-start">
                            <span className="text-green-600 mr-2">👨‍🏫</span>
                            <span>Añade profesores de su centro</span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-green-600 mr-2">📊</span>
                            <span>Ve reportes de todo el centro</span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-green-600 mr-2">👥</span>
                            <span>Gestiona sus profesores</span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-green-600 mr-2">📈</span>
                            <span>Ve progreso de todos los estudiantes del centro</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white/70 rounded p-3">
                        <h5 className="font-bold text-blue-800 text-sm mb-2">📋 Flujo de estudiantes:</h5>
                        <p className="text-sm text-gray-700">
                          Los <strong>Profesores</strong> son quienes añaden estudiantes, no el Administrador directamente.
                          El Admin supervisa pero no crea estudiantes individualmente.
                        </p>
                      </div>
                      <div className="bg-white/70 rounded p-3">
                        <h5 className="font-bold text-red-800 text-sm mb-2">❌ Lo que NO hace:</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div className="flex items-start">
                            <span className="text-red-600 mr-2">❌</span>
                            <span>NO crea propietarios</span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-red-600 mr-2">❌</span>
                            <span>NO modifica otros centros educativos</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Placeholder for admin creation screenshot */}
                <div className="mt-8 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <div className="text-6xl mb-4">🖼️</div>
                  <p className="text-gray-500 text-sm">
                    <strong>Imagen Placeholder:</strong> Admin Creation Form Screenshot
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Reemplazar con: Captura de pantalla del formulario de creación de administrador
                  </p>
                </div>
              </section>

              {/* Crear Profesor */}
              <section id="crear-teacher" className="scroll-mt-24">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-pink-200">
                  👨‍🏫 Crear Profesor (Teacher)
                </h2>

                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                  <p className="text-green-800 text-sm">
                    <strong>ℹ️ Nota:</strong> Los Propietarios y Administradores pueden crear profesores.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Campos Requeridos:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✅</span>
                        <span><strong>Nombre Completo</strong> - Nombre y apellido del profesor</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✅</span>
                        <span><strong>Email</strong> - Email único en el sistema</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✅</span>
                        <span><strong>Rol</strong> - Profesor (pre-seleccionado)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✅</span>
                        <span><strong>Contraseña</strong> - Generada o personalizada</span>
                      </li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <h4 className="font-bold text-yellow-900 mb-2">Para Propietarios:</h4>
                      <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                        <li>Ir a <code className="bg-gray-200 px-1 py-0.5 rounded text-xs">/dashboard/owner/teachers</code></li>
                        <li>Click &quot;+ Crear Profesor&quot;</li>
                        <li>Llenar formulario</li>
                        <li>Click &quot;Crear Profesor&quot;</li>
                      </ol>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-bold text-blue-900 mb-2">Para Administradores:</h4>
                      <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                        <li>Ir a <code className="bg-gray-200 px-1 py-0.5 rounded text-xs">/dashboard/admin/users/create</code></li>
                        <li>Seleccionar rol &quot;Profesor&quot;</li>
                        <li>Llenar formulario</li>
                        <li>Click &quot;Crear Profesor&quot;</li>
                      </ol>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-bold text-green-900 mb-2">Permisos del Profesor:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-start">
                        <span className="text-green-600 mr-2">✅</span>
                        <span>Crea estudiantes (auto-asignados)</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-green-600 mr-2">✅</span>
                        <span>Ve progreso de sus estudiantes</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-green-600 mr-2">✅</span>
                        <span>Edita info de sus estudiantes</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-green-600 mr-2">✅</span>
                        <span>Genera reportes</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-red-600 mr-2">❌</span>
                        <span>NO crea otros profesores</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-red-600 mr-2">❌</span>
                        <span>NO ve otros estudiantes</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Placeholder for teacher creation screenshot */}
                <div className="mt-8 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <div className="text-6xl mb-4">🖼️</div>
                  <p className="text-gray-500 text-sm">
                    <strong>Imagen Placeholder:</strong> Teacher Creation Form Screenshot
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Reemplazar con: Captura de pantalla del formulario de creación de profesor
                  </p>
                </div>
              </section>

              {/* Crear Estudiante */}
              <section id="crear-student" className="scroll-mt-24">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-pink-200">
                  👦 Crear Estudiante (Student)
                </h2>

                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-6">
                  <p className="text-purple-800 text-sm">
                    <strong>ℹ️ Nota:</strong> Los Propietarios, Administradores y Profesores pueden crear estudiantes.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Campos Requeridos:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">✅</span>
                          <span><strong>Nombre Completo</strong></span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">✅</span>
                          <span><strong>Email</strong> (para padres/tutores)</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">✅</span>
                          <span><strong>Nombre de Usuario</strong> (para login)</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">✅</span>
                          <span><strong>Sexo</strong></span>
                        </li>
                      </ul>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">📝</span>
                          <span><strong>Edad</strong> (opcional pero recomendado)</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">✅</span>
                          <span><strong>Contraseña</strong></span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">✅</span>
                          <span><strong>Profesor Asignado</strong> (Owner/Admin)</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">✅</span>
                          <span><strong>Evaluación de Nivel</strong></span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
                    <div className="flex items-start">
                      <span className="text-2xl mr-3">💡</span>
                      <div>
                        <h4 className="font-bold text-amber-900 mb-2">Importante sobre Login de Estudiantes</h4>
                        <p className="text-amber-800 text-sm">
                          Los estudiantes NO usan email para login. Usan un <strong>Nombre de Usuario</strong> único que es más
                          fácil de recordar (ej: &quot;juanito123&quot;). El email es solo para comunicación con padres/tutores.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Placeholder for student creation screenshot */}
                <div className="mt-8 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <div className="text-6xl mb-4">🖼️</div>
                  <p className="text-gray-500 text-sm">
                    <strong>Imagen Placeholder:</strong> Student Creation Form Screenshot (Part 1)
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Reemplazar con: Captura de pantalla del formulario de creación de estudiante mostrando campos básicos
                  </p>
                </div>
              </section>

              {/* Evaluación de Nivel */}
              <section id="evaluacion" className="scroll-mt-24">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-pink-200">
                  📊 Evaluación de Nivel del Estudiante
                </h2>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                  <p className="text-blue-800 text-sm">
                    Esta evaluación es <strong>OBLIGATORIA</strong> y determina los niveles iniciales de habilidades del estudiante.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Cómo Responder las Preguntas:</h3>

                    <div className="space-y-4">
                      <div className="bg-purple-50 rounded-lg p-4">
                        <h4 className="font-bold text-purple-900 mb-2">Paso 1: Seleccionar TIPO DE APOYO</h4>
                        <div className="space-y-2 ml-4">
                          <div className="flex items-start">
                            <span className="text-green-600 mr-2 font-bold">●</span>
                            <div>
                              <strong>Ninguno (1):</strong> El estudiante puede hacer esto sin ayuda
                            </div>
                          </div>
                          <div className="flex items-start">
                            <span className="text-orange-600 mr-2 font-bold">●</span>
                            <div>
                              <strong>Supervisión (0):</strong> El estudiante necesita supervisión para hacerlo
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-orange-50 rounded-lg p-4">
                        <h4 className="font-bold text-orange-900 mb-2">Paso 2: Si seleccionó &quot;Supervisión&quot;, indicar FRECUENCIA</h4>
                        <div className="space-y-2 ml-4">
                          <div className="flex items-start">
                            <span className="text-red-600 mr-2 font-bold">●</span>
                            <div>
                              <strong>A veces (0):</strong> Necesita supervisión ocasionalmente
                            </div>
                          </div>
                          <div className="flex items-start">
                            <span className="text-yellow-600 mr-2 font-bold">●</span>
                            <div>
                              <strong>Siempre (1):</strong> Necesita supervisión constante
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Ejemplo de Evaluación:</h3>
                    <div className="space-y-4 font-mono text-sm">
                      <div className="bg-white/70 rounded p-3">
                        <div className="text-gray-800 mb-2">
                          <strong>Pregunta:</strong> &quot;¿Puede el estudiante leer instrucciones simples?&quot;
                        </div>
                        <div className="ml-4 text-green-700">
                          └─ <strong>Tipo de Apoyo:</strong> Ninguno (1)<br/>
                          <span className="ml-3">→ El estudiante puede leer instrucciones solo</span>
                        </div>
                      </div>

                      <div className="bg-white/70 rounded p-3">
                        <div className="text-gray-800 mb-2">
                          <strong>Pregunta:</strong> &quot;¿Puede el estudiante completar tareas complejas?&quot;
                        </div>
                        <div className="ml-4 text-orange-700">
                          └─ <strong>Tipo de Apoyo:</strong> Supervisión (0)<br/>
                          <span className="ml-3">└─ <strong>Frecuencia:</strong> A veces (0)</span><br/>
                          <span className="ml-6">→ Necesita ayuda ocasional</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">¿Cómo se Calculan los Niveles?</h3>
                    <div className="space-y-3">
                      <div className="bg-white/70 rounded p-3">
                        <h4 className="font-bold text-gray-900 mb-2">Sistema de Puntuación:</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Ninguno (1) = <strong>2 puntos</strong> → Estudiante independiente</li>
                          <li>• Supervisión (0) + Siempre (1) = <strong>1 punto</strong> → Necesita ayuda ocasional</li>
                          <li>• Supervisión (0) + A veces (0) = <strong>0 puntos</strong> → Necesita ayuda constante</li>
                        </ul>
                      </div>

                      <div className="bg-white/70 rounded p-3">
                        <h4 className="font-bold text-gray-900 mb-2">Niveles Calculados (1-5):</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• <code className="bg-gray-200 px-2 py-0.5 rounded">reading_level</code> - Nivel de lectura</li>
                          <li>• <code className="bg-gray-200 px-2 py-0.5 rounded">comprehension_level</code> - Nivel de comprensión</li>
                          <li>• <code className="bg-gray-200 px-2 py-0.5 rounded">attention_span</code> - Capacidad de atención</li>
                          <li>• <code className="bg-gray-200 px-2 py-0.5 rounded">motor_skills</code> - Habilidades motoras</li>
                          <li>• <code className="bg-gray-200 px-2 py-0.5 rounded">supervision_level</code> - Nivel de supervisión (1-3)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Placeholder for evaluation screenshot */}
                <div className="mt-8 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <div className="text-6xl mb-4">🖼️</div>
                  <p className="text-gray-500 text-sm">
                    <strong>Imagen Placeholder:</strong> Student Evaluation Form Screenshot
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Reemplazar con: Captura de pantalla del formulario de evaluación mostrando las preguntas y opciones de respuesta
                  </p>
                </div>
              </section>

              {/* Gestión de Contraseñas */}
              <section id="passwords" className="scroll-mt-24">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-pink-200">
                  🔐 Gestión de Contraseñas
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Opción 1: Generada */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border-2 border-green-300">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="text-3xl">🎲</span>
                      <h3 className="text-xl font-bold text-gray-900">Opción 1: Generada Automáticamente</h3>
                    </div>
                    <div className="bg-green-100 rounded p-3 mb-4">
                      <span className="text-green-800 font-bold">✅ RECOMENDADA</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start">
                        <span className="text-green-600 mr-2">✅</span>
                        <span>Contraseña segura automáticamente</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-green-600 mr-2">✅</span>
                        <span>Cumple requisitos de seguridad</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-green-600 mr-2">✅</span>
                        <span>Fácil de regenerar</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-green-600 mr-2">✅</span>
                        <span>Se muestra claramente para copiar</span>
                      </div>
                    </div>
                    <div className="mt-4 bg-white rounded p-3 font-mono text-sm">
                      <div className="text-gray-600 mb-1">Ejemplo:</div>
                      <div className="text-blue-600 font-bold">&quot;K8mP#9xLq2wR&quot;</div>
                    </div>
                  </div>

                  {/* Opción 2: Personalizada */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border-2 border-blue-300">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="text-3xl">🔑</span>
                      <h3 className="text-xl font-bold text-gray-900">Opción 2: Personalizada</h3>
                    </div>
                    <div className="bg-blue-100 rounded p-3 mb-4">
                      <span className="text-blue-800 font-bold">Requisitos:</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start">
                        <span className="text-blue-600 mr-2">❗</span>
                        <span>Mínimo 8 caracteres</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-blue-600 mr-2">❗</span>
                        <span>Debe confirmar la contraseña</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-blue-600 mr-2">❗</span>
                        <span>Las contraseñas deben coincidir</span>
                      </div>
                    </div>
                    <div className="mt-4 bg-white rounded p-3 text-sm">
                      <div className="text-gray-600 mb-2">Ejemplos para Estudiantes:</div>
                      <ul className="space-y-1 font-mono text-blue-600">
                        <li>• Estudiante2024!</li>
                        <li>• MiClave123</li>
                        <li>• Escuela2025</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4">
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">🔐</span>
                    <div>
                      <h4 className="font-bold text-red-900 mb-2">Recomendaciones de Seguridad:</h4>
                      <ul className="space-y-1 text-sm text-red-800">
                        <li>• <strong>Owners/Admins:</strong> Usar contraseñas generadas y cambiarlas después del primer login</li>
                        <li>• <strong>Teachers:</strong> Contraseñas generadas recomendadas</li>
                        <li>• <strong>Students:</strong> Contraseñas simples pero seguras (para que puedan recordarlas)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Placeholder for password options screenshot */}
                <div className="mt-8 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <div className="text-6xl mb-4">🖼️</div>
                  <p className="text-gray-500 text-sm">
                    <strong>Imagen Placeholder:</strong> Password Configuration Screenshot
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Reemplazar con: Captura de pantalla mostrando las dos opciones de contraseña (generada y personalizada)
                  </p>
                </div>
              </section>

              {/* Después de Crear */}
              <section id="despues-crear" className="scroll-mt-24">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-pink-200">
                  ✅ Después de Crear un Usuario
                </h2>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-bold text-green-900 mb-4">Página de Éxito</h3>
                  <div className="bg-white rounded-lg p-6 border-2 border-green-300">
                    <div className="text-center mb-4">
                      <span className="text-5xl">✅</span>
                      <h4 className="text-2xl font-bold text-green-800 mt-2">¡Usuario Creado Exitosamente!</h4>
                    </div>
                    <div className="border-2 border-dashed border-gray-300 rounded p-4 space-y-2 text-sm font-mono">
                      <div><strong>Nombre:</strong> [Nombre del usuario]</div>
                      <div><strong>Email:</strong> [email@ejemplo.com]</div>
                      <div><strong>Rol:</strong> [Tipo de usuario]</div>
                      <div><strong>Usuario:</strong> [solo para estudiantes]</div>
                      <div className="text-red-600"><strong>Contraseña:</strong> [contraseña generada]</div>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded">🖨️ Imprimir</button>
                      <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded">+ Crear Otro</button>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-6">
                  <div className="flex items-start">
                    <span className="text-3xl mr-4">⚠️</span>
                    <div>
                      <h4 className="text-xl font-bold text-red-900 mb-3">ADVERTENCIA CRÍTICA</h4>
                      <p className="text-red-800 mb-3">
                        <strong>La contraseña solo se muestra UNA VEZ en esta pantalla. Después no será posible recuperarla.</strong>
                      </p>
                      <div className="bg-white/70 rounded p-4">
                        <h5 className="font-bold text-red-900 mb-2">Pasos Recomendados:</h5>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-red-800">
                          <li><strong>COPIAR O IMPRIMIR inmediatamente</strong> las credenciales</li>
                          <li>Entregar credenciales de forma segura al usuario</li>
                          <li>Verificar que el usuario puede iniciar sesión</li>
                          <li>Recomendar cambio de contraseña en primer login</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-6">
                  <h4 className="text-lg font-bold text-blue-900 mb-3">¿Qué Hacer Si Se Pierde la Contraseña?</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start">
                      <span className="text-green-600 mr-2 text-lg">✅</span>
                      <div>
                        <strong>Antes de salir:</strong> Se puede copiar/imprimir nuevamente
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="text-red-600 mr-2 text-lg">❌</span>
                      <div>
                        <strong>Después de salir:</strong> La contraseña NO se puede recuperar
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="text-blue-600 mr-2 text-lg">🔄</span>
                      <div>
                        <strong>Solución:</strong> Usar la función &quot;Restablecer Contraseña&quot; desde el perfil del usuario
                      </div>
                    </div>
                  </div>
                </div>

                {/* Placeholder for success page screenshot */}
                <div className="mt-8 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <div className="text-6xl mb-4">🖼️</div>
                  <p className="text-gray-500 text-sm">
                    <strong>Imagen Placeholder:</strong> Success Page Screenshot
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Reemplazar con: Captura de pantalla de la página de éxito mostrando las credenciales del usuario creado
                  </p>
                </div>
              </section>

              {/* Acceso y Navegación */}
              <section id="acceso-navegacion" className="scroll-mt-24">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-pink-200">
                  🚪 Acceso y Navegación del Dashboard
                </h2>

                {/* Login */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">1️⃣ Cómo Iniciar Sesión</h3>

                    <div className="space-y-4">
                      <div className="bg-white/70 rounded-lg p-4">
                        <h4 className="font-bold text-gray-900 mb-3">Para Owner, Admin y Teacher:</h4>
                        <ol className="list-decimal list-inside space-y-2 text-gray-700">
                          <li>Ir a la página principal del sistema</li>
                          <li>Click en el botón <strong>&quot;Iniciar Sesión&quot;</strong></li>
                          <li>Ingresar <strong>Email</strong> y <strong>Contraseña</strong></li>
                          <li>Click en <strong>&quot;Entrar&quot;</strong></li>
                        </ol>
                      </div>

                      <div className="bg-white/70 rounded-lg p-4">
                        <h4 className="font-bold text-gray-900 mb-3">Para Estudiantes:</h4>
                        <ol className="list-decimal list-inside space-y-2 text-gray-700">
                          <li>Ir a la página principal del sistema</li>
                          <li>Click en el botón <strong>&quot;Iniciar Sesión&quot;</strong></li>
                          <li>Ingresar <strong>Nombre de Usuario</strong> (NO email) y <strong>Contraseña</strong></li>
                          <li>Click en <strong>&quot;Entrar&quot;</strong></li>
                        </ol>
                      </div>

                      <div className="bg-blue-100 rounded-lg p-4">
                        <p className="text-sm text-blue-900">
                          <strong>💡 Nota importante:</strong> Los estudiantes usan <strong>Nombre de Usuario</strong>,
                          no email. Ejemplo: &quot;juanito123&quot; en lugar de &quot;juanito@email.com&quot;
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Botón Panel de Control */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">2️⃣ Acceder al Panel de Control</h3>

                    <div className="space-y-4">
                      <p className="text-gray-700">
                        Después de iniciar sesión exitosamente, llegarás a la página de inicio (Home).
                      </p>

                      <div className="bg-white/70 rounded-lg p-4 border-l-4 border-purple-500">
                        <div className="flex items-start">
                          <span className="text-3xl mr-4">🎯</span>
                          <div>
                            <h4 className="font-bold text-purple-900 mb-2">Solo para Owner, Admin y Teacher:</h4>
                            <p className="text-gray-700 mb-3">
                              En la página de inicio verás un botón especial en la esquina superior izquierda:
                            </p>
                            <div className="bg-white/90 backdrop-blur-lg text-blue-600 font-semibold px-6 py-3 rounded-full border border-blue-200 shadow-lg inline-flex items-center gap-2">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                              </svg>
                              Panel de Control
                            </div>
                            <p className="text-gray-600 text-sm mt-3">
                              Click en este botón para acceder al panel de administración del sistema.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-amber-50 rounded-lg p-4">
                        <p className="text-sm text-amber-900">
                          <strong>⚠️ Nota:</strong> Los estudiantes NO ven este botón. Ellos van directamente
                          a las actividades educativas.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Placeholder for dashboard button screenshot */}
                  <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                    <div className="text-6xl mb-4">🖼️</div>
                    <p className="text-gray-500 text-sm">
                      <strong>Imagen Placeholder:</strong> Home Page with Panel de Control Button
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Reemplazar con: Captura de pantalla de la página home mostrando el botón &quot;Panel de Control&quot; en la esquina superior izquierda
                    </p>
                  </div>

                  {/* Navegación del Sidebar */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">3️⃣ Navegación del Sidebar (Panel Lateral)</h3>

                    <p className="text-gray-700 mb-6">
                      Una vez en el Dashboard, verás un panel lateral (sidebar) con diferentes opciones según tu rol.
                    </p>

                    {/* Owner Sidebar */}
                    <div className="mb-6">
                      <div className="bg-yellow-50 rounded-lg p-5 border-2 border-yellow-300">
                        <div className="flex items-center mb-4">
                          <span className="text-3xl mr-3">👑</span>
                          <h4 className="text-xl font-bold text-gray-900">Sidebar del Owner (Propietario)</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white/70 rounded p-3">
                            <h5 className="font-bold text-pink-600 text-sm mb-2">PANEL DE CONTROL</h5>
                            <ul className="space-y-1 text-sm text-gray-700">
                              <li>• <Link href="/dashboard" className="text-blue-600 hover:underline font-semibold">Vista General del Sistema</Link> - Dashboard principal</li>
                            </ul>
                          </div>

                          <div className="bg-white/70 rounded p-3">
                            <h5 className="font-bold text-pink-600 text-sm mb-2">GESTIÓN DE USUARIOS</h5>
                            <ul className="space-y-1 text-sm text-gray-700">
                              <li>• <Link href="/dashboard/owner/users" className="text-blue-600 hover:underline font-semibold">Todos los Usuarios</Link> - Lista completa</li>
                              <li>• <Link href="/dashboard/owner/users/create" className="text-blue-600 hover:underline font-semibold">Crear Nuevo Usuario</Link> - Formulario de creación</li>
                              <li>• <Link href="/dashboard/owner/admins" className="text-blue-600 hover:underline font-semibold">Gestionar Administradores</Link> - Lista de admins</li>
                              <li>• <Link href="/dashboard/owner/teachers" className="text-blue-600 hover:underline font-semibold">Gestionar Profesores</Link> - Lista de teachers</li>
                            </ul>
                          </div>

                          <div className="bg-white/70 rounded p-3">
                            <h5 className="font-bold text-pink-600 text-sm mb-2">ESTUDIANTES Y DATOS</h5>
                            <ul className="space-y-1 text-sm text-gray-700">
                              <li>• <Link href="/dashboard/owner/students" className="text-blue-600 hover:underline font-semibold">Todos los Estudiantes</Link> - Lista completa</li>
                              <li>• <Link href="/dashboard/owner/analytics" className="text-blue-600 hover:underline font-semibold">Análisis del Sistema</Link> - Estadísticas globales</li>
                            </ul>
                          </div>

                          <div className="bg-white/70 rounded p-3">
                            <h5 className="font-bold text-pink-600 text-sm mb-2">ACTIVIDADES</h5>
                            <ul className="space-y-1 text-sm text-gray-700">
                              <li>• <strong>Actividad 1-6</strong> - Ver contenido educativo</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Admin Sidebar */}
                    <div className="mb-6">
                      <div className="bg-blue-50 rounded-lg p-5 border-2 border-blue-300">
                        <div className="flex items-center mb-4">
                          <span className="text-3xl mr-3">🏫</span>
                          <h4 className="text-xl font-bold text-gray-900">Sidebar del Admin (Centro Educativo)</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white/70 rounded p-3">
                            <h5 className="font-bold text-pink-600 text-sm mb-2">PANEL DE CONTROL</h5>
                            <ul className="space-y-1 text-sm text-gray-700">
                              <li>• <Link href="/dashboard" className="text-blue-600 hover:underline font-semibold">Vista General</Link> - Dashboard del centro</li>
                            </ul>
                          </div>

                          <div className="bg-white/70 rounded p-3">
                            <h5 className="font-bold text-pink-600 text-sm mb-2">GESTIÓN DE PROFESORES</h5>
                            <ul className="space-y-1 text-sm text-gray-700">
                              <li>• <Link href="/dashboard/admin/teachers" className="text-blue-600 hover:underline font-semibold">Ver Profesores Asignados</Link> - Profesores del centro</li>
                              <li>• <Link href="/dashboard/admin/users/create?role=teacher" className="text-blue-600 hover:underline font-semibold">Crear Profesor</Link> - Añadir nuevo profesor</li>
                              <li>• <Link href="/dashboard/admin/teacher-assignments" className="text-blue-600 hover:underline font-semibold">Asignar Profesores</Link> - Gestionar asignaciones</li>
                            </ul>
                          </div>

                          <div className="bg-white/70 rounded p-3">
                            <h5 className="font-bold text-pink-600 text-sm mb-2">ESTUDIANTES</h5>
                            <ul className="space-y-1 text-sm text-gray-700">
                              <li>• <Link href="/dashboard/admin/students" className="text-blue-600 hover:underline font-semibold">Ver Todos los Estudiantes</Link> - Del centro</li>
                              <li>• <Link href="/dashboard/admin/users/create?role=student" className="text-blue-600 hover:underline font-semibold">Crear Estudiante</Link> - Añadir nuevo (asignar a profesor)</li>
                              <li>• <Link href="/dashboard/admin/reports" className="text-blue-600 hover:underline font-semibold">Reportes y Estadísticas</Link> - Análisis del centro</li>
                            </ul>
                          </div>

                          <div className="bg-white/70 rounded p-3">
                            <h5 className="font-bold text-pink-600 text-sm mb-2">HERRAMIENTAS</h5>
                            <ul className="space-y-1 text-sm text-gray-700">
                              <li>• <Link href="/dashboard/admin/password-reset" className="text-blue-600 hover:underline font-semibold">Restablecer Contraseñas</Link> - Recuperación de acceso</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Teacher Sidebar */}
                    <div className="mb-6">
                      <div className="bg-green-50 rounded-lg p-5 border-2 border-green-300">
                        <div className="flex items-center mb-4">
                          <span className="text-3xl mr-3">👨‍🏫</span>
                          <h4 className="text-xl font-bold text-gray-900">Sidebar del Teacher (Profesor)</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white/70 rounded p-3">
                            <h5 className="font-bold text-pink-600 text-sm mb-2">PANEL DE CONTROL</h5>
                            <ul className="space-y-1 text-sm text-gray-700">
                              <li>• <Link href="/dashboard" className="text-blue-600 hover:underline font-semibold">Vista General</Link> - Dashboard del profesor</li>
                            </ul>
                          </div>

                          <div className="bg-white/70 rounded p-3">
                            <h5 className="font-bold text-pink-600 text-sm mb-2">PERFIL DEL PROFESOR</h5>
                            <ul className="space-y-1 text-sm text-gray-700">
                              <li>• <Link href="/dashboard/teacher/profile" className="text-blue-600 hover:underline font-semibold">Mi Perfil</Link> - Información personal</li>
                            </ul>
                          </div>

                          <div className="bg-white/70 rounded p-3">
                            <h5 className="font-bold text-pink-600 text-sm mb-2">GESTIÓN DE ALUMNOS</h5>
                            <ul className="space-y-1 text-sm text-gray-700">
                              <li>• <Link href="/dashboard/owner/users/create?role=student" className="text-blue-600 hover:underline font-semibold">Crear Perfil de Alumno</Link> - Añadir estudiante</li>
                              <li>• <Link href="/dashboard/students" className="text-blue-600 hover:underline font-semibold">Ver Lista de Alumnos</Link> - Mis estudiantes</li>
                            </ul>
                          </div>

                          <div className="bg-white/70 rounded p-3">
                            <h5 className="font-bold text-pink-600 text-sm mb-2">ACTIVIDADES</h5>
                            <ul className="space-y-1 text-sm text-gray-700">
                              <li>• <strong>Actividad 1-6</strong> - Ver contenido educativo</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
                        <div className="flex items-start">
                          <span className="text-2xl mr-3">💡</span>
                          <div>
                            <h5 className="font-bold text-purple-900 mb-2">Consejo de Navegación</h5>
                            <p className="text-sm text-purple-800">
                              El sidebar siempre está visible en el lado izquierdo del dashboard.
                              Click en cualquier opción para navegar a esa sección. La opción activa
                              se resalta para que sepas dónde estás.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                        <div className="flex items-start">
                          <span className="text-2xl mr-3">🔗</span>
                          <div>
                            <h5 className="font-bold text-blue-900 mb-2">Links Directos</h5>
                            <p className="text-sm text-blue-800">
                              Los textos en <span className="text-blue-600 font-semibold">azul</span> son links clickeables
                              que te llevan directamente a esa página del dashboard.
                              ¡Pruébalos ahora mismo!
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Placeholder for sidebar screenshot */}
                  <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                    <div className="text-6xl mb-4">🖼️</div>
                    <p className="text-gray-500 text-sm">
                      <strong>Imagen Placeholder:</strong> Dashboard with Sidebar
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Reemplazar con: Captura de pantalla del dashboard mostrando el sidebar con todas las opciones
                    </p>
                  </div>

                  {/* Flujo completo */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">📋 Flujo Completo de Acceso</h3>

                    <div className="space-y-3">
                      <div className="flex items-start bg-white/70 rounded-lg p-3">
                        <span className="text-2xl mr-3">1️⃣</span>
                        <div>
                          <strong className="text-gray-900">Iniciar Sesión</strong>
                          <p className="text-sm text-gray-600">Email/Usuario + Contraseña</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-center">
                        <span className="text-2xl">⬇️</span>
                      </div>

                      <div className="flex items-start bg-white/70 rounded-lg p-3">
                        <span className="text-2xl mr-3">2️⃣</span>
                        <div>
                          <strong className="text-gray-900">Llegar a Home</strong>
                          <p className="text-sm text-gray-600">Página de bienvenida del sistema</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-center">
                        <span className="text-2xl">⬇️</span>
                      </div>

                      <div className="flex items-start bg-white/70 rounded-lg p-3">
                        <span className="text-2xl mr-3">3️⃣</span>
                        <div>
                          <strong className="text-gray-900">Click en &quot;Panel de Control&quot;</strong>
                          <p className="text-sm text-gray-600">Botón en esquina superior izquierda - Solo para Owner/Admin/Teacher</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-center">
                        <span className="text-2xl">⬇️</span>
                      </div>

                      <div className="flex items-start bg-white/70 rounded-lg p-3">
                        <span className="text-2xl mr-3">4️⃣</span>
                        <div>
                          <strong className="text-gray-900">Usar el Sidebar</strong>
                          <p className="text-sm text-gray-600">Navegar por las opciones del panel lateral</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Preguntas Frecuentes */}
              <section id="faqs" className="scroll-mt-24">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-pink-200">
                  ❓ Preguntas Frecuentes
                </h2>

                <div className="space-y-4">
                  {[
                    {
                      q: "¿Cuántos propietarios debería tener el sistema?",
                      a: "Se recomienda tener 2-3 propietarios máximo para mantener control. Los propietarios tienen acceso completo."
                    },
                    {
                      q: "¿Cuál es la diferencia entre Admin y Owner?",
                      a: "Owner tiene acceso total, puede crear/modificar/eliminar cualquier cosa. Admin tiene acceso limitado a sus profesores asignados."
                    },
                    {
                      q: "¿Por qué los estudiantes usan nombre de usuario en lugar de email?",
                      a: "Para facilitar el acceso de estudiantes jóvenes. Es más fácil recordar 'juanito123' que 'juanito.garcia@email.com'."
                    },
                    {
                      q: "¿Qué pasa si olvido asignar un profesor al crear un estudiante?",
                      a: "El formulario NO te permitirá crear el estudiante sin asignar un profesor. Es un campo obligatorio para Owners y Admins."
                    },
                    {
                      q: "¿Puedo cambiar el profesor asignado después?",
                      a: "Sí, los Owners y Admins pueden reasignar estudiantes a diferentes profesores editando el perfil."
                    },
                    {
                      q: "¿Qué es la evaluación de nivel y por qué es obligatoria?",
                      a: "Determina los niveles iniciales de habilidades del estudiante. Permite al sistema personalizar el contenido educativo."
                    },
                    {
                      q: "¿Puedo modificar la evaluación después?",
                      a: "Sí, se puede actualizar en cualquier momento desde el perfil del estudiante. Se recomienda re-evaluar periódicamente."
                    },
                    {
                      q: "¿Puedo usar la misma contraseña para varios estudiantes?",
                      a: "Técnicamente sí, pero NO es recomendable por seguridad. Cada usuario debe tener su propia contraseña única."
                    }
                  ].map((faq, index) => (
                    <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-400">
                      <h4 className="font-bold text-purple-900 mb-2">❓ {faq.q}</h4>
                      <p className="text-gray-700 text-sm">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Resumen Rápido */}
              <section id="resumen" className="scroll-mt-24">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-pink-200">
                  📋 Resumen Rápido
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-6 border-2 border-yellow-300">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">👑 Owner puede crear:</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center"><span className="text-green-600 mr-2">✅</span> Owners</div>
                      <div className="flex items-center"><span className="text-green-600 mr-2">✅</span> Admins</div>
                      <div className="flex items-center"><span className="text-green-600 mr-2">✅</span> Teachers</div>
                      <div className="flex items-center"><span className="text-green-600 mr-2">✅</span> Students</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border-2 border-blue-300">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">🏫 Admin (Centro Educativo):</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center"><span className="text-red-600 mr-2">❌</span> Owners</div>
                      <div className="flex items-center"><span className="text-red-600 mr-2">❌</span> Admins</div>
                      <div className="flex items-center"><span className="text-green-600 mr-2">✅</span> Teachers</div>
                      <div className="flex items-center"><span className="text-blue-600 mr-2">📋</span> Students (vía Teachers)</div>
                    </div>
                    <div className="mt-3 bg-blue-100 rounded p-2 text-xs">
                      Los profesores añaden estudiantes
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border-2 border-green-300">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">👨‍🏫 Teacher puede crear:</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center"><span className="text-red-600 mr-2">❌</span> Owners</div>
                      <div className="flex items-center"><span className="text-red-600 mr-2">❌</span> Admins</div>
                      <div className="flex items-center"><span className="text-red-600 mr-2">❌</span> Teachers</div>
                      <div className="flex items-center"><span className="text-green-600 mr-2">✅</span> Students</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border-2 border-purple-300">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">🔑 Métodos de Login:</h3>
                    <div className="space-y-2 text-sm">
                      <div><strong>Owner/Admin/Teacher:</strong><br/>Email + Contraseña</div>
                      <div className="border-t pt-2"><strong>Student:</strong><br/>Usuario + Contraseña</div>
                    </div>
                  </div>
                </div>

                {/* Table: Campos por Tipo */}
                <div className="mt-6 bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 px-6 py-3">
                    <h3 className="text-lg font-bold text-gray-900">Campos por Tipo de Usuario</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="text-left p-3 font-bold">Campo</th>
                          <th className="text-center p-3 font-bold">Owner</th>
                          <th className="text-center p-3 font-bold">Admin</th>
                          <th className="text-center p-3 font-bold">Teacher</th>
                          <th className="text-center p-3 font-bold">Student</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { field: "Nombre Completo", owner: true as const, admin: true as const, teacher: true as const, student: true as const },
                          { field: "Email", owner: true as const, admin: true as const, teacher: true as const, student: true as const },
                          { field: "Nombre de Usuario", owner: false as const, admin: false as const, teacher: false as const, student: true as const },
                          { field: "Contraseña", owner: true as const, admin: true as const, teacher: true as const, student: true as const },
                          { field: "Sexo", owner: false as const, admin: false as const, teacher: false as const, student: true as const },
                          { field: "Edad", owner: false as const, admin: false as const, teacher: false as const, student: "opcional" as const },
                          { field: "Profesor Asignado", owner: false as const, admin: false as const, teacher: false as const, student: true as const },
                          { field: "Evaluación", owner: false as const, admin: false as const, teacher: false as const, student: true as const },
                        ].map((row, index) => (
                          <tr key={index} className="border-t border-gray-200">
                            <td className="p-3 font-medium">{row.field}</td>
                            <td className="text-center p-3">
                              {row.owner === true && <span className="text-green-600 text-lg">✅</span>}
                              {row.owner === false && <span className="text-gray-300 text-lg">—</span>}
                              {typeof row.owner === 'string' && <span className="text-blue-600 text-xs">📝</span>}
                            </td>
                            <td className="text-center p-3">
                              {row.admin === true && <span className="text-green-600 text-lg">✅</span>}
                              {row.admin === false && <span className="text-gray-300 text-lg">—</span>}
                              {typeof row.admin === 'string' && <span className="text-blue-600 text-xs">📝</span>}
                            </td>
                            <td className="text-center p-3">
                              {row.teacher === true && <span className="text-green-600 text-lg">✅</span>}
                              {row.teacher === false && <span className="text-gray-300 text-lg">—</span>}
                              {typeof row.teacher === 'string' && <span className="text-blue-600 text-xs">📝</span>}
                            </td>
                            <td className="text-center p-3">
                              {row.student === true && <span className="text-green-600 text-lg">✅</span>}
                              {typeof row.student === 'string' && <span className="text-blue-600 text-xs">📝 opcional</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* Footer */}
              <div className="border-t-2 border-gray-200 pt-8 mt-12 text-center">
                <p className="text-gray-600 text-sm mb-2">
                  <strong>Última actualización:</strong> Enero 2025 | <strong>Versión del Manual:</strong> 1.0
                </p>
                <p className="text-gray-500 text-xs">
                  Para soporte adicional o problemas técnicos, contactar al administrador del sistema.
                </p>
                <div className="mt-6">
                  <Link
                    href="/"
                    className="inline-block bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    Volver al Sistema EduDivSex
                  </Link>
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12 py-6 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 text-sm">
          <p>© 2025 EduDivSex - Sistema de Educación Sexual para Niños</p>
        </div>
      </footer>
    </div>
  );
}
