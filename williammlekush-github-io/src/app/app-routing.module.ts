import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'navigation', loadChildren: () => import('./navigation/navigation.module').then(m => m.NavigationModule) },
  { path: 'gallery', loadChildren: () => import('./gallery/gallery.module').then(m => m.GalleryModule) },
  { path: 'project', loadChildren: () => import('./project/project.module').then(m => m.ProjectModule) },
  { path: 'resume', loadChildren: () => import('./resume/resume.module').then(m => m.ResumeModule) },
  { path: 'about', loadChildren: () => import('./about/about.module').then(m => m.AboutModule) },
  { path: '', redirectTo: '/gallery', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
