export const SexeFormatter = (sexe: string | undefined) => {
  if (!sexe) return "Non défini"
  if (sexe == "H") return "Homme"
  return "Femme"
}
