export function formatUzbekPhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  const digits = phone.replace(/\D/g, "");

  // Check if it starts with Uzbekistan's country code (+998) or local format
  if (digits.length === 9) {
    // Local format without +998 (e.g., 901234567)
    return `+998 ${digits.slice(0, 2)} ${digits.slice(2, 5)}-${digits.slice(
      5,
      7
    )}-${digits.slice(7)}`;
  } else if (digits.length === 12 && digits.startsWith("998")) {
    // Full international format (e.g., 998901234567)
    return `+998 ${digits.slice(3, 5)} ${digits.slice(5, 8)}-${digits.slice(
      8,
      10
    )}-${digits.slice(10)}`;
  } else {
    return phone;
  }
}
