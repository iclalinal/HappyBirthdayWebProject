/**
 * Uzun mesajı satırlara böler ve belirlenen satır sayısına göre 
 * çok boyutlu bir dizi (sayfalar) döndürür.
 */
export const splitMessageToPages = (message: string, linesPerPage: number = 5): string[][] => {
  if (!message) return [[]];
  
  // Mesajı satırlara böl
  const allLines = message.split('\n');
  const pages: string[][] = [];

  // Her X satırda bir yeni sayfaya geç
  for (let i = 0; i < allLines.length; i += linesPerPage) {
    pages.push(allLines.slice(i, i + linesPerPage));
  }

  return pages;
};
