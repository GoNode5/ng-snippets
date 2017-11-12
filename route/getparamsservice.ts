by  @Toxicable
https://stackblitz.com/edit/angular-param-service

 import { Component, VERSION, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable'
import { ReplaySubject } from 'rxjs/ReplaySubject'
import {  Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators'

@Injectable()
export class RouterParamSeervice{
  params$: Observable<{[key: string]: string}>;

  constructor(
    private readonly router: Router,
    private readonly rootRoute: ActivatedRoute,
  ){
    this.params$ = router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => this.getParams(this.rootRoute))
    )
  }
  paramsSnapshot(){
    return this.getParams(this.rootRoute)
  }

  private getParams(route: ActivatedRoute){
    // route param names (eg /a/:personId) must be ditinct within
    // a route otherwise they'll be overwritten
    let params = route.snapshot.params
    params = { ...route.snapshot.queryParams, ...params}
    if(route.children){
      for(let r of route.children){
        params = {...this.getParams(r), ...params};        
      }
    }
    return params
  }

}

@Component({
  selector: 'child2',
  template: `Child2`
})
export class Child2  {
  version = 'Angular: v' + VERSION.full;
}

@Component({
  selector: 'child1',
  template: `
  Child1
  <router-outlet></router-outlet>`
})
export class Child1  {
  version = 'Angular: v' + VERSION.full;
}

@Component({
  selector: 'app-root',
  template: `
  <a routerLink=".">Home</a>
  <a routerLink="persons/asdfasdf/details">child param</a>
  <a routerLink="persons/asdfasdf/details" [queryParams]="{debug: true}">child param w/ query</a>
  <hr />
  URL: {{router.url}} <br />
  Params: {{params.params$ | async | json}} <br />
  <router-outlet></router-outlet>`
})
export class AppComponent  {
  constructor(
    public readonly router: Router,
    public params: RouterParamSeervice,
  ){}
}
