# 🌐 **Proyecto: UnaHur Anti-Social Net**

Una aplicación **social desarrollada en React** como parte del trabajo práctico para la **Universidad Nacional de Hurlingham (UNAHUR)**.  
Permite a los usuarios **registrarse, iniciar sesión, crear publicaciones, ver las de otros y dejar comentarios**.

---

## 🚀 **Tecnologías utilizadas**

- ⚛️ **React + Vite**  
- 🧱 **TypeScript**  
- 💅 **Bootstrap 5 / React-Bootstrap**  
- 🧠 **Context API (AuthContext)**  
- 🌐 **Fetch API / Axios**  
- 🧩 **Node.js / Express** *(backend provisto)*  
- 🎨 **CSS personalizado**

---

## ⚙️ **Instalación y uso**

1. **Cloná el repositorio**
   ```bash
   git clone https://github.com/pablojconforti/TP_N2_CIU_Grupo12
   cd TP-2-UnaHur-Anti-Social-Net


2. **Instalá las dependencias**
npm install

3. **Ejecuta la app**
npm run dev


## 🔑 **Funcionalidades principales**

- ✅ **Registro e inicio de sesión de usuarios**  
- ✅ **Creación y edición de publicaciones**  
- ✅ **Sistema de comentarios dinámico**  
- ✅ **Filtro de publicaciones por etiquetas (tags)**  
- ✅ **Perfil de usuario con publicaciones destacadas**  
- ✅ **Diseño moderno, claro y totalmente responsive**


## 🧠 **Arquitectura general**

El frontend fue diseñado bajo una **estructura modular** para mantener la *separación de responsabilidades*.  
Se emplean **componentes reutilizables**, **contextos globales para autenticación** y un **enrutamiento dinámico** con `react-router-dom`.

- 🧩 **AuthContext** → Maneja el estado global de autenticación *(login, logout, user data)*.  
- 🌐 **API Layer** → Abstracción de llamadas a la API usando `fetch`.  
- 🧱 **Componentes** → Tarjetas de publicaciones, filtros por etiquetas, formularios, etc.  
- 📄 **Páginas** → *Home*, *Perfil*, *Detalle de publicación*, *Crear publicación*, *Login* y *Registro*.  
- 💅 **Bootstrap + CSS personalizado** → Para un diseño adaptable, limpio y profesional.

## 🔧 **Dependencias principales**

| **Paquete** | **Descripción** |
|--------------|----------------|
| `react` | Librería base para construir interfaces |
| `react-router-dom` | Manejo de rutas y navegación |
| `react-bootstrap` | Componentes UI listos para usar |
| `bootstrap` | Framework CSS responsivo |
| `typescript` | Tipado estático para React |
| `vite` | Entorno de desarrollo rápido y moderno |


## 👨‍💻 **Desarrolladores de la web**

- **Daniel Pizarro**  
- **Pablo Conforti**  
- **Agustín Fernández**
