export function generateRandomOtpCode(): string {
  const min = Math.ceil(100000);
  const max = Math.floor(999999);
  const result = Math.floor(Math.random() * (max - min) + min);
  return result.toString();
}
