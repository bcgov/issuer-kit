"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const path_1 = require("path");
const admin_1 = require("./app/admin/admin");
dotenv_1.config({ path: path_1.resolve(__dirname, '../config.env') });
admin_1.default.listen(process.env.PORT, () => {
    console.log('listening on port: ', process.env.port);
});
