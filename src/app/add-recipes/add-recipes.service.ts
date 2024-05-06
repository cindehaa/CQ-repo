import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, CollectionReference, DocumentReference } from '@angular/fire/firestore';
import { Recipe } from '../shared/shared.model';

@Injectable({
  providedIn: 'root'
})
export class AddRecipesService {

  constructor() { }

  addRecipeToFirestore(recipeCollection: CollectionReference, recipeData: Recipe): Promise<string> {
    return addDoc(recipeCollection, recipeData)
      .then((docRef: DocumentReference) => {
        return docRef.id;
      })
      .catch((error: any) => {
        console.error('Error adding document: ', error);
        return '';
      });
  }
}
