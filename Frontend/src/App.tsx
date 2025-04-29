import  { useState } from 'react';
import { Code2, Link, MessageCircle } from 'lucide-react';

function App() {
  const [url, setUrl] = useState('');
  const [whatsappMessage, setWhatsappMessage] = useState('');
  const [qrCodeImage, setQrCodeImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('url'); // 'url' o 'whatsapp'

  const generateQRCode = async () => {
    if (!url) return;

    setLoading(true);

    let finalUrl = url;
    if (type === 'whatsapp') {
      const cleanNumber = url.replace(/[^\d]/g, '');
      const encodedMessage = encodeURIComponent(whatsappMessage);
      finalUrl = `https://wa.me/${cleanNumber}${whatsappMessage ? `?text=${encodedMessage}` : ''}`;
    }

    try {
      const response = await fetch('https://generador-qr-backend.vercel.app/api/generate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: finalUrl })
      });

      const data = await response.json();

      if (response.ok) {
        setQrCodeImage(data.qrCode);
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
          <p className="text-gray-600">Genera códigos QR para URLs o WhatsApp</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="space-y-4">
              {/* Tipo de QR */}
              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => setType('url')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                    type === 'url' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <Link className="h-5 w-5" />
                  URL
                </button>
                <button
                  onClick={() => setType('whatsapp')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                    type === 'whatsapp' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp
                </button>
              </div>

              <label className="block text-sm font-medium text-gray-700">
                {type === 'url' ? 'URL de la página' : 'Número de WhatsApp'}
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  {type === 'url' ? (
                    <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  ) : (
                    <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  )}
                  <input
                    type={type === 'url' ? 'url' : 'tel'}
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder={type === 'url' ? 'https://ejemplo.com' : '51999999999'}
                    className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  />
                </div>
              </div>

              {/* Campo de mensaje para WhatsApp */}
              {type === 'whatsapp' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Mensaje (opcional)
                  </label>
                  <textarea
                    value={whatsappMessage}
                    onChange={(e) => setWhatsappMessage(e.target.value)}
                    placeholder="Escribe un mensaje que se enviará automáticamente..."
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                    rows={3}
                  />
                </div>
              )}

              <div className="mt-4">
                <button
                  onClick={generateQRCode}
                  disabled={loading}
                  className={`w-full px-4 py-2 ${
                    loading ? 'bg-gray-400' : type === 'url' ? 'bg-blue-600' : 'bg-green-600'
                  } text-white rounded-md hover:bg-blue-700 transition-colors`}
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
              <p className="text-center text-gray-500">No hay código QR generado.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
