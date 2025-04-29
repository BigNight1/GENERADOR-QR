import express from "express";
import cors from "cors";
import QRCode from "qrcode";

const app = express();

// Configuración de CORS más completa
app.use(cors({
  origin: 'https://generador-qr-three.vercel.app',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());

// Endpoint para generar código QR
app.post("/generate-qr", async (req, res) => {
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
});

// Inicia el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
