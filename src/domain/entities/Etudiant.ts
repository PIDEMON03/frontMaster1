import { Parcours } from './Parcours';

export interface IEtudiant {
  ID: number | null;
  Nom: string | null;
  Prenom: string | null;
  Parcours: Parcours | null;

  toJSON(): Object;
}

export class Etudiant implements IEtudiant {
  constructor(
    public ID: number | null,
    public Nom: string | null,
    public Prenom: string | null,
    public Parcours: Parcours | null
  ) {}

  toJSON(): Object {
    return {
      ID: this.ID,
      Nom: this.Nom,
      Prenom: this.Prenom,
      Parcours: this.Parcours?.ID // On stocke seulement l'ID du parcours pour simplifier
    };
  }
}
