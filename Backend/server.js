import express from "express";
import cors from "cors";
import QRCode from "qrcode";

const app = express();

// Middleware para establecer headers
app.use((req, res, next) => {
  res.header('Content-Type', 'application/json');
  res.header('Access-Control-Allow-Origin', 'https://generador-qr-three.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle OPTIONS method
  if (req.method === 'OPTIONS') {
    return res.status(200).json({
      body: "OK"
    });
  }
  
  next();
});

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
