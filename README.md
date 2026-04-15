<div align="center">

<br/>

```
 ██╗      ██████╗  ██████╗ ██████╗ ███████╗██╗  ██╗██╗██╗     ██╗
 ██║     ██╔═══██╗██╔═══██╗██╔══██╗██╔════╝██║ ██╔╝██║██║     ██║
 ██║     ██║   ██║██║   ██║██████╔╝███████╗█████╔╝ ██║██║     ██║
 ██║     ██║   ██║██║   ██║██╔═══╝ ╚════██║██╔═██╗ ██║██║     ██║
 ███████╗╚██████╔╝╚██████╔╝██║     ███████║██║  ██╗██║███████╗███████╗
 ╚══════╝ ╚═════╝  ╚═════╝ ╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝
```

**Plataforma MOOC con recomendaciones personalizadas y control de acceso por planes**

<br/>

![Angular](https://img.shields.io/badge/Angular-18-DD0031?style=flat-square&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-MariaDB-4479A1?style=flat-square&logo=mysql&logoColor=white)
![AWS](https://img.shields.io/badge/Deploy-AWS-FF9900?style=flat-square&logo=amazonaws&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-1D9E75?style=flat-square)
![Status](https://img.shields.io/badge/Status-En%20desarrollo-1D9E75?style=flat-square)

<br/>

> *Proyecto de Fin de Grado · Desarrollo de Aplicaciones Web · 2025–2026*

</div>

---

## ¿Qué es LoopSkill?

LoopSkill es una plataforma de formación online construida como proyecto de TFG del ciclo DAW. La idea es ofrecer una experiencia de aprendizaje más clara y personalizada que la de las grandes plataformas generalistas, con un catálogo de cursos técnicos organizado por categorías y niveles, recomendaciones basadas en los intereses del usuario y un sistema de acceso por planes de suscripción (Free, Pro y Premium).

El proyecto sigue una arquitectura cliente-servidor clásica: **Angular** en el frontend, **Node.js con Express** en el backend y **MySQL/MariaDB** como base de datos, con despliegue previsto en **AWS**.

---

## Estado del proyecto

La versión actual cubre el frontend completo en modo mock. El backend está en desarrollo paralelo y la integración está prevista para la siguiente fase del TFG.

| Módulo | Estado |
|---|---|
| Autenticación y registro | ✅ Implementado |
| Onboarding de intereses | ✅ Implementado |
| Home, Explore y Course Detail | ✅ Implementado |
| Planes y suscripciones | ✅ Mock funcional |
| My Learnings y seguimiento | ✅ Implementado |
| Settings de usuario | ✅ Implementado |
| Panel de administración | 🔧 Parcial (Create/Delete) |
| Integración con backend | ⏳ Pendiente |

---

## Stack tecnológico

**Frontend**
- Angular 18 (arquitectura standalone, routing, SCSS)
- TypeScript con modelos tipados (User, Course, Plan)
- LocalStorage como capa de persistencia mock

**Backend (en desarrollo)**
- Node.js + Express como API REST
- MySQL / MariaDB con esquema relacional normalizado

**Infraestructura**
- GitHub para control de versiones y trabajo en equipo
- Figma para el diseño de pantallas y prototipado
- AWS como plataforma de despliegue final

---

## Funcionalidades principales

**Para el usuario**
- Registro, login y onboarding de intereses personalizado
- Homepage dinámica que cambia según el estado del usuario
- Catálogo explorable por categorías con filtros
- Detalle de curso con control de acceso por plan
- Seguimiento del progreso (cursos en marcha y completados)
- Gestión de cuenta, contraseña e intereses desde Settings
- Cambio de plan de suscripción (Free → Pro → Premium)

**Para el administrador**
- Panel de administración accesible desde Settings si el usuario tiene `role: admin`
- Visualización del catálogo completo
- Creación y eliminación de cursos
- Edición de cursos *(en desarrollo)*

---

## Estructura del proyecto

```
loopskill-frontend/
├── src/
│   ├── app/
│   │   ├── core/               # Servicios globales (AuthService, CourseService, EnrollmentService)
│   │   ├── shared/             # Componentes reutilizables
│   │   └── features/
│   │       ├── home/
│   │       ├── explore/
│   │       ├── course-detail/
│   │       ├── plans/
│   │       ├── my-learnings/
│   │       ├── settings/
│   │       └── auth/
│   ├── assets/
│   └── styles/                 # Variables SCSS globales e identidad visual
└── ...
```

---

## Base de datos

El esquema relacional está diseñado para soportar todas las funcionalidades del sistema. Las tablas principales son:

```
users           → datos del usuario, rol y plan contratado
courses         → catálogo completo con nivel, categoría y plan requerido
categories      → clasificación del catálogo
plans           → Free, Pro y Premium
plan_features   → características de cada plan (normalizado)
tags            → etiquetas de los cursos
course_tags     → relación curso-etiqueta
user_interests  → intereses seleccionados por el usuario
course_outcomes → resultados de aprendizaje de cada curso
enrollments     → matrícula del usuario con porcentaje de progreso
```

El modelo permite implementar recomendaciones por coincidencia entre `user_interests` y `course_tags`, y escalar hacia un algoritmo más sofisticado en fases posteriores.

---

## Decisiones de diseño relevantes

**Arquitectura orientada al backend desde el principio.** Aunque el backend aún no está disponible, toda la lógica de negocio reside en servicios (AuthService, EnrollmentService, CourseService) y no en mocks acoplados a los componentes. Cuando la API esté lista, la integración se reduce a sustituir LocalStorage por llamadas HTTP dentro de esos mismos servicios.

**Identidad visual propia.** Se ha definido un lenguaje visual limpio y moderno con el verde de LoopSkill como color principal, radios generosos, sombras suaves y bastante espacio entre bloques. El símbolo de infinito de la marca aparece como elemento decorativo en algunos hero sections.

**Roles sin campos artificiales.** La distinción entre usuario estándar y administrador se apoya en el campo `role` ya presente en el modelo de datos, sin introducir booleanos extra ni lógica paralela.

---

## Capturas de pantalla

> *Próximamente — se añadirán una vez completada la integración con el backend.*

---

## Cómo ejecutar el proyecto

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/loopskill.git

# Instalar dependencias
cd loopskill-frontend
npm install

# Arrancar en modo desarrollo
ng serve

# La aplicación estará disponible en http://localhost:4200
```

> El frontend funciona de forma independiente sin backend gracias a la capa de persistencia mock con LocalStorage. No se requiere ninguna configuración adicional para explorarlo.

---

## Próximos pasos

- [ ] Completar la edición de cursos en el panel de administración
- [ ] Migrar la lectura de `MOCK_COURSES` a `CourseService` en todas las pantallas
- [ ] Conectar con la API REST del backend cuando esté disponible
- [ ] Desplegar en AWS
- [ ] Añadir tests unitarios sobre los servicios principales

---

## Licencia

Este proyecto se distribuye bajo licencia **MIT**. Se permite reutilizar, modificar y distribuir el código manteniendo la referencia a la autoría original.

```
MIT License · 2026 · Guerrero & Jiménez
```

---

<div align="center">

*Proyecto desarrollado como TFG del ciclo de Desarrollo de Aplicaciones Web.*
*Si tienes alguna pregunta o sugerencia, puedes abrir un issue o contactarme directamente.*

<br/>

![Made with Angular](https://img.shields.io/badge/Made%20with-Angular-DD0031?style=flat-square&logo=angular)
![DAW](https://img.shields.io/badge/FP-DAW-1D9E75?style=flat-square)

</div>
