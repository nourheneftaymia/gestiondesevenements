import { User } from "./user.model";

export interface EvenementDTO {
  id: any;
  idEvenement: number;
  titre: string;
  description: string;
  dateDebut: string;  // ou Date selon ton usage
  dateFin: string;
  lieu: string;
  degreImportance: string;
  cout: number;
  categorieEvenement: string;
  statusValidation: string;
  commentaireRh?: string;
   lieuValidationRh?: string;
  dateValidationRh?: Date;
  budgetEstime?: number;
  createur: User;  // ici l’info créateur complète
}