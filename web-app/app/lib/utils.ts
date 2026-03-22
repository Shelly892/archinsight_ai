export function cleanDescription(raw: string): string[] {
  return (raw || "")
    .replace(
      /^\+\s*\d+\s*(?:Text description provided by the architects\.)?/gi,
      ""
    )
    .replace(/Text description provided by the architects\./gi, "")
    .split("\n")
    .map((p: string) => p.trim())
    .filter((p: string) => p !== "");
}
