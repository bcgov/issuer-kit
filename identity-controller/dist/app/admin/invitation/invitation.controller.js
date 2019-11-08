"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const typed_event_model_1 = require("../../../core/typed-event/typed-event.model");
const routerOpts = {
    prefix: '/invitation'
};
const router = new Router(routerOpts);
router.post('/', (ctx) => {
    console.log('posting the thing');
    const req = ctx.body;
    watcher.emit({ _id: 'asdfs', type: 'asdfs' });
});
const watcher = new typed_event_model_1.TypedEvent();
watcher.on(test => {
    console.log(test);
});
// watcher.pipe((te) => {
//   console.log(te);
// });
exports.default = router;
