import  { useState } from 'react';
import { Code2,  Link } from 'lucide-react';

function App() {
  const [url, setUrl] = useState('');
  const [qrCodeImage, setQrCodeImage] = useState('');
  const [loading, setLoading] = useState(false);

  const generateQRCode = async () => {
    if (!url) return;

    setLoading(true);

    try {
      const response = await fetch('https://generador-qr-production.up.railway.app/generate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'omit', // Deshabilitamos credentials ya que usamos origin: '*'
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (response.ok) {
        setQrCodeImage(data.qrCode); // Recibe el código QR como imagen en Base64
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error al generar el QR:', error);
      alert('Hubo un problema al generar el código QR');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadQR = () => {
    if (!qrCodeImage) return;

    const a = document.createElement('a');
    a.href = qrCodeImage;
    a.download = 'qrcode.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
            <Code2 className="h-8 w-8 text-blue-600" />
            Generador de Código QR
          </h1>
          <p className="text-gray-600">Ingresa una URL y genera un código QR automáticamente</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">URL de la página</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://ejemplo.com"
                    className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  />
                </div>
                <button
                  onClick={generateQRCode}
                  disabled={loading}
                  className={`px-4 py-2 ${loading ? 'bg-gray-400' : 'bg-blue-600'} text-white rounded-md hover:bg-blue-700 transition-colors`}
                >
                  {loading ? 'Generando...' : 'Generar QR'}
                </button>
              </div>
            </div>
          </div>

          {/* QR Display Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">Código QR Generado</h3>
            </div>
            {qrCodeImage ? (
              <div className="text-center">
                <img src={qrCodeImage} alt="Código QR" className="mx-auto my-4 max-w-[200px]" />
                <button
                  onClick={handleDownloadQR}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  Descargar QR
                </button>
              </div>
            ) : (
              <p>No hay código QR generado.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
