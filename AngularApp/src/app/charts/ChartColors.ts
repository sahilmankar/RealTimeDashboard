const baseColors = [
  [255, 99, 132],    // Red
  [255, 159, 64],    // Orange
  [201, 203, 207],   // Light Gray
  [0, 204, 102],     // Medium Green
  [0, 102, 204],     // Royal Blue
  [255, 0, 102],     // Hot Pink
  [102, 0, 204],     // Deep Purple
  [0, 153, 153],     // Teal
  [54, 162, 235],    // Blue
  [75, 192, 192],    // Aqua
  [255, 206, 86],    // Yellow
  [153, 102, 255],   // Lavender
  [255, 140, 148],   // Salmon Pink
  [255, 218, 128],   // Peach
  [178, 255, 89],    // Lime Green
  [144, 202, 249],   // Sky Blue
  [126, 87, 194],    // Indigo
  [255, 171, 145],   // Coral
  [100, 181, 246],   // Light Blue
  [77, 182, 172],    // Mint

  [233, 30, 99],     // Rose
  [255, 87, 34],     // Deep Orange
  [139, 195, 74],    // Light Olive Green
  [0, 188, 212],     // Cyan
  [205, 220, 57],    // Lime
  [121, 85, 72],     // Brown
  [96, 125, 139],    // Blue Gray
  [255, 193, 7],     // Amber
  [63, 81, 181],     // Indigo Blue
  [0, 230, 118],     // Neon Green
];


export function getChartColors(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const [r, g, b] = baseColors[i % baseColors.length];
    return {
      backgroundColor: `rgba(${r}, ${g}, ${b}, 0.7)`,
      borderColor: `rgba(${r}, ${g}, ${b}, 1)`,
    };
  });
}
export function getRandomChartColors(count: number) {
  const shuffled = [...baseColors].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);
  return selected.map(([r, g, b]) => ({
    backgroundColor: `rgba(${r}, ${g}, ${b}, 0.6)`,
    borderColor: `rgba(${r}, ${g}, ${b}, 1)`,
  }));
}
