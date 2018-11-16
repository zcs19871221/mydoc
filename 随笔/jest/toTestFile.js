// 自己的写的依赖模块1
import {
    depend1
} from './depend1.js';
// 自己的写的依赖模块2，default
import depend2 from './depend2.js';
// 第三方包依赖
import {fromJS} from 'immutable';
// 第三方包依赖default
import moment from 'moment'
const toTestFunction = () => {
    return depend1() + '_' + fromJS() + '_' + moment() + '_' + depend2();
}
export default toTestFunction;