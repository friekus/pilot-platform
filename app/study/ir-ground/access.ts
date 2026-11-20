// Private preview: only these accounts can open /study/ir-ground.
// Remove the check (or add students) when the module opens up.
export const IR_GROUND_ALLOWED_EMAILS = ["kpjo@duck.com"];

export function canAccessIrGround(email?: string | null): boolean {
  if (!email) return false;
  return IR_GROUND_ALLOWED_EMAILS.includes(email.trim().toLowerCase());
}
