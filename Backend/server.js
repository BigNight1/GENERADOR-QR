import express from "express";
import cors from "cors";
import QRCode from "qrcode";

const app = express();

// Configuración básica
app.use(cors({
  origin: 'https://generador-qr-three.vercel.app',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
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

// Para Vercel, necesitamos exportar la app
export default app;
