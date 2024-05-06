import { Injectable } from '@angular/core';
import { EDITKEY } from './key';

@Injectable({
  providedIn: 'root'
})
export class IdentifierService {
  identifierProvided: string = '';
  editEnabled: boolean = false;

  constructor() { }

  getIdentifier(): string {
    return this.identifierProvided;
  }

  setIdentifier(identifier: string) {
    this.identifierProvided = identifier;
  }

  getEditEnabled(): boolean {
    return this.editEnabled;
  }

  enableEdit() {
    this.editEnabled = true;
  }

  disableEdit() {
    this.editEnabled = false;
  }

  isIdentifierEditable(): boolean {
    return this.identifierProvided === EDITKEY;
  }

}
