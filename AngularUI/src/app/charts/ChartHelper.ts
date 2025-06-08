export function downloadChartAsPNG(chart: any ,filename:string ='chart') {
  const canvas = chart?.chart?.canvas;

  if (!canvas) return;

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;

  const ctx = tempCanvas.getContext('2d');
  if (!ctx) return;

  // Fill background with white
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

  // Draw original chart on top
  ctx.drawImage(canvas, 0, 0);

  // Create download link
  const link = document.createElement('a');
  link.href = tempCanvas.toDataURL('image/png');
  link.download = filename+'.png';
  link.click();
  link.remove();
}
