import { useEffect, useState } from 'react';
import { useSurveillance } from '../../context/SurveillanContext'; // Ajusta ruta según tu proyecto

function extractSection(description, sectionTitle) {
  const startIndex = description.indexOf(sectionTitle);
  if (startIndex === -1) return '';

  const nextSectionMatch = description.slice(startIndex + 1).match(/\n\d+\./);
  const endIndex = nextSectionMatch
    ? startIndex + nextSectionMatch.index + 1
    : description.length;

  return description.slice(startIndex, endIndex).trim();
}

export function useSurveillanceImage(base64Image, description) {
  const [imageURL, setImageURL] = useState(null);
  const { setGeneratedImageBase64 } = useSurveillance(); // <-- Usamos este setter

  useEffect(() => {
    if (!base64Image || !description) return;

    const canvas = document.createElement('canvas');
    const width = 1080;
    const height = 1350;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    const img = new Image();
    img.onload = () => {
      const maxImageHeight = height * 0.6;
      const targetWidth = width * 0.9;
      const scaledHeight = img.height * (targetWidth / img.width);
      const finalHeight = Math.min(scaledHeight, maxImageHeight);
      const imgX = (width - targetWidth) / 2;
      const imgY = 80;

      ctx.globalAlpha = 0.95;
      ctx.drawImage(img, imgX, imgY, targetWidth, finalHeight);
      ctx.globalAlpha = 1;

      const analysis = extractSection(description, '4. ANÁLISIS PSICOLÓGICO Y EMOCIONAL');

      const textYStart = imgY + finalHeight + 40;
      const sideMargin = 60;
      const lineHeight = 30;
      const maxLines = 8;

      ctx.font = '20px monospace';
      ctx.fillStyle = '#ff0033';
      ctx.textAlign = 'left';

      const words = analysis.split(/\s+/);
      const lines = [];
      let currentLine = '';

      words.forEach(word => {
        const testLine = currentLine + word + ' ';
        if (ctx.measureText(testLine).width > width - sideMargin * 2) {
          lines.push(currentLine);
          currentLine = word + ' ';
        } else {
          currentLine = testLine;
        }
      });
      if (currentLine) lines.push(currentLine);

      lines.slice(0, maxLines).forEach((line, i) => {
        ctx.fillText(line.trim(), sideMargin, textYStart + i * lineHeight);
      });

      const resultImage = canvas.toDataURL();

      setImageURL(resultImage);

      // Enviamos la imagen generada en base64 al contexto para que la suba y guarde la URL
      if (typeof setGeneratedImageBase64 === 'function') {
        setGeneratedImageBase64(resultImage);
      } else {
        console.error('setGeneratedImageBase64 no está definido');
      }
    };

    img.onerror = e => console.error('Error al cargar imagen base64', e);

    img.src = base64Image.startsWith('data:image')
      ? base64Image
      : `data:image/jpeg;base64,${base64Image}`;
  }, [base64Image, description, setGeneratedImageBase64]);

  return imageURL;
}
