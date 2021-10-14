import dotenv from 'dotenv'; // para que lea variables de entorno las cuales son las .env

dotenv.config();
const cloudinary = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

const cloudFilesRoutes = { //Ruta para guardar la imagen en el cloudinary-------VER ESTO
  proponente: 'vt_academicos/proponente'
};

export {
  cloudinary,
  cloudFilesRoutes
}
