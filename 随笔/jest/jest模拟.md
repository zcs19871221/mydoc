# 预缓存的模块无法 mock，比如 reselect 的 createSelector,因为这个不是直接饮用。

# 正常模块的替换使用 jest.mock

1. 使用 jest.mock(路径)实现模块模拟,第二个参数的函数体执行后的返回值将是替换后的模块
2. 如果是 import {}这种形式的，jest.mock 第二个参数返回一个对象
3. 如果是 import XX from '路径'这种 default 的，jest.mock 第二个参数的函数返回一个函数
4. 所有的模块使用 jest.fn(),等到具体的 it 测试的时候，通过`模块名.mockImplementation`来实现具体 mock 值。

具体代码如下：

待测试文件:toTestFile.js

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

依赖模块 1:depend1.js

    export const depend1 = () => '我是depend1';

依赖模块 2:depend2.js

    function depend2() {
        return '我是depend2'
    }
    export default depend2;

单元测试文件：toTestFile.test.js

    import toTestFunction from './toTestFile'
    import {depend1} from './depend1';
    import depend2 from './depend2';
    import {fromJS} from 'immutable';
    import moment from 'moment';
    jest.mock('./depend1', () => {
        return {
            depend1: jest.fn(),
        }
    })
    jest.mock('./depend2', function() {
        return jest.fn();
    })
    jest.mock('immutable', () => {
        return {
            fromJS: jest.fn(),
        }
    })
    jest.mock('moment', () => {
        return jest.fn()
    })

    it('测试mock', () => {
        depend1.mockImplementation(() => 'doit')
        fromJS.mockImplementation(() => 'fromJS')
        moment.mockImplementation(() => 'moment')
        depend2.mockImplementation(() => 'depend2')
        expect(toTestFunction()).toEqual('doit_fromJS_moment_depend2')
    })
    it('测试mock，自己加东西', () => {
        depend1.mockImplementation(() => '[doit]')
        fromJS.mockImplementation(() => '[fromJS]')
        moment.mockImplementation(() => '[moment]')
        depend2.mockImplementation(() => '[depend2]')
        expect(toTestFunction()).toEqual('[doit]_[fromJS]_[moment]_[depend2]')
    })

# 如何写出分离依赖的代码

1. 拆分代码到多个文件，通过模块引入，测试时候 mock 这些模块。
2. 拆分代码成多个函数，上一个（n 个）函数的结果作为参数输入，不用 mock。
3. 转变成类，通过 this 或类名（静态属性）引用，mock 类的引用。
4. 永远不要直接引用同一个文件下的索引，耦合，用上面 3 种方法解耦
5. solid 单一职责，开发关闭，李氏替换，依赖倒置。
