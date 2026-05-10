export const SPECIAL = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

export function isValidEmail(email) {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/.test(email);
}


export function getChecks(pwd) {
  return {
    length:  pwd.length >= 8,
    letter:  /[a-zA-Z]/.test(pwd),      
    number:  /[0-9]/.test(pwd),
    special: SPECIAL.test(pwd),
  };
}

export function getStrength(pwd) {
  if (!pwd) return null;
  const passed = Object.values(getChecks(pwd)).filter(Boolean).length;
  if (pwd.length < 8) return { label: "Too short", color: "#ff6584", width: "20%" };
  if (passed === 2)   return { label: "Weak",       color: "#f59e0b", width: "40%" };
  if (passed === 3)   return { label: "Good",       color: "#6c63ff", width: "75%" };
  return                     { label: "Strong",     color: "#43e97b", width: "100%" };
}

export const REQUIREMENTS = [
  { key: "length",  label: "At least 8 characters"           },
  { key: "letter",  label: "At least one letter (A-Z / a-z)" },
  { key: "number",  label: "At least one number (0-9)"       },
  { key: "special", label: "At least one special character"  },
];