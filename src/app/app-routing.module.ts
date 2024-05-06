import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ViewRecipesComponent } from './view-recipes/view-recipes.component';
import { AddRecipesComponent } from './add-recipes/add-recipes.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'add-recipes', component: AddRecipesComponent },
  { path: 'view-recipes', component: ViewRecipesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
