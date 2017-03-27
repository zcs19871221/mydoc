# nodeJs的事件循环，计时器和process.nextTick()
## 什么是事件循环
  尽管JavaScript是一个单线程(实际上主线程是单线程，无论浏览器环境还是node环境都是有多个线程的)，但是事件循环却能够帮助nodeJs实现非阻塞IO操作-通过尽可能的让系统内核进行后台操作并在操作结束后通知nodeJs的方式。。

  大多数现代内核是多线程的，它们可以在后台处理多个操作。当其中一个操作结束后，内核告诉nodeJs，然后nodeJs把一个合适的回调函数添加到轮询队列来让程序最终调用。下面我们将讨论更多的细节

## 事件循环解释
当nodeJs开始运行，它会初始化一个事件循环，准备执行用户的程序，程序里可能包含异步调用或者定时器或者调用`process.nextTick()`。

下面的图标标识了事件循环的处理顺序。
![](images/事件循环.png)
每个盒子代表了一个事件循环的阶段。

每个盒子有一个先进先出的回调函数队列等待执行。每个阶段有其自己的特殊方式，一般来说，当事件循环进入了一个阶段，会先执行这个阶段的特定操作，然后执行这个阶段的回调函数队列直到执行完队列里的所有回调函数或者达到回调函数的执行数量上限。当满足其中一个条件的时候，事件循环会进入下个阶段。以此类推。

## 阶段概述
** timers:这个阶段执行`setTimeout()`和`setInterval()`的回调函数。
** I/O callbacks:执行几乎所有的回调函数除了关闭回调，timers阶段的回调和`setImmediate() `
** idle,prepare:只在内部使用
** poll:获取新的I/O事件;node会在这里阻塞当适当的时候
** check:`setImmediate()`在这里触发
** close callback: eg. `socket.on('close', ...)`
在每一个循环之间，nodeJs检查是否有等待的异步I/O或者定时器，如果没有的话结束这一次的轮询。

## 阶段详述
### timers
定时器规定了时间阀值，多少时间后去执行这个定时器的回调而不是具体的执行时间。定时器会尽可能的按照指定的时间延迟去执行，但是系统的调度和其他的回调函数有可能会延迟这个时间。
注意：一般来说，poll phase会控制定时器什么时候执行。


Between each run of the event loop, Node.js checks if it is waiting for any asynchronous I/O or timers and shuts down cleanly if there are not any.




