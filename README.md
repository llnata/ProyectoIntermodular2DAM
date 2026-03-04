# 🌿 Recordis

> Aplicación de gestión del tiempo pensada para personas con pérdida de memoria o deterioro cognitivo (Alzheimer temprano, daño cerebral, etc.).

![Estado](https://img.shields.io/badge/Estado-En%20desarrollo-blue)
![Plataforma](https://img.shields.io/badge/Plataforma-React%20Native%20%2B%20Spring%20Boot-brightgreen)
![Ciclo](https://img.shields.io/badge/2DAM-Proyecto%20Intermodular-orange)

---

## 📋 Descripción

**Recordis** es una aplicación multiplataforma que ayuda a organizar el día a día mediante actividades horarias, rutinas semanales y recordatorios visuales, con una interfaz adaptada a personas con dificultades de memoria y atención.  
El foco está en que tanto la persona usuaria como su entorno (familiares, cuidadores) puedan consultar y mantener una planificación sencilla y muy visual.

---

## 🎯 Objetivos

- Permitir crear y gestionar rutinas semanales con actividades organizadas por horas.  
- Enviar recordatorios visuales mediante popups y notificaciones locales.  
- Ofrecer una interfaz accesible: botones grandes, alto contraste, jerarquía visual clara y avatares predefinidos.  
- Distinguir y resaltar **citas médicas** (hospital/centro de salud) frente al resto de actividades.  
- Mejorar la autonomía y la calidad de vida de la persona usuaria y facilitar la supervisión a cuidadores.

---

## 🛠️ Tecnologías utilizadas

| Capa / ámbito        | Tecnología / herramienta                  |
|----------------------|-------------------------------------------|
| Frontend móvil       | React Native (Expo)                      |
| Backend API          | Spring Boot (Java)                       |
| Base de datos        | MongoDB (Spring Data MongoDB)            |
| Datos externos       | Open Data Valencia – Hospitales/centros de salud |
| Control de versiones | Git + GitHub                             |
| Gestión de tareas    | Trello (Kanban)                          |
| Diseño UI            | Figma                                    |

---

## 📱 Funcionalidades principales

- **Gestión de usuarios**  
  - Creación de perfil con nombre, edad, género, color de tema y avatar.  
  - Selección rápida de usuario desde el dashboard.

- **Actividades y rutinas**  
  - Creación, edición y eliminación de actividades diarias.  
  - Vista semanal y vista de un solo día.  
  - Estado de actividad (pendiente / completada) con codificación por colores.

- **Citas médicas**  
  - Marcar una actividad como *cita de salud*.  
  - Seleccionar el centro sanitario desde un listado obtenido de la API de datos abiertos de Valencia.  
  - Visualización de citas médicas con icono 🏥 y resaltado cuando están completadas.

- **Resumen mensual**  
  - Calendario con días que tienen actividades.  
  - Contador de actividades totales y días activos del mes.  
  - Listado de actividades por día desde el propio calendario.

- **Accesibilidad y experiencia de uso**  
  - Tipografías y tamaños adaptables mediante ajustes.  
  - Interfaz simplificada con pocas pantallas clave y acciones claras.

---

## 🗂️ Estructura de los proyectos

### 📁 Recordis (app móvil – React Native)

Ruta base del proyecto de la app:

```bash
Recordis/
├── assets/                          # Recursos estáticos (imágenes, iconos…)
├── data/
│   ├── api.js                       # Configuración cliente HTTP (Axios/fetch) hacia la API
│   └── repositories/
│       ├── actividadRepository.js
│       └── usuarioRepository.js
│
├── domain/
│   ├── entities/
│   │   ├── Actividad.js
│   │   └── Usuario.js
│   └── usecases/
│       ├── crearActividad.js
│       ├── crearUsuario.js
│       ├── getActividades.js
│       ├── getCentrosSalud.js
│       └── getUsuarios.js
│
├── presentation/
│   ├── components/
│   │   ├── RecordatorioGlobal.js
│   │   ├── TarjetaActividad.js
│   │   └── TarjetaUsuario.js
│   ├── context/
│   │   └── AjustesContext.js
│   ├── navigation/
│   │   └── AppNavigator.js
│   └── screens/
│       ├── Ajustes.js
│       ├── CentrosSaludScreen.js
│       ├── CrearActividad.js
│       ├── CrearPerfil.js
│       ├── Dashboard.js
│       ├── DetalleActividad.js
│       ├── EditarActividad.js
│       ├── EditarPerfil.js
│       ├── PerfilUsuario.js
│       ├── SeleccionUsuario.js
│       ├── VistaDia.js
│       ├── VistaResumen.js
│       └── VistaSemanal.js
│
├── utils/
│   └── notificaciones.js            # Lógica de notificaciones locales
│
├── App.js                           # Entrada principal de la app
├── app.json
├── eas.json
├── package.json
└── README.md
📁 Api_Recordis (API – Spring Boot)
Ruta base del proyecto backend (IntelliJ IDEA):

bash
Api_Recordis/
├── src/
│   ├── main/
│   │   ├── java/com/recordis/api_recordis/
│   │   │   ├── controller/
│   │   │   │   ├── ActividadController.java
│   │   │   │   └── UsuarioController.java
│   │   │   ├── model/
│   │   │   │   ├── Actividad.java
│   │   │   │   └── Usuario.java
│   │   │   ├── repository/
│   │   │   │   ├── ActividadRepository.java
│   │   │   │   └── UsuarioRepository.java
│   │   │   └── ApiRecordisApplication.java   # Clase main (Spring Boot)
│   │   └── resources/
│   │       ├── static/
│   │       ├── templates/
│   │       └── application.properties        # Configuración MongoDB y puerto
│   └── test/
│       └── java/com/recordis/api_recordis/
│           └── ApiRecordisApplicationTests.java
│
├── pom.xml                                  # Dependencias y configuración Maven
└── README.md
🚀 Puesta en marcha (resumen)
Backend – Api_Recordis (Spring Boot + MongoDB)
Configura la conexión a MongoDB en src/main/resources/application.properties, por ejemplo:

text
spring.data.mongodb.uri=mongodb://localhost:27017/recordis
spring.data.mongodb.database=recordis
server.port=8080

Ejecuta la API:

bash
cd Api_Recordis
mvn spring-boot:run
La API quedará disponible en http://localhost:8080.

También puedes lanzar la API desde IntelliJ ejecutando la clase ApiRecordisApplication.

Frontend – Recordis (React Native)
Asegúrate de que la API está levantada y que data/api.js apunta a la URL correcta, por ejemplo:

js
const api = axios.create({
  baseURL: 'http://localhost:8080', // o la IP de tu PC en la red local
});
Instala dependencias e inicia la app:

bash
cd Recordis
npm install
npm start
Abre la app en un emulador o en un dispositivo físico con Expo Go.
