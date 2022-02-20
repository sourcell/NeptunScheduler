import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { SubjectsComponent } from './subjects/subjects.component';
import { CoursesComponent } from './courses/courses.component';
import { BusyTimeBlocksComponent } from './busy-time-blocks/busy-time-blocks.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    SubjectsComponent,
    CoursesComponent,
    BusyTimeBlocksComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
