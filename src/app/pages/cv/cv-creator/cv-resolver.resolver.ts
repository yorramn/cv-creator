import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import {CommonService} from "../../../services/common.service";

@Injectable({
  providedIn: 'root'
})
export class CvResolverResolver implements Resolve<boolean> {
  constructor(private commonService : CommonService) {
  }
  resolve(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<any> {
    return this.commonService.findAllStates();
  }
}
