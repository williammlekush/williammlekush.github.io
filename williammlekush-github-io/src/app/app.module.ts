import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NavigationModule } from './navigation/navigation.module';
import { GalleryModule } from './gallery/gallery.module';
import { ProjectModule } from './project/project.module';
import { AboutModule } from './about/about.module';
import { ResumeModule } from './resume/resume.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NavigationModule,
    GalleryModule,
    ProjectModule,
    AboutModule,
    ResumeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
