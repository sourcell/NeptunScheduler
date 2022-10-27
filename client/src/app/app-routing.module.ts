import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { BusyTimeblocksComponent } from './busy-timeblocks/busy-timeblocks.component';
import { CoursesComponent } from './courses/courses.component';
import { DailyActiveTimesComponent } from './daily-active-times/daily-active-times.component';
import { GeneratingComponent } from './generating/generating.component';
import { AuthGuard } from './guards/auth.guard';
import { SubjectsComponent } from './subjects/subjects.component';

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
