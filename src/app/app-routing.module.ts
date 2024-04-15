import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CvCreatorComponent} from "./pages/cv/cv-creator/cv-creator.component";
import {CvResolverResolver} from "./pages/cv/cv-creator/cv-resolver.resolver";

const routes: Routes = [
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    component: CvCreatorComponent,
    resolve: {
      states : CvResolverResolver,
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
