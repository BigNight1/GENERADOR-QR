import express from "express";
import cors from "cors";
import QRCode from "qrcode";

const app = express();

app.use(cors({
  origin: "https://generador-qr-frontend1.vercel.app/"
}));
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
app.post("/api/generate-qr", (generateQRHandler));

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
});

const PORT = process.env.PORT || 3800;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});

// Vercel necesita que exportemos la configuración de express
export default app; 