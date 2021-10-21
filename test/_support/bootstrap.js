"use strict";
// import 'chai/register-assert';  // Using Assert style
// import 'chai/register-expect';  // Using Expect style
// import 'chai/register-should';  // Using Should style
//
// export function bootstrap(): void {
//
// }
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrap = void 0;
require("chai/register-assert"); // Using Assert style
require("chai/register-expect"); // Using Expect style
require("chai/register-should"); // Using Should style
const chai_1 = __importDefault(require("chai"));
const sinon_1 = __importDefault(require("sinon"));
const sinon_chai_1 = __importDefault(require("sinon-chai"));
const btoa_1 = __importDefault(require("btoa"));
const jsdom_1 = require("jsdom");
const utils_1 = require("./utils");
const env = (0, utils_1.getEnv)();
const dom = new jsdom_1.JSDOM(``, {
    url: env.get('APP_URL', 'http://localhost') + '/' + env.get('STREAMS_API_PREFIX', 'api'),
    contentType: "text/html",
    includeNodeLocations: true,
    storageQuota: 10000000
});
global['window'] = dom.window;
global.btoa = btoa_1.default;
chai_1.default.use(sinon_chai_1.default);
function bootstrap() {
    return { chai: chai_1.default, sinon: sinon_1.default, env };
}
exports.bootstrap = bootstrap;
