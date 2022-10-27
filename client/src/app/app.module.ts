import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { BusyTimeblocksComponent } from './components/busy-timeblocks/busy-timeblocks.component';
import { CoursesComponent } from './components/courses/courses.component';
import { DailyActiveTimesComponent } from './components/daily-active-times/daily-active-times.component';
import { GeneratingComponent } from './components/generating/generating.component';
import { SubjectsComponent } from './components/subjects/subjects.component';

@NgModule({
    declarations: [
        AppComponent,
        AuthComponent,
        SubjectsComponent,
        CoursesComponent,
        BusyTimeblocksComponent,
        DailyActiveTimesComponent,
        GeneratingComponent
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
