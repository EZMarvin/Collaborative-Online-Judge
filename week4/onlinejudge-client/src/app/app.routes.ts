import { Routes, RouterModule } from '@angular/router';

import { ProblemListComponent } from './components/problem-list/problem-list.component';
import { ProblemDetailComponent } from './components/problem-detail/problem-detail.component';
import { NewProblemComponent } from './components/new-problem/new-problem.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'problem',
        pathMatch: 'full'
    },
    {
        path: 'problems',
        component: ProblemListComponent
    },
    {
        path: 'problems/add',
        component: NewProblemComponent
    },
    {
        path: 'problems/:id',
        component: ProblemDetailComponent,
        canActivate: ['authGuard']

    },
    {
        path: '**',
        redirectTo: 'problems'
    }
];

export const routing = RouterModule.forRoot(routes);