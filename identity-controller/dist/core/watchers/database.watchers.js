"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typed_event_model_1 = require("../typed-event/typed-event.model");
const invitationWatcher = new typed_event_model_1.TypedEvent();
invitationWatcher.on(invitation => {
    console.log(invitation);
});
exports.default = { invitationWatcher };
