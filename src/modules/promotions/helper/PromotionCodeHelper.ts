export function generateRandomCode(): string {
    return (Math.random() + 1).toString(36).substring(2).toUpperCase();
}