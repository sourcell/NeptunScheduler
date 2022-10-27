import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { BusyTimeblocksComponent } from './components/busy-timeblocks/busy-timeblocks.component';
import { CoursesComponent } from './components/courses/courses.component';
import { DailyActiveTimesComponent } from './components/daily-active-times/daily-active-times.component';
import { GeneratingComponent } from './components/generating/generating.component';
import { SubjectsComponent } from './components/subjects/subjects.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
    {
        path: 'auth',
        component: AuthComponent
    },
    {
        path: 'subjects',
        component: SubjectsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'subjects/:id',
        component: CoursesComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'preferences/busytimeblocks',
        component: BusyTimeblocksComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'preferences/dailyactivetimes',
        component: DailyActiveTimesComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'generating',
        component: GeneratingComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }
