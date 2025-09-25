import { Routes } from '@angular/router';
import { FileUpload } from './components/file-upload/file-upload';
import { Result } from './components/result/result';
export const routes: Routes = [
{ path: '', component: FileUpload },
{ path: 'result', component: Result },


];
