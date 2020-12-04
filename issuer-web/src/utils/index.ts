import { BehaviorSubject } from "rxjs";
import { Route } from "vue-router";

export function multiGuard(guards: Function[]) {
  return (to: Route, from: Route, next: Function) => {
    const obs: BehaviorSubject<object | undefined> = new BehaviorSubject<
      object | undefined
    >(undefined);

    //first subscription will be triggered when observable is initialized
    //set rets to -1 to account for it
    let rets = -1;

    //hold the navigation route set by any of the guards
    let params: object = {};

    guards.forEach((guard: Function) => {
      //itterate over guards until one tries to redirect
      guard(to, from, (param?: object) => {
        //this method will be called async, so we need observable
        obs.next(param);
      });
    });
    obs.subscribe(param => {
      //wait for all guards to return
      rets++;
      //update nav route if isset
      if (param) {
        params = param;
      }
      //navigate once all guards return
      if (rets === guards.length) {
        params !== {} ? next(params) : next();
      }
    });
  };
}
export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
