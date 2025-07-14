// PDFGenerator.jsx - Versión mejorada
import React from 'react';
import { Download } from 'lucide-react';

// Función mejorada para parsear el análisis y extraer secciones
const parseAnalysis = (text) => {
  const sections = {
    descripcion: '',
    perfil: '',
    contexto: '',
    estado: '',
    intereses: '',
    nota: ''
  };

  if (!text) return sections;

  // Dividir el texto en líneas y procesar
  const lines = text.split('\n');
  let currentSection = '';
  let collectingContent = false;

  lines.forEach(line => {
    const trimmedLine = line.trim();

    // Detectar inicio de secciones por emojis y palabras clave
    if (trimmedLine.includes('📸') && (trimmedLine.includes('Descripción') || trimmedLine.includes('descripción'))) {
      currentSection = 'descripcion';
      collectingContent = true;
      return;
    } else if (trimmedLine.includes('🧑') && (trimmedLine.includes('Perfil') || trimmedLine.includes('perfil'))) {
      currentSection = 'perfil';
      collectingContent = true;
      return;
    } else if (trimmedLine.includes('🌎') || trimmedLine.includes('🌍')) {
      currentSection = 'contexto';
      collectingContent = true;
      return;
    } else if (trimmedLine.includes('😌') && (trimmedLine.includes('Estado') || trimmedLine.includes('estado'))) {
      currentSection = 'estado';
      collectingContent = true;
      return;
    } else if (trimmedLine.includes('🧠') && (trimmedLine.includes('Intereses') || trimmedLine.includes('intereses'))) {
      currentSection = 'intereses';
      collectingContent = true;
      return;
    } else if (trimmedLine.includes('Nota') && (trimmedLine.includes('cautela') || trimmedLine.includes('precaución'))) {
      currentSection = 'nota';
      collectingContent = true;
      return;
    }

    // Si estamos recolectando contenido y no es una línea de título
    if (collectingContent && currentSection && trimmedLine) {
      // Evitar duplicar títulos
      if (!trimmedLine.startsWith('**') || !trimmedLine.includes(currentSection)) {
        sections[currentSection] += line + '\n';
      }
    }
  });

  // Si no se pudo parsear por secciones, intentar dividir por patrones comunes
  if (Object.values(sections).every(section => section.trim() === '')) {
    // Buscar patrones alternativos o usar todo el texto
    const paragraphs = text.split('\n\n');
    let sectionIndex = 0;
    const sectionKeys = ['descripcion', 'perfil', 'contexto', 'estado', 'intereses'];

    paragraphs.forEach(paragraph => {
      if (paragraph.trim() && sectionIndex < sectionKeys.length) {
        sections[sectionKeys[sectionIndex]] = paragraph.trim();
        sectionIndex++;
      }
    });
  }

  return sections;
};

// Función alternativa para casos donde el parsing falla
const parseAnalysisAlternative = (text) => {
  if (!text) return { fullText: '' };

  // Si no se puede parsear por secciones, usar el texto completo dividido en párrafos lógicos
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim());

  return {
    fullText: text,
    paragraphs: paragraphs
  };
};

