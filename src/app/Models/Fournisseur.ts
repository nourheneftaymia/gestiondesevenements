import { DocumentFournisseur } from "./DocumentFournisseur";
import { TypeFournisuer } from "./type-fournisseur.model";

export interface Fournisseur {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  numero: string;
  type: TypeFournisuer;
  documents?: DocumentFournisseur[];
   photoUrl?: string;
}