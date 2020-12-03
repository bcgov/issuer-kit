import {BehaviorSubject} from 'rxjs'

export function multiGuard(guards: any[]) {
	return (to:any, from:any, next:any) => {
    const obs: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    //first subscription will be triggered when observable is initialized
    //set rets to -1 to account for it
    let rets = -1;

    //hold the navigation route set by any of the guards
    let params:any = null;

		guards.forEach((guard,i)=>{
      //itterate over gaurds until one tries to redirect
      guard(to, from, (param:any)=>{
        //this method will be called async, so we need observable
        obs.next(param)
        
      })
    })
    obs.subscribe(param=>{
      //wait for all guards to return
      rets++;
      //update nav route if isset
      if(param) {
        params = param
      };
      //navigate once all gaurds return
      if(rets===guards.length){
        params? next(params) : next();
      }
    })
	}
}
export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
