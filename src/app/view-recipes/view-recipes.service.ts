import { Injectable } from '@angular/core';
import { Recipe } from '../shared/shared.model';
import { Firestore, collectionData, deleteDoc, doc, where } from '@angular/fire/firestore';
import { collection, query, getDocs, writeBatch, deleteField } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ViewRecipesService {

  constructor() { }

  saveRecipeToFirestore(firestore: Firestore, newRecipe: Recipe): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const ref = collection(firestore, 'view-recipe');
      const q = query(ref, where('id', '==', newRecipe.id));

      getDocs(q).then((snapshots) => {
        const recipe = snapshots.docs[0];

        const recipeRef = doc(firestore, 'view-recipe', recipe.id);
        const batch = writeBatch(firestore);

        batch.update(recipeRef, {
          name: newRecipe.name,
          desc: newRecipe.desc,
          time: newRecipe.time,
          ingredients: newRecipe.ingredients,
          instructions: newRecipe.instructions,
          tags: newRecipe.tags
        });

        batch.commit().then(() => {
          console.log("INFO: Recipe updated: ", recipe.id);
          resolve('Recipe updated successfully');
        }).catch((error: any) => {
          console.error("Error updating recipe: ", error);
          reject('Failed to update recipe');
        });
      });
    });
  }

  deleteRecipeFromFirestore(firestore: Firestore, id: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const ref = collection(firestore, 'view-recipe');
      const q = query(ref, where('id', '==', id));

      getDocs(q).then((snapshots) => {
        const recipe = snapshots.docs[0];
        deleteDoc(doc(firestore, 'view-recipe', recipe.id));
        console.log("INFO: Recipe deleted: ", recipe.id);
        resolve('Recipe deleted successfully');
      }).catch((error: any) => {
        console.error("Error deleting recipe: ", error);
        reject('Failed to delete recipe');
      });
    });
  }

}
