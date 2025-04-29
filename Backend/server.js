import express from "express";
import cors from "cors";
import QRCode from "qrcode";

const app = express();

// Configuración de CORS simplificada y permisiva
app.use(cors({
  origin: '*', // Permite todas las solicitudes
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false // Deshabilitamos credentials ya que usamos origin: '*'
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
    // Agregamos headers explícitamente en la respuesta
    res.header('Access-Control-Allow-Origin', '*');
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
