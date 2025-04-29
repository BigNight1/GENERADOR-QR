import express from "express";
import cors from "cors";
import QRCode from "qrcode";

const app = express();

// Middleware para habilitar CORS según la documentación de Vercel
const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

app.use(express.json());

// Ruta de prueba
app.get('/api', (req, res) => {
  res.json({ message: 'API QR funcionando' });
});

// Endpoint para generar código QR con CORS habilitado
const generateQRHandler = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL es requerida" });
  }

  try {
    const qrCodeImage = await QRCode.toDataURL(url);
    res.json({ qrCode: qrCodeImage });
  } catch (error) {
    console.error("Error generando el QR:", error);
    res.status(500).json({ error: "Error generando el código QR" });
  }
};

// Aplicamos el middleware allowCors al handler
app.post("/api/generate-qr", allowCors(generateQRHandler));

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
});

// Vercel necesita que exportemos la configuración de express
export default app; 