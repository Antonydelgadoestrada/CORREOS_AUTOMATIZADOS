import html2canvas from 'html2canvas';

/**
 * Convierte HTML a imagen PNG y la descarga
 * @param {string} htmlContent - Contenido HTML a convertir
 * @param {string} fileName - Nombre del archivo a descargar (sin extensión)
 */
export const descargarHTMLComoImagen = async (htmlContent, fileName = 'plantilla') => {
  try {
    // Crear un contenedor temporal
    const container = document.createElement('div');
    container.innerHTML = htmlContent;
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = '800px';
    container.style.backgroundColor = '#ffffff';
    container.style.padding = '20px';
    
    document.body.appendChild(container);

    // Convertir a imagen con html2canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    // Remover el contenedor temporal
    document.body.removeChild(container);

    // Convertir canvas a blob y descargar
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}_${new Date().toISOString().split('T')[0]}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 'image/png');
  } catch (error) {
    console.error('Error descargando imagen:', error);
    throw error;
  }
};

/**
 * Convierte HTML a imagen PDF
 * @param {string} htmlContent - Contenido HTML a convertir
 * @param {string} fileName - Nombre del archivo a descargar (sin extensión)
 */
export const descargarHTMLComoPDF = async (htmlContent, fileName = 'plantilla') => {
  try {
    const container = document.createElement('div');
    container.innerHTML = htmlContent;
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = '800px';
    container.style.backgroundColor = '#ffffff';
    container.style.padding = '20px';
    
    document.body.appendChild(container);

    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    document.body.removeChild(container);

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}_${new Date().toISOString().split('T')[0]}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 'image/png');
  } catch (error) {
    console.error('Error descargando archivo:', error);
    throw error;
  }
};
