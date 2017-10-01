import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the ExitAppHandler provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ExitAppHandler {
  exit:boolean;

  constructor(public http: Http) {
    this.exit= false;
    console.log('Hello ExitAppHandler Provider');
  }
  // This function is used to handle back button effectively on Android. Reset this.exit to false on entry each view
  setExitApp(param: boolean){
     this.exit=param;
     return this.exit;
  }

  rExitApp()  {
    return this.exit;
  }

}