// Función para generar el contenido HTML del PDF
const generatePDFContent = (analysisData, imageFile) => {
  const sections = parseAnalysis(analysisData);
  const alternative = parseAnalysisAlternative(analysisData);

  const currentDate = new Date().toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Verificar si el parsing por secciones funcionó
  const hasValidSections = Object.values(sections).some(section => section.trim().length > 0);

  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Análisis de Imagen - Reporte IA</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f8f9fa;
            padding: 20px;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            font-weight: 300;
        }
        
        .header p {
            font-size: 1.1em;
            opacity: 0.9;
        }
        
        .metadata {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 30px;
            background: #f8f9fa;
            border-bottom: 1px solid #e9ecef;
        }
        
        .metadata-item {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .metadata-icon {
            width: 20px;
            height: 20px;
            background: #667eea;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 12px;
        }
        
        .content {
            padding: 30px;
        }
        
        .section {
            margin-bottom: 30px;
            border-left: 4px solid #667eea;
            padding-left: 20px;
        }
        
        .section-title {
            font-size: 1.3em;
            font-weight: 600;
            color: #667eea;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .section-content {
            font-size: 1em;
            line-height: 1.8;
            color: #555;
            white-space: pre-wrap;
            text-align: justify;
        }
        
        .full-text {
            font-size: 1em;
            line-height: 1.8;
            color: #555;
            white-space: pre-wrap;
            text-align: justify;
            border: 1px solid #e9ecef;
            padding: 20px;
            border-radius: 8px;
            background: #fafafa;
        }
        
        .highlight {
            background: #fff3cd;
            padding: 2px 6px;
            border-radius: 3px;
            font-weight: 500;
        }
        
        .footer {
            background: #f8f9fa;
            padding: 20px 30px;
            text-align: center;
            border-top: 1px solid #e9ecef;
            color: #666;
            font-size: 0.9em;
        }
        
        .disclaimer {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        
        .disclaimer-title {
            font-weight: 600;
            color: #856404;
            margin-bottom: 10px;
        }
        
        @media print {
            body { background: white; padding: 0; }
            .container { box-shadow: none; }
            .section { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🤖 Análisis de Imagen con IA</h1>
            <p>Reporte detallado generado automáticamente</p>
        </div>
        
        <div class="metadata">
            <div class="metadata-item">
                <div class="metadata-icon">📁</div>
                <div>
                    <strong>Archivo:</strong><br>
                    ${imageFile ? imageFile.name : 'imagen_analizada.jpg'}
                </div>
            </div>
            <div class="metadata-item">
                <div class="metadata-icon">📅</div>
                <div>
                    <strong>Fecha:</strong><br>
                    ${currentDate}
                </div>
            </div>
            <div class="metadata-item">
                <div class="metadata-icon">💾</div>
                <div>
                    <strong>Tamaño:</strong><br>
                    ${imageFile ? (imageFile.size / 1024 / 1024).toFixed(2) + ' MB' : 'N/A'}
                </div>
            </div>
            <div class="metadata-item">
                <div class="metadata-icon">🖼️</div>
                <div>
                    <strong>Tipo:</strong><br>
                    ${imageFile ? imageFile.type : 'image/jpeg'}
                </div>
            </div>
        </div>
        
        <div class="content">
            ${hasValidSections ? `
            <div class="section">
                <div class="section-title">
                    📸 Descripción de la Imagen
                </div>
                <div class="section-content">${sections.descripcion.replace(/\*\*(.*?)\*\*/g, '<span class="highlight">$1</span>')}</div>
            </div>
            
            <div class="section">
                <div class="section-title">
                    🧑‍🔬 Perfil del Sujeto
                </div>
                <div class="section-content">${sections.perfil.replace(/\*\*(.*?)\*\*/g, '<span class="highlight">$1</span>')}</div>
            </div>
            
            <div class="section">
                <div class="section-title">
                    🌎 Contexto Geográfico y Cultural
                </div>
                <div class="section-content">${sections.contexto.replace(/\*\*(.*?)\*\*/g, '<span class="highlight">$1</span>')}</div>
            </div>
            
            <div class="section">
                <div class="section-title">
                    😌 Estado Emocional
                </div>
                <div class="section-content">${sections.estado.replace(/\*\*(.*?)\*\*/g, '<span class="highlight">$1</span>')}</div>
            </div>
            
            <div class="section">
                <div class="section-title">
                    🧠 Intereses y Estilo de Vida
                </div>
                <div class="section-content">${sections.intereses.replace(/\*\*(.*?)\*\*/g, '<span class="highlight">$1</span>')}</div>
            </div>
            
            ${sections.nota ? `
            <div class="disclaimer">
                <div class="disclaimer-title">⚠️ Nota de Cautela</div>
                <div>${sections.nota.replace(/\*\*(.*?)\*\*/g, '<span class="highlight">$1</span>')}</div>
            </div>
            ` : ''}
            ` : `
            <div class="section">
                <div class="section-title">
                    🤖 Análisis Completo de la Imagen
                </div>
                <div class="full-text">${alternative.fullText.replace(/\*\*(.*?)\*\*/g, '<span class="highlight">$1</span>')}</div>
            </div>
            `}
        </div>
        
        <div class="footer">
            <p><strong>Sistema de Análisis de Imágenes con Inteligencia Artificial</strong></p>
            <p>Este reporte ha sido generado automáticamente mediante análisis de visión por computadora</p>
            <p>Generado el ${currentDate}</p>
        </div>
    </div>
</body>
</html>`;
};

// Función principal para generar PDF
const generatePDF = (analysisData, imageFile) => {
  return new Promise((resolve, reject) => {
    try {
      if (!analysisData || analysisData.trim() === '') {
        reject({
          success: false,
          error: 'No hay datos de análisis disponibles para generar el PDF'
        });
        return;
      }

      const htmlContent = generatePDFContent(analysisData, imageFile);

      // Crear ventana nueva para imprimir
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Esperar a que se cargue el contenido
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();

        // Cerrar ventana después de imprimir
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      };

      resolve({
        success: true,
        message: 'PDF generado exitosamente. Se ha abierto la ventana de impresión.'
      });

    } catch (error) {
      reject({
        success: false,
        error: error.message
      });
    }
  });
};

// Componente del botón PDF
const PDFGenerator = ({ analysisData, imageFile, className = '' }) => {
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleGeneratePDF = async () => {
    if (!analysisData) {
      alert('No hay análisis disponible para generar PDF');
      return;
    }

    setIsGenerating(true);

    try {
      const result = await generatePDF(analysisData, imageFile);
      console.log('✅ PDF generado:', result.message);
    } catch (error) {
      console.error('❌ Error al generar PDF:', error.error);
      alert(`Error al generar PDF: ${error.error}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleGeneratePDF}
      disabled={isGenerating || !analysisData}
      className={`
        flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg 
        hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed
        ${className}
      `}
    >
      <Download className="h-4 w-4" />
      {isGenerating ? 'Generando PDF...' : 'Generar PDF'}
    </button>
  );
};

export default PDFGenerator;
export { generatePDF, parseAnalysis, generatePDFContent };