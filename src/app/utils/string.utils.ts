export function generateRandomAlphanumeric(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
}

export function removeQueryParams(url: string) {
  const urlObj = new URL(url);
  return urlObj.origin + urlObj.pathname;
}

export function convertOffsetToDate(expiry: string) : Date {
  // Truncate to 3 decimal places
  const truncatedExpiry = expiry.replace(/(\.\d{3})\d*/, '$1');
  return new Date(truncatedExpiry);
}
