import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Register } from './pages/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { Login } from './pages/login/login';
import { ViewBook } from './pages/view-book/view-book';


export const routes: Routes = [


    {
        path:'',
        redirectTo:'/home',
        pathMatch:'full'
    },
    {
        path:'home',
        component:Home
    },
    {
        path:'login',
        component:Login
    },
    {
        path:'register',
        component:Register
    },
    {
        path:'dashboard',
        component:Dashboard
    },
    {
        path:'viewbook',
        component:ViewBook
    },
];
