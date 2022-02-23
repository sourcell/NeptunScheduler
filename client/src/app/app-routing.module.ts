import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { BusyTimeblocksComponent } from './busy-timeblocks/busy-timeblocks.component';
import { CoursesComponent } from './courses/courses.component';
import { DailyActiveTimesComponent } from './daily-active-times/daily-active-times.component';
import { GeneratingComponent } from './generating/generating.component';
import { SubjectsComponent } from './subjects/subjects.component';

const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: 'subjects', component: SubjectsComponent },
  { path: 'subjects/:id', component: CoursesComponent },
  { path: 'preferences/busytimeblocks', component: BusyTimeblocksComponent },
  { path: 'preferences/dailyactivetimes', component: DailyActiveTimesComponent },
  { path: 'generating', component: GeneratingComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
