export interface User {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  role?: string;
  photo?: string; // le nom du fichier image (ex: "user1.jpg")
}
