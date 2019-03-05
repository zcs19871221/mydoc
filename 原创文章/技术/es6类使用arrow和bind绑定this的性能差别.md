# es6 类使用 arrow 和 bind 绑定 this 的性能差别

## 为什么要绑定 this

事件响应函数的 this 为 undefine

考虑这种使用场景：

    <div onClik={this.method}>

method 中的 this 是什么？undefined
因为这是个事件响应函数，没有对象调用 method，所以 this 指向 undefined

## 绑定 this 方法

### bind

    class BindFn {
        constructor() {
            this.fn = this.fn.bind(this);
        }

        fn() {
            const str = 'sdffsdfsdf'.repeat(999999);
            return str;
        }

    }

### 箭头函数

    class ArrowFn {
        fn = () => {
            const str = 'sdffsdfsdf'.repeat(999999);
            return str;
        };
    }

### 区别

    bind等价于
    const bind = function(scope) {
        const fn = this;
        return function(...args) {
            return fn.apply(this, args);
        };
    };

    this.fn = this.fn.bind(this)相当于在实例属性上，创建了一个新函数，这个新函数
    创建了一点内存空间，但目标函数引用的是原型对象上的索引。

    fn = () => {}
    等价于
    constructor() {
        this.fn = () => {}
    }

    当执行的时候，每次创建一个新函数。

## 理论总结

    当类创建一个实例时候，内存消耗没区别
    当类创建多个实例时候，使用bind方法会节省内存。

## 我的测试

测试 html 代码：

    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta http-equiv="X-UA-Compatible" content="ie=edge" />
            <title>Document</title>
        </head>
        <body></body>
        <script>
            class BindFn {
                constructor() {
                    this.myfn = this.fn.bind(this);
                }

                fn() {
                    const str = 'sdffsdfsdf'.repeat(999999);
                    return str;
                }
            }
            class ArrowFn {
                fn = () => {
                    const str = 'sdffsdfsdf'.repeat(999999);
                    return str;
                };
            }
            const objList = [];
            let startTime = new Date();
            for (let i = 0; i < 999999; i++) {
                objList.push(new BindFn());
                // objList.push(new ArrowFn());
            }
            console.log('spend time:' + (new Date() - startTime));
        </script>
    </html>

测试方法：打开 html 先使用 new BindFn 方法，然后使用 chrome 的 performance 的 reload 重新载入页面，查看内存中 jsHeap 中的峰值，查看 console 中完成实例化的使用时间，连续十次。然后把 BindFn 注释，ArrowFn 打开，重复十次操作。我记录的值，以及最后统计如下；

    const binds = [
        {
            jstime: 508,
            maxHeap: '188',
        },
        {
            jstime: 526,
            maxHeap: '196',
        },
        {
            jstime: 501,
            maxHeap: '145',
        },
        {
            jstime: 478,
            maxHeap: '139',
        },
        {
            jstime: 602,
            maxHeap: '132',
        },
        {
            jstime: 505,
            maxHeap: '141',
        },
        {
            jstime: 378,
            maxHeap: '194',
        },
        {
            jstime: 643,
            maxHeap: '194',
        },
        {
            jstime: 377,
            maxHeap: '194',
        },
        {
            jstime: 754,
            maxHeap: '211',
        },
    ];

    const arrows = [
        {
            jstime: 1058,
            maxHeap: '106',
        },
        {
            jstime: 1129,
            maxHeap: '103',
        },
        {
            jstime: 1161,
            maxHeap: '173',
        },
        {
            jstime: 1081,
            maxHeap: '174',
        },
        {
            jstime: 1034,
            maxHeap: '209',
        },
        {
            jstime: 1111,
            maxHeap: '209',
        },
        {
            jstime: 1089,
            maxHeap: '209',
        },
        {
            jstime: 924,
            maxHeap: '204',
        },
        {
            jstime: 1011,
            maxHeap: '216',
        },
        {
            jstime: 1214,
            maxHeap: '145',
        },
    ];
    const calAverage = data => {
        const total = data.reduce((prev, current) => {
            return {
                jstime: prev.jstime + current.jstime,
                maxHeap: +prev.maxHeap + +current.maxHeap,
            };
        });
        const len = data.length;
        const { jstime, maxHeap } = total;
        console.log(`jstime: ${jstime / len} maxHeap: ${maxHeap / len}M`);
    };
    console.log('binds结果');
    // jstime: 527.2 maxHeap: 173.4M
    calAverage(binds);
    // jstime: 1081.2 maxHeap: 174.8M
    console.log('arrows结果');
    calAverage(arrows);

从我的理论推测，js 运行时间和内存占用应该都是 bind 小。
但从结果看，内存占用并没有相差多少，执行时间上看 bind 明显要小一些。
