# Geoportal

![License](https://img.shields.io/badge/license-MIT-green)
![Python](https://img.shields.io/badge/python-3.11-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100.0-green)
![Angular](https://img.shields.io/badge/Angular-16-red)

**Geoportal** es una plataforma web interactiva desarrollada con tecnologías modernas para la visualización y gestión de datos geoespaciales. El proyecto integra un frontend en Angular, un backend en FastAPI y un servidor de mapas con GeoServer.

## 🚀 Tecnologías utilizadas

- **Frontend**: Angular
- **Backend**: FastAPI
- **Servidor de mapas**: GeoServer
- **Lenguajes**: TypeScript, Python, HTML, CSS

## 📂 Estructura del proyecto

Geoportal/
├── BackendGeoportal/ # Código del backend en FastAPI
├── ClientGeoportal/ # Código del frontend en Angular
├── .gitignore # Archivos y carpetas ignorados por Git
└── README.md # Documentación del proyecto

bash
Copy
Edit

## ⚙️ Instalación y ejecución

### Backend (FastAPI)

1. Clonar el repositorio:

```bash
git clone https://github.com/DaniloRiver/Geoportal.git
cd Geoportal/BackendGeoportal
Crear un entorno virtual:

bash
Copy
Edit
python -m venv venv
# En Linux/Mac
source venv/bin/activate
# En Windows
venv\Scripts\activate
Instalar las dependencias:

bash
Copy
Edit
pip install -r requirements.txt
Ejecutar el servidor:

bash
Copy
Edit
uvicorn main:app --reload
El backend estará disponible en http://localhost:8000.

Frontend (Angular)
Clonar el repositorio:

bash
Copy
Edit
git clone https://github.com/DaniloRiver/Geoportal.git
cd Geoportal/ClientGeoportal
Instalar las dependencias:

bash
Copy
Edit
npm install
Ejecutar la aplicación:

bash
Copy
Edit
ng serve
El frontend estará disponible en http://localhost:4200.

🌐 Contribuciones
Las contribuciones son bienvenidas. Si deseas colaborar, por favor sigue estos pasos:

Haz un fork del repositorio.

Crea una nueva rama (git checkout -b feature/nueva-funcionalidad).

Realiza tus cambios y haz commit (git commit -am 'Añadir nueva funcionalidad').

Haz push a la rama (git push origin feature/nueva-funcionalidad).

Abre un Pull Request.

📄 Licencia
Este proyecto está bajo la licencia MIT. Consulta el archivo LICENSE para más detalles.
