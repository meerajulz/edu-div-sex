# Manual de Usuario - Dashboard de Gestión Educativa

## Tabla de Contenidos
1. [Introducción](#introducción)
2. [Tipos de Usuarios del Dashboard](#tipos-de-usuarios-del-dashboard)
3. [Guía para Propietarios (Owner)](#guía-para-propietarios-owner)
4. [Guía para Administradores (Admin)](#guía-para-administradores-admin)
5. [Guía para Profesores (Teacher)](#guía-para-profesores-teacher)
6. [Preguntas Frecuentes](#preguntas-frecuentes)

---

## Introducción

Este es el **Dashboard de Gestión** del sistema educativo. Está diseñado para que propietarios, administradores y profesores puedan gestionar estudiantes, hacer seguimiento de su progreso académico y evaluar sus niveles de supervisión.

**Nota**: Los estudiantes no acceden a este dashboard. Ellos utilizan la aplicación educativa directamente.

---

## Tipos de Usuarios del Dashboard

El dashboard está disponible para **3 tipos de usuarios**:

| Tipo | Permisos | Descripción |
|------|----------|-------------|
| **Owner (Propietario)** | Control total | Puede crear y gestionar todos los usuarios del sistema |
| **Admin (Administrador)** | Gestión limitada | Puede gestionar profesores asignados y sus estudiantes |
| **Teacher (Profesor)** | Gestión de estudiantes | Puede crear y gestionar sus propios estudiantes |

---

## Guía para Propietarios (Owner)

### ¿Qué puede hacer un Owner?

Como propietario del sistema, tienes **control total** sobre todos los usuarios y funcionalidades.

### 1. Iniciar Sesión

1. Ve a la página de inicio de sesión
2. Ingresa tu **email** y **contraseña**
3. Haz clic en **"Iniciar Sesión"**

### 2. Crear un Administrador

Los administradores te ayudan a gestionar profesores y estudiantes.

**Pasos:**

1. Ve al menú lateral → **"Usuarios"**
2. Haz clic en **"+ Crear Usuario"**
3. Completa el formulario:
   - **Nombre completo**: Ejemplo: "María García"
   - **Email**: Ejemplo: "maria@escuela.com"
   - **Rol**: Selecciona **"Administrador"**
   - **Contraseña**: Crea una contraseña segura
4. Haz clic en **"Crear Usuario"**

### 3. Crear un Profesor

**Pasos:**

1. Ve al menú lateral → **"Usuarios"**
2. Haz clic en **"+ Crear Usuario"**
3. Completa el formulario:
   - **Nombre completo**: Ejemplo: "Juan Pérez"
   - **Email**: Ejemplo: "juan@escuela.com"
   - **Rol**: Selecciona **"Profesor"**
   - **Contraseña**: Crea una contraseña segura
4. (Opcional) **Asignar Administrador**: Selecciona qué administrador supervisará a este profesor
5. Haz clic en **"Crear Usuario"**

### 4. Ver Todos los Usuarios

**Pasos:**

1. Ve al menú lateral → **"Usuarios"**
2. Verás una lista con todos los usuarios del sistema
3. Puedes filtrar por rol usando el menú desplegable
4. Haz clic en **"Ver"** para ver detalles de un usuario
5. Haz clic en **"Editar"** para modificar un usuario

### 5. Ver Analíticas del Sistema

**Pasos:**

1. Ve al menú lateral → **"Analíticas"**
2. Verás estadísticas globales:
   - Total de estudiantes, profesores y administradores
   - Estudiantes activos
   - Promedio de estudiantes por profesor
   - Actividad reciente

### 6. Gestionar Asignaciones Profesor-Admin

**Pasos:**

1. Ve al menú lateral → **"Asignaciones"**
2. Selecciona un **Administrador**
3. Selecciona los **Profesores** que quieres asignar a ese administrador
4. Haz clic en **"Guardar Asignaciones"**

### 7. Cerrar Sesión

1. Haz clic en tu nombre de usuario (esquina superior derecha)
2. Selecciona **"Cerrar Sesión"**

---

## Guía para Administradores (Admin)

### ¿Qué puede hacer un Admin?

Como administrador, puedes gestionar a los **profesores asignados** a ti y a **todos sus estudiantes**.

### 1. Iniciar Sesión

1. Ve a la página de inicio de sesión
2. Ingresa tu **email** y **contraseña**
3. Haz clic en **"Iniciar Sesión"**

### 2. Ver Profesores Asignados

**Pasos:**

1. Ve al menú lateral → **"Profesores"**
2. Verás la lista de profesores que te han sido asignados
3. Puedes ver cuántos estudiantes tiene cada profesor
4. Haz clic en **"Ver"** para ver detalles de un profesor

### 3. Crear un Estudiante

**Pasos:**

1. Ve al menú lateral → **"Estudiantes"** → **"Todos los Estudiantes"**
2. Haz clic en **"+ Crear Usuario"**
3. Completa el formulario:

#### Información Básica:
- **Nombre**: Ejemplo: "Ana"
- **Apellido**: Ejemplo: "López"
- **Email**: Ejemplo: "ana@estudiante.com"
- **Rol**: Debe estar en **"Estudiante"**
- **Edad**: Ejemplo: "10"
- **Sexo**: Selecciona "Masculino" o "Femenino"
- **Profesor**: **IMPORTANTE** - Selecciona el profesor que supervisará al estudiante

#### Crear Login (Opcional):
- Marca la casilla **"Crear credenciales de inicio de sesión"**
- El sistema generará automáticamente:
  - Un **nombre de usuario** único
  - Una **contraseña simple** y fácil de recordar
- **IMPORTANTE**: Guarda estas credenciales y compártelas con el estudiante

#### Evaluación de Nivel del Estudiante:

Esta sección es **muy importante** porque determina el **Nivel de Supervisión** del estudiante.

**¿Qué son los niveles de supervisión?**

- **Nivel 1** (Rojo): El estudiante necesita **100% supervisión** (menos independiente)
- **Nivel 2** (Amarillo): El estudiante necesita **50% supervisión** (parcialmente independiente)
- **Nivel 3** (Verde): El estudiante es **independiente** (no necesita supervisión constante)

**¿Cómo se calcula?**

El sistema evalúa **4 habilidades**. Para cada pregunta, selecciona la opción que mejor describe al estudiante:

1. **Lectura**: ¿Cómo lee el estudiante?
   - **Ninguno** (0): No puede leer
   - **A veces** (0.5): Lee con dificultad
   - **Siempre** (1): Lee con fluidez

2. **Comprensión**: ¿Entiende lo que lee?
   - **Ninguno** (0): No comprende
   - **A veces** (0.5): Comprende parcialmente
   - **Siempre** (1): Comprende completamente

3. **Atención**: ¿Puede concentrarse?
   - **Ninguno** (0): Se distrae fácilmente
   - **A veces** (0.5): Se concentra por períodos cortos
   - **Siempre** (1): Mantiene la atención

4. **Habilidades Motoras**: ¿Puede usar el mouse/teclado?
   - **Ninguno** (0): Necesita mucha ayuda
   - **A veces** (0.5): Necesita algo de ayuda
   - **Siempre** (1): Usa dispositivos sin ayuda

**Ejemplo 1**: Si seleccionas **"Ninguno"** en todas → Nivel 3 (Independiente - irónicamente, porque "Ninguno" significa que NO necesita supervisión)

**Ejemplo 2**: Si seleccionas **"Siempre"** en todas → Nivel 1 (Necesita 100% supervisión)

**Ejemplo 3**: Si mezclas respuestas → Nivel 2 (Necesita 50% supervisión)

4. Haz clic en **"Crear Estudiante"**

### 4. Ver Todos los Estudiantes

**Pasos:**

1. Ve al menú lateral → **"Estudiantes"** → **"Todos los Estudiantes"**
2. Verás la lista de estudiantes de tus profesores asignados
3. Puedes filtrar por profesor usando el menú desplegable
4. Verás para cada estudiante:
   - **Nombre completo**
   - **Email**
   - **Nivel de Supervisión** (con color)
   - **Acciones**: Ver detalles o Editar

### 5. Ver Detalles de un Estudiante

**Pasos:**

1. En la lista de estudiantes, haz clic en **"Ver Detalles"**
2. Verás:
   - Información personal
   - Habilidades evaluadas
   - **Nivel de Supervisión**
   - Progreso académico (escenas completadas)
   - Notas del profesor

### 6. Editar un Estudiante

**Pasos:**

1. En la lista de estudiantes, haz clic en **"Editar"**
2. Puedes modificar:
   - Información personal
   - Habilidades (si cambias las habilidades, el **Nivel de Supervisión se recalculará automáticamente**)
3. Haz clic en **"Guardar Cambios"**

### 7. Ver Reportes

**Pasos:**

1. Ve al menú lateral → **"Reportes"**
2. Verás estadísticas de **solo tus profesores y estudiantes asignados**:
   - Total de estudiantes y profesores
   - Estudiantes activos
   - Actividad reciente
   - Estudiantes por profesor

### 8. Cerrar Sesión

1. Haz clic en tu nombre de usuario (esquina superior derecha)
2. Selecciona **"Cerrar Sesión"**

---

## Guía para Profesores (Teacher)

### ¿Qué puede hacer un Profesor?

Como profesor, puedes **crear y gestionar a tus propios estudiantes** y hacer seguimiento de su progreso académico.

### 1. Iniciar Sesión

1. Ve a la página de inicio de sesión
2. Ingresa tu **email** y **contraseña**
3. Haz clic en **"Iniciar Sesión"**

### 2. Ver el Dashboard Principal

Al iniciar sesión verás:
- **Total de estudiantes** que tienes
- **Estudiantes activos**
- **Actividades completadas**

### 3. Crear un Estudiante

**Pasos:**

1. Ve al menú lateral → **"Lista de Estudiantes"**
2. Haz clic en **"+ Agregar Estudiante"**
3. Completa el formulario (igual que el Admin):

#### Información Básica:
- **Nombre**: Ejemplo: "Carlos"
- **Apellido**: Ejemplo: "Ramírez"
- **Email**: Ejemplo: "carlos@estudiante.com"
- **Edad**: Ejemplo: "8"
- **Sexo**: Selecciona "Masculino" o "Femenino"

**Nota**: El profesor se asigna automáticamente (eres tú).

#### Crear Login (Opcional):
- Marca **"Crear credenciales de inicio de sesión"**
- El sistema generará usuario y contraseña
- **IMPORTANTE**: Anota estas credenciales para dárselas al estudiante

#### Evaluación de Nivel del Estudiante:

Evalúa las **4 habilidades** del estudiante (ver explicación detallada en la sección de Admin arriba):

1. **Lectura**
2. **Comprensión**
3. **Atención**
4. **Habilidades Motoras**

El sistema calculará automáticamente el **Nivel de Supervisión** (1, 2 o 3).

4. Haz clic en **"Crear Estudiante"**

### 4. Ver Lista de Estudiantes

**Pasos:**

1. Ve al menú lateral → **"Lista de Estudiantes"**
2. Verás una tabla con:
   - **Nombre completo**
   - **Email**
   - **Nivel de Supervisión** (badge con color)
   - **Acciones** (Ver Detalles, Editar)

### 5. Ver Detalles de un Estudiante

**Pasos:**

1. Haz clic en **"Ver Detalles"** en la fila del estudiante
2. Verás:
   - **Información personal**: Nombre, edad, sexo, usuario
   - **Habilidades**: Lectura, comprensión, atención, habilidades motoras (cada una con nivel 1-5)
   - **Nivel de Supervisión**: Badge grande con color
   - **Progreso Académico**:
     - Barra de progreso general
     - Progreso por actividad
     - Estado de cada escena (Completado, En progreso, No iniciado)
     - Intentos realizados
     - Última fecha de acceso

### 6. Editar un Estudiante

**Pasos:**

1. En la lista de estudiantes, haz clic en **"Editar"**
2. Puedes modificar:
   - Información personal
   - **Habilidades**: Si cambias los niveles de habilidad, el **Nivel de Supervisión se recalculará automáticamente**
   - Notas sobre el estudiante
3. Haz clic en **"Guardar Cambios"**

**IMPORTANTE**: Cuando editas las habilidades (lectura, comprensión, atención, habilidades motoras), el sistema recalcula el Nivel de Supervisión automáticamente.

### 7. Añadir Notas a un Estudiante

**Pasos:**

1. Ve a los detalles del estudiante
2. Busca la sección **"Notas del Estudiante"**
3. Haz clic en **"Editar Notas"**
4. Escribe tus observaciones sobre el estudiante
5. Haz clic en **"Guardar"**

### 8. Ver Perfil de Profesor

**Pasos:**

1. Ve al menú lateral → **"Mi Perfil"**
2. Verás:
   - Tu información personal
   - Estadísticas (total de estudiantes, estudiantes activos)
   - Administradores asignados (si los tienes)

### 9. Cerrar Sesión

1. Haz clic en tu nombre de usuario (esquina superior derecha)
2. Selecciona **"Cerrar Sesión"**

---

## Preguntas Frecuentes

### 1. ¿Qué es el Nivel de Supervisión?

El **Nivel de Supervisión** indica cuánta ayuda necesita un estudiante:

- **Nivel 1 (Rojo)**: Necesita **100% supervisión** - El estudiante requiere ayuda constante
- **Nivel 2 (Amarillo)**: Necesita **50% supervisión** - El estudiante necesita ayuda moderada
- **Nivel 3 (Verde)**: **Independiente** - El estudiante puede trabajar solo

### 2. ¿Cómo se calcula el Nivel de Supervisión?

El sistema evalúa 4 habilidades:
1. Lectura (1-5)
2. Comprensión (1-5)
3. Atención (1-5)
4. Habilidades Motoras (1-5)

Calcula el **promedio** de las 4 habilidades y asigna el nivel:
- **Promedio 3.68-5**: Nivel 3 (Independiente)
- **Promedio 2.36-3.67**: Nivel 2 (50% supervisión)
- **Promedio 1-2.35**: Nivel 1 (100% supervisión)

### 3. ¿Puedo cambiar el Nivel de Supervisión de un estudiante?

Sí, pero **no directamente**. Debes:
1. Ir a **"Editar"** el estudiante
2. Modificar los **niveles de habilidad** (Lectura, Comprensión, Atención, Habilidades Motoras)
3. El sistema **recalculará automáticamente** el Nivel de Supervisión
4. Guardar los cambios

### 4. ¿Qué significa el formulario de evaluación?

El formulario de evaluación tiene preguntas como:
- **"¿El estudiante puede leer?"**
  - **Ninguno**: Significa que NO necesita ayuda para leer (independiente)
  - **A veces**: Necesita algo de ayuda
  - **Siempre**: Siempre necesita ayuda para leer

**IMPORTANTE**: "Ninguno" significa que el estudiante NO necesita supervisión en esa área.

### 5. ¿Cómo asigno un administrador a un profesor?

Solo el **Owner** puede hacer esto:
1. Ve a **"Usuarios"**
2. Busca o crea el profesor
3. Al crear/editar, selecciona el **Administrador** en el campo correspondiente
4. Guarda los cambios

### 6. ¿Por qué no veo a todos los estudiantes?

Depende de tu rol:
- **Owner**: Ve **todos** los estudiantes
- **Admin**: Ve estudiantes de sus **profesores asignados**
- **Teacher**: Ve **solo sus propios** estudiantes

### 7. ¿Puedo eliminar un usuario?

Sí:
- **Owner**: Puede eliminar cualquier usuario
- **Admin**: Puede eliminar estudiantes de sus profesores
- **Teacher**: Puede eliminar sus propios estudiantes

**Nota**: La eliminación es "suave" - el usuario se marca como inactivo pero sus datos se conservan.

### 8. ¿Cómo genero credenciales de login para un estudiante?

Al crear un estudiante:
1. Marca la casilla **"Crear credenciales de inicio de sesión"**
2. El sistema generará:
   - **Usuario**: Basado en nombre y apellido (ej: "ana.lopez")
   - **Contraseña**: Una contraseña simple aleatoria
3. **IMPORTANTE**: Anota estas credenciales y compártelas con el estudiante

### 9. ¿Qué hago si olvido mi contraseña?

Contacta a:
- **Estudiantes**: Contacta a tu profesor
- **Profesores**: Contacta a tu administrador o al owner
- **Admins**: Contacta al owner
- **Owner**: Contacta al administrador del sistema

### 10. ¿Puedo cambiar los niveles de habilidad después de crear un estudiante?

**Sí**, puedes editarlos:
1. Ve a la lista de estudiantes
2. Haz clic en **"Editar"**
3. Modifica los valores de las habilidades
4. El **Nivel de Supervisión se actualizará automáticamente**
5. Guarda los cambios

---

## Soporte Técnico

Si tienes problemas técnicos o preguntas, contacta al administrador del sistema.

---

**Última actualización**: 2025

**Versión del Manual**: 1.0
