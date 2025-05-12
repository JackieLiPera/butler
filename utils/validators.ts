import { bannedWords } from "../constants";

export const validatePassword = (password: string): string => {
  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must include at least one uppercase letter.";
  }

  if (!/[a-z]/.test(password)) {
    return "Password must include at least one lowercase letter.";
  }

  if (!/[0-9]/.test(password)) {
    return "Password must include at least one number.";
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    return "Password must include at least one special character.";
  }

  return "";
};

export const validateRequestText = (text: string): string => {
  const lowerText = text.toLowerCase();

  for (const word of bannedWords) {
    const pattern = new RegExp(`\\b${word}\\b`, "i");
    if (pattern.test(lowerText)) {
      return `Request contains inappropriate language: "${word}"`;
    }
  }

  return "";
};
