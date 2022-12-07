import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class HasDatabaseOpenedGuardService implements CanActivate {
  public constructor(private database: DatabaseService, private router: Router) { }

  canActivate(): Observable<boolean | UrlTree> {
    return this.database.database$.pipe(
      map(database => {
        return !!database || this.router.createUrlTree(['/login']);
      })
    );
  }
}
