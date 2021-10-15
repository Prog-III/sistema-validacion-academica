// para que lea variables de entorno las cuales son las .env

require('dotenv').config();

const cloudinary = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

const microsoft_azure = {
  url: process.env.AZURE_URL,
  host: process.env.AZURE_HOST,
  port: 3306,
  user: process.env.AZURE_USER,
  password: process.env.AZURE_PASSWORD,
  database: process.env.AZURE_DATABASE
}



const cloudFilesRoutes = { //Ruta para guardar la imagen en el cloudinary-------VER ESTO
  proponente: 'vt_academicos/proponente'
};

export {
  cloudinary,
  cloudFilesRoutes,
  microsoft_azure
}
