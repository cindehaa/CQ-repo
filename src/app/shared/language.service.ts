import { Injectable } from '@angular/core';
import { Language } from './shared.model';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  currentLanguage: Language = Language.en;

  constructor() { }

  getLanguage(): Language {
    return this.currentLanguage;
  }

  setLanguage(language: Language) {
    this.currentLanguage = language;
  }

  toggleLanguage() {
    this.currentLanguage = this.currentLanguage === Language.en ? Language.ch : Language.en;
  }

  isLanguageEn(): boolean {
    return this.currentLanguage === Language.en;
  }

  getTranslation(label: any): string {
    return this.isLanguageEn() ? label.en : label.ch;
  }
}
