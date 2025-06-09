import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RechercheService {
  
  // BehaviorSubject pour stocker le terme courant
  private searchTermSubject = new BehaviorSubject<string>('');
  // Observable que les autres composants pourront écouter
  searchTerm$ = this.searchTermSubject.asObservable();

  // Méthode pour mettre à jour le terme
  setSearchTerm(term: string) {
    this.searchTermSubject.next(term);
  }
}
