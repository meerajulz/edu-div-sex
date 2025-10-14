# Manual de Gestión de Usuarios
## Sistema EduDivSex - Dashboard Administrativo

---

## Tabla de Contenidos
1. [Tipos de Usuarios](#tipos-de-usuarios)
2. [Jerarquía de Permisos](#jerarquía-de-permisos)
3. [Cómo Crear Usuarios](#cómo-crear-usuarios)
   - [Crear Propietario (Owner)](#crear-propietario-owner)
   - [Crear Administrador (Admin)](#crear-administrador-admin)
   - [Crear Profesor (Teacher)](#crear-profesor-teacher)
   - [Crear Estudiante (Student)](#crear-estudiante-student)
4. [Gestión de Contraseñas](#gestión-de-contraseñas)
5. [Después de Crear un Usuario](#después-de-crear-un-usuario)
6. [Preguntas Frecuentes](#preguntas-frecuentes)

---

## Tipos de Usuarios

El sistema tiene **4 tipos de usuarios** con diferentes niveles de acceso:

### 1. **Propietario (Owner)** 👑
- **Nivel más alto de acceso**
- Acceso completo al sistema
- Puede crear y gestionar todos los tipos de usuarios
- Puede modificar y eliminar todos los datos
- **Login:** Email + Contraseña

### 2. **Administrador (Admin)** 🛡️
- Puede gestionar profesores asignados y sus estudiantes
- Puede crear profesores y estudiantes
- Debe asignar estudiantes a profesores existentes
- Acceso a reportes y análisis
- **Login:** Email + Contraseña

### 3. **Profesor (Teacher)** 👨‍🏫
- Puede crear y gestionar sus propios estudiantes
- Acceso a progreso de sus estudiantes
- Puede generar reportes de sus estudiantes
- **Login:** Email + Contraseña

### 4. **Estudiante (Student)** 👦
- Acceso a las actividades educativas
- Perfil personalizado según evaluación inicial
- Progreso rastreado automáticamente
- **Login:** Nombre de Usuario + Contraseña (NO usa email)

---

## Jerarquía de Permisos

```
Owner (Propietario)
  ├── Puede crear: Owners, Admins, Teachers, Students
  ├── Puede gestionar: Todos los usuarios
  └── Acceso: Completo

Admin (Administrador)
  ├── Puede crear: Teachers, Students
  ├── Puede gestionar: Teachers asignados y Students bajo esos teachers
  └── Acceso: Limitado a su área

Teacher (Profesor)
  ├── Puede crear: Students
  ├── Puede gestionar: Solo sus propios Students
  └── Acceso: Solo sus estudiantes

Student (Estudiante)
  └── Acceso: Solo actividades educativas
```

---

## Cómo Crear Usuarios

### Navegación General

#### Para Propietarios (Owners):
1. Ingresar al Dashboard
2. Ir a la sección lateral "Gestionar Usuarios" o rutas específicas:
   - **Administradores**: `/dashboard/owner/admins` → Click "+ Crear Administrador"
   - **Profesores**: `/dashboard/owner/teachers` → Click "+ Crear Profesor"
   - **Estudiantes**: `/dashboard/owner/students` → Click "+ Crear Estudiante"
3. O usar la ruta general: `/dashboard/owner/users/create`

#### Para Administradores (Admins):
1. Ingresar al Dashboard
2. Ir a la sección lateral "Gestionar Usuarios"
3. Seleccionar "Profesores" o "Estudiantes"
4. Click en el botón "+ Crear"
5. O usar la ruta: `/dashboard/admin/users/create`

#### Para Profesores (Teachers):
1. Ingresar al Dashboard
2. Ir a "Mis Estudiantes"
3. Click "+ Crear Estudiante"

---

## Crear Propietario (Owner)

> ⚠️ **ADVERTENCIA**: Solo los propietarios existentes pueden crear nuevos propietarios. Este rol tiene acceso completo al sistema.

### Campos Requeridos:
- ✅ **Nombre Completo** - Nombre y apellido del propietario
- ✅ **Email** - Email único en el sistema (se verifica automáticamente)
- ✅ **Rol**: Propietario (pre-seleccionado)
- ✅ **Contraseña** - Ver [Gestión de Contraseñas](#gestión-de-contraseñas)

### Pasos:
1. Navegar a `/dashboard/owner/users/create`
2. Seleccionar rol "Propietario" (si aplica)
3. Llenar el formulario:
   ```
   Nombre Completo: Juan Pérez García
   Email: juan.perez@empresa.com
   Rol: Propietario
   ```
4. Configurar contraseña:
   - **Opción 1 (Recomendada)**: Usar contraseña generada automáticamente
   - **Opción 2**: Crear contraseña personalizada (mínimo 8 caracteres)
5. Revisar advertencia de seguridad
6. Click "Crear Propietario"
7. **IMPORTANTE**: Guardar o enviar las credenciales mostradas en la página de éxito

### Notas Especiales:
- ⚠️ El nuevo propietario tendrá acceso completo inmediato
- ⚠️ Puede modificar y eliminar cualquier dato del sistema
- ⚠️ Se recomienda limitar el número de propietarios

---

## Crear Administrador (Admin)

> 🛡️ Solo los **Propietarios** pueden crear administradores

### Campos Requeridos:
- ✅ **Nombre Completo** - Nombre y apellido del administrador
- ✅ **Email** - Email único en el sistema
- ✅ **Rol**: Administrador (pre-seleccionado)
- ✅ **Contraseña** - Generada o personalizada

### Pasos:
1. Navegar a `/dashboard/owner/admins`
2. Click "+ Crear Administrador"
3. Llenar el formulario:
   ```
   Nombre Completo: María López Sánchez
   Email: maria.lopez@empresa.com
   Rol: Administrador
   ```
4. Configurar contraseña (recomendado: generada automáticamente)
5. Click "Crear Administrador"
6. Guardar las credenciales de acceso

### Permisos del Administrador:
- ✅ Puede crear profesores
- ✅ Puede crear estudiantes (debe asignarlos a un profesor)
- ✅ Puede gestionar profesores asignados
- ✅ Puede ver reportes de estudiantes bajo su supervisión
- ❌ NO puede crear propietarios u otros administradores
- ❌ NO puede modificar datos de otros administradores

---

## Crear Profesor (Teacher)

> 👨‍🏫 Los **Propietarios** y **Administradores** pueden crear profesores

### Campos Requeridos:
- ✅ **Nombre Completo** - Nombre y apellido del profesor
- ✅ **Email** - Email único en el sistema
- ✅ **Rol**: Profesor (pre-seleccionado)
- ✅ **Contraseña** - Generada o personalizada

### Pasos:

#### Para Propietarios:
1. Navegar a `/dashboard/owner/teachers`
2. Click "+ Crear Profesor"
3. Llenar el formulario:
   ```
   Nombre Completo: Carlos Rodríguez Martínez
   Email: carlos.rodriguez@escuela.com
   Rol: Profesor
   ```
4. Configurar contraseña
5. Click "Crear Profesor"

#### Para Administradores:
1. Navegar a `/dashboard/admin/users/create?role=teacher`
2. Llenar el formulario (campos idénticos)
3. Click "Crear Profesor"

### Permisos del Profesor:
- ✅ Puede crear estudiantes (asignados automáticamente a él)
- ✅ Puede ver progreso de sus estudiantes
- ✅ Puede editar información de sus estudiantes
- ✅ Puede generar reportes de sus estudiantes
- ❌ NO puede crear otros profesores
- ❌ NO puede ver estudiantes de otros profesores

---

## Crear Estudiante (Student)

> 👦 Los **Propietarios**, **Administradores** y **Profesores** pueden crear estudiantes

### Campos Requeridos:
- ✅ **Nombre Completo** - Nombre y apellido del estudiante
- ✅ **Email** - Email único (para comunicación con padres/tutores)
- ✅ **Nombre de Usuario** - Usuario único para login (NO email)
- ✅ **Sexo** - Masculino o Femenino
- ✅ **Edad** - Opcional pero recomendado para personalización
- ✅ **Contraseña** - Generada o personalizada
- ✅ **Profesor Asignado** - Solo para Owner/Admin
- ✅ **Evaluación de Nivel** - Formulario obligatorio

### Pasos:

#### Para Propietarios:
1. Navegar a `/dashboard/owner/students` o `/dashboard/owner/users/create?role=student`
2. Click "+ Crear Estudiante"
3. Llenar información básica:
   ```
   Nombre Completo: Ana García López
   Email: ana.garcia@padres.com (email de contacto)
   Nombre de Usuario: anagarcia123 (para login del estudiante)
   Sexo: Femenino
   Edad: 8 (opcional)
   ```
4. **Seleccionar Profesor Asignado**:
   - Aparecerá lista de profesores disponibles
   - Seleccionar el profesor responsable del estudiante
5. Configurar contraseña
6. **Completar Evaluación de Nivel** (ver sección detallada abajo)
7. Click "Crear Estudiante"

#### Para Administradores:
1. Navegar a `/dashboard/admin/users/create?role=student`
2. Seguir pasos idénticos a Propietarios
3. **IMPORTANTE**: Debe seleccionar un profesor de la lista

#### Para Profesores:
1. Navegar a `/dashboard/students` o sección "Mis Estudiantes"
2. Click "+ Crear Estudiante"
3. Llenar el formulario (sin necesidad de seleccionar profesor - se asigna automáticamente)
4. Completar evaluación
5. Click "Crear Estudiante"

### Evaluación de Nivel del Estudiante

Esta evaluación es **OBLIGATORIA** y determina los niveles iniciales de habilidades del estudiante.

#### Preguntas de Evaluación:
El sistema presenta una serie de preguntas sobre las capacidades del estudiante. Para cada pregunta:

**Paso 1: Seleccionar TIPO DE APOYO**
- **Ninguno (1)**: El estudiante puede hacer esto sin ayuda
- **Supervisión (0)**: El estudiante necesita supervisión para hacerlo

**Paso 2: Si seleccionó "Supervisión", indicar FRECUENCIA**
- **A veces (0)**: Necesita supervisión ocasionalmente
- **Siempre (1)**: Necesita supervisión constante

#### Ejemplo de Evaluación:
```
Pregunta: "¿Puede el estudiante leer instrucciones simples?"
└─ Tipo de Apoyo: Ninguno (1)
   → El estudiante puede leer instrucciones solo

Pregunta: "¿Puede el estudiante completar tareas complejas?"
└─ Tipo de Apoyo: Supervisión (0)
   └─ Frecuencia: A veces (0)
      → Necesita ayuda ocasional

Pregunta: "¿Puede el estudiante usar el mouse correctamente?"
└─ Tipo de Apoyo: Supervisión (0)
   └─ Frecuencia: Siempre (1)
      → Necesita supervisión constante
```

#### ¿Cómo se Calculan los Niveles?

El sistema calcula automáticamente estos niveles basándose en las respuestas:

**Sistema de Puntuación:**
- Ninguno (1) = 2 puntos → Estudiante independiente
- Supervisión (0) + Siempre (1) = 1 punto → Necesita ayuda ocasional
- Supervisión (0) + A veces (0) = 0 puntos → Necesita ayuda constante

**Niveles Calculados (1-5):**
- `reading_level` - Nivel de lectura
- `comprehension_level` - Nivel de comprensión
- `attention_span` - Capacidad de atención
- `motor_skills` - Habilidades motoras
- `supervision_level` - Nivel de supervisión requerida (1-3)

**Ejemplo de Cálculo:**
```
Si el estudiante responde 10 preguntas:
- 5 preguntas con "Ninguno" = 10 puntos
- 3 preguntas con "Supervisión + Siempre" = 3 puntos
- 2 preguntas con "Supervisión + A veces" = 0 puntos
Total: 13 puntos de 20 posibles = 65%

Resultado: Nivel 3-4 (de 5) en todas las habilidades
```

### Validación del Formulario

El sistema valida en tiempo real:
- ✅ **Email disponible**: Verifica que no esté en uso
- ✅ **Nombre de usuario disponible**: Verifica que sea único
- ✅ **Todos los campos requeridos**: Marca campos faltantes
- ✅ **Evaluación completa**: Al menos 1 pregunta respondida (recomendado: todas)

### Campos Opcionales vs Requeridos:

**REQUERIDOS:**
- Nombre Completo ✅
- Email ✅
- Nombre de Usuario ✅
- Sexo ✅
- Contraseña ✅
- Profesor Asignado ✅ (solo Owner/Admin)
- Evaluación (mínimo 1 pregunta) ✅

**OPCIONALES:**
- Edad (recomendado para mejor personalización)

---

## Gestión de Contraseñas

Para **TODOS** los tipos de usuario, hay dos opciones de contraseña:

### Opción 1: Contraseña Generada Automáticamente (RECOMENDADA) 🔐

**Ventajas:**
- ✅ Contraseña segura automáticamente
- ✅ Cumple requisitos de seguridad
- ✅ Fácil de regenerar si es necesaria otra
- ✅ Se muestra claramente para copiar

**Cómo funciona:**
1. Seleccionar "Generar contraseña automáticamente"
2. El sistema genera una contraseña segura (ejemplo: `K8mP#9xLq2wR`)
3. La contraseña se muestra en pantalla
4. **IMPORTANTE**: Copiar y guardar antes de crear el usuario
5. Opción de generar nueva si no gusta la actual

**Ejemplo:**
```
○ Generar contraseña automáticamente (recomendado)

  Contraseña generada: "K8mP#9xLq2wR"

  [Generar nueva contraseña]
```

### Opción 2: Contraseña Personalizada 🔑

**Requisitos:**
- ❗ Mínimo 8 caracteres
- ❗ Debe confirmar la contraseña (escribir dos veces)
- ❗ Las contraseñas deben coincidir

**Cómo funciona:**
1. Seleccionar "Contraseña personalizada"
2. Ingresar contraseña (mínimo 8 caracteres)
3. Confirmar contraseña (repetir exactamente)
4. Sistema valida que coincidan

**Ejemplo:**
```
○ Contraseña personalizada

  Contraseña: ••••••••••
  Confirmar contraseña: ••••••••••

  La contraseña debe tener al menos 8 caracteres
```

### Recomendaciones de Seguridad:
- 🔐 **Para Owners/Admins**: Usar contraseñas generadas y cambiarlas después del primer login
- 🔐 **Para Teachers**: Contraseñas generadas recomendadas
- 🔐 **Para Students**: Contraseñas simples pero seguras (para que puedan recordarlas)
  - Ejemplo: `Estudiante2024!` o `MiClave123`

---

## Después de Crear un Usuario

### Página de Éxito ✅

Después de crear cualquier usuario, el sistema muestra una página de éxito con:

```
¡Usuario Creado Exitosamente! ✓

Credenciales de Acceso:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nombre: [Nombre del usuario]
Email: [email@ejemplo.com]
Rol: [Tipo de usuario]
Nombre de Usuario: [solo para estudiantes]
Contraseña: [contraseña generada o personalizada]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Imprimir Credenciales]  [Crear Otro Usuario]  [Ver Lista de Usuarios]
```

### IMPORTANTE: Gestión de Credenciales 📋

#### ⚠️ ADVERTENCIA CRÍTICA:
**La contraseña solo se muestra UNA VEZ en esta pantalla. Después no será posible recuperarla.**

#### Pasos Recomendados:

1. **COPIAR O IMPRIMIR inmediatamente**:
   - Click en "Imprimir Credenciales" para obtener PDF
   - O copiar manualmente las credenciales

2. **Entregar credenciales de forma segura**:
   - **Para Owners/Admins/Teachers**: Email seguro o entrega en persona
   - **Para Students**: Entregar impreso al profesor o padre/tutor

3. **Verificar acceso**:
   - Pedir al usuario que inicie sesión la primera vez
   - Verificar que las credenciales funcionan
   - Recomendar cambio de contraseña en primer login

### Qué Hacer Si Se Pierde la Contraseña:

#### Antes de salir de la página de éxito:
- ✅ Se puede copiar/imprimir nuevamente

#### Después de salir:
- ❌ La contraseña NO se puede recuperar
- ✅ Se debe usar la función "Restablecer Contraseña"
- ✅ Owners/Admins pueden restablecer contraseñas de otros usuarios

### Restablecer Contraseña:

**Para Owners:**
1. Ir a `/dashboard/owner/users`
2. Buscar el usuario
3. Click "Ver" → "Editar"
4. Sección "Cambiar Contraseña"
5. Generar nueva contraseña o ingresar una personalizada

**Para Admins:**
1. Ir a `/dashboard/admin/password-reset`
2. Buscar usuario por email o nombre
3. Generar nueva contraseña
4. Entregar nueva contraseña al usuario

---

## Verificación del Sistema

### Validaciones Automáticas en Tiempo Real:

#### 1. **Email**
- ✅ Verifica formato válido
- ✅ Verifica que no esté en uso
- 🟢 Checkmark verde si está disponible
- 🔴 X roja si ya existe
- ⏱️ Animación de "Verificando..." mientras comprueba

#### 2. **Nombre de Usuario** (solo estudiantes)
- ✅ Mínimo 3 caracteres
- ✅ Verifica que no esté en uso
- 🟢 Checkmark verde si está disponible
- 🔴 X roja si ya existe
- ⏱️ Verificación con delay de 500ms (mientras escribes)

#### 3. **Contraseña**
- ✅ Mínimo 8 caracteres
- ✅ Coincidencia entre contraseña y confirmación
- ❌ Bloquea envío si no coinciden

#### 4. **Formulario Completo**
- ✅ Todos los campos requeridos llenos
- ✅ Email y username disponibles
- ✅ Contraseñas válidas y coincidentes
- ✅ Evaluación completada (para estudiantes)

### Resumen de Validación:

```
Campos requeridos pendientes:
• Nombre completo
• Email válido y disponible
• Nombre de usuario válido y disponible
• Sexo
• Profesor asignado
• Contraseña
• Complete al menos una pregunta de evaluación
```

El botón "Crear Usuario" permanece **deshabilitado** hasta que todas las validaciones pasen.

---

## Gestión de Usuarios Creados

### Ver Lista de Usuarios

#### Propietarios:
- **Todos los usuarios**: `/dashboard/owner/users`
- **Solo administradores**: `/dashboard/owner/admins`
- **Solo profesores**: `/dashboard/owner/teachers`
- **Solo estudiantes**: `/dashboard/owner/students`

#### Administradores:
- **Profesores**: `/dashboard/admin/teachers`
- **Estudiantes**: `/dashboard/admin/students`

#### Profesores:
- **Sus estudiantes**: `/dashboard/students`

### Información Mostrada en Listas:

```
┌──────────────────────────────────────────────────────────────┐
│ Nombre    │ Email            │ Estado  │ Fecha Registro │ Acciones │
├──────────────────────────────────────────────────────────────┤
│ 👤 Juan   │ juan@email.com   │ Activo  │ 15/01/2024    │ Ver │ Editar│
│ 👤 María  │ maria@email.com  │ Activo  │ 14/01/2024    │ Ver │ Editar│
│ 👤 Carlos │ carlos@email.com │ Inactivo│ 10/01/2024    │ Ver │ Editar│
└──────────────────────────────────────────────────────────────┘
```

### Editar Usuario:
1. Click en "Ver" o "Editar" en la lista
2. Modificar información permitida
3. **NO** se puede cambiar:
   - Email (identificador único)
   - Rol (requiere crear nuevo usuario)
   - Nombre de usuario (para estudiantes)

---

## Preguntas Frecuentes

### ❓ ¿Cuántos propietarios debería tener el sistema?
**R:** Se recomienda tener **2-3 propietarios máximo** para mantener control. Los propietarios tienen acceso completo y pueden modificar cualquier dato.

### ❓ ¿Cuál es la diferencia entre Admin y Owner?
**R:**
- **Owner**: Acceso total, puede crear/modificar/eliminar cualquier cosa
- **Admin**: Acceso limitado a sus profesores asignados y estudiantes bajo esos profesores

### ❓ ¿Por qué los estudiantes usan nombre de usuario en lugar de email?
**R:** Para facilitar el acceso de estudiantes jóvenes. Es más fácil recordar "juanito123" que "juanito.garcia@email.com". El email se usa para comunicación con padres/tutores.

### ❓ ¿Qué pasa si olvido asignar un profesor al crear un estudiante (Owner/Admin)?
**R:** El formulario NO te permitirá crear el estudiante sin asignar un profesor. Es un campo obligatorio para Owners y Admins.

### ❓ ¿Puedo cambiar el profesor asignado a un estudiante después?
**R:** Sí, los Owners y Admins pueden reasignar estudiantes a diferentes profesores editando el perfil del estudiante.

### ❓ ¿Qué es la evaluación de nivel y por qué es obligatoria?
**R:** La evaluación determina los niveles iniciales de habilidades del estudiante (lectura, comprensión, atención, habilidades motoras). Esto permite al sistema personalizar el contenido educativo y adaptar la dificultad de las actividades. Es obligatoria porque el sistema necesita estos datos para funcionar correctamente.

### ❓ ¿Puedo modificar la evaluación después de crear el estudiante?
**R:** Sí, la evaluación se puede actualizar en cualquier momento desde el perfil del estudiante. Se recomienda re-evaluar periódicamente para ajustar el nivel del estudiante según su progreso.

### ❓ ¿Qué pasa si no completo todas las preguntas de evaluación?
**R:** El sistema permite crear el estudiante con al menos 1 pregunta respondida, pero se recomienda completar TODAS las preguntas para obtener una evaluación precisa de los niveles del estudiante.

### ❓ ¿Cómo sé si un email o nombre de usuario ya está en uso?
**R:** El sistema verifica automáticamente mientras escribes:
- 🟢 Checkmark verde = Disponible
- 🔴 X roja = Ya en uso
- ⏱️ Spinner = Verificando...

### ❓ ¿Puedo usar la misma contraseña para varios estudiantes?
**R:** Técnicamente sí, pero **NO es recomendable** por seguridad. Cada usuario debe tener su propia contraseña única.

### ❓ ¿Qué hago si un profesor deja la institución?
**R:**
1. Reasignar sus estudiantes a otro profesor (Owner/Admin)
2. Desactivar la cuenta del profesor (no eliminar para mantener histórico)
3. Los estudiantes mantendrán todo su progreso y datos

### ❓ ¿Puedo eliminar un usuario?
**R:** Sí, pero **NO es recomendable**. Es mejor **desactivar** la cuenta para:
- Mantener registro histórico
- Preservar datos de progreso
- Posibilidad de reactivar más tarde

### ❓ ¿Cómo veo el progreso de los estudiantes?
**R:**
- **Profesores**: Ver en "Mis Estudiantes" → Click en estudiante → Ver progreso detallado
- **Admins**: Reportes y análisis de estudiantes bajo su supervisión
- **Owners**: Acceso completo a todos los reportes y análisis

### ❓ ¿Los usuarios pueden cambiar su propia contraseña?
**R:** Sí, todos los usuarios pueden cambiar su contraseña desde su perfil:
- Ir a "Mi Perfil" → "Cambiar Contraseña"
- Ingresar contraseña actual
- Ingresar nueva contraseña (mínimo 8 caracteres)

### ❓ ¿Qué información se muestra en la página de éxito después de crear un usuario?
**R:** Se muestran todas las credenciales de acceso:
- Nombre completo
- Email
- Rol
- Nombre de usuario (solo estudiantes)
- **Contraseña** (¡única oportunidad de verla!)

### ❓ ¿Puedo crear múltiples usuarios a la vez (importación masiva)?
**R:** Actualmente el sistema requiere creación individual. La importación masiva no está disponible en esta versión.

---

## Resumen Rápido

### Owner puede crear:
✅ Owners | ✅ Admins | ✅ Teachers | ✅ Students

### Admin puede crear:
❌ Owners | ❌ Admins | ✅ Teachers | ✅ Students (con profesor asignado)

### Teacher puede crear:
❌ Owners | ❌ Admins | ❌ Teachers | ✅ Students (auto-asignados)

### Campos por Tipo de Usuario:

| Campo | Owner | Admin | Teacher | Student |
|-------|-------|-------|---------|---------|
| Nombre Completo | ✅ | ✅ | ✅ | ✅ |
| Email | ✅ | ✅ | ✅ | ✅ |
| Nombre de Usuario | ❌ | ❌ | ❌ | ✅ |
| Contraseña | ✅ | ✅ | ✅ | ✅ |
| Sexo | ❌ | ❌ | ❌ | ✅ |
| Edad | ❌ | ❌ | ❌ | ✅ (opcional) |
| Profesor Asignado | ❌ | ❌ | ❌ | ✅ (Owner/Admin) |
| Evaluación | ❌ | ❌ | ❌ | ✅ |

---

## Soporte y Ayuda

Para soporte adicional o problemas técnicos:
- Contactar al administrador del sistema
- Revisar la documentación técnica en `/docs`
- Reportar problemas al equipo de desarrollo

---

**Última actualización:** Enero 2025
**Versión del Manual:** 1.0
