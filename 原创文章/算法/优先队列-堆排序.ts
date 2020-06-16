// 1. 优先队列基于堆排序
// 2. 内部有一个堆，堆的特性是，一个数组表示的满二叉树，父亲节点永远大于等于（小于等于）子节点。
// 3. 出队：从pos 0 位置出队，把队尾元素放到0，然后向下调整。
// 4. 入队：把元素放入队尾，从heap.length位置，向上调整。
// 5. 初始化：从最后一个父亲节点，依次pos -1，向下调整。
// 6. 删除一个元素：从改位置，先向下调整。如果调整完后位置不变，有可能该元素小于父亲节点，再向上调整。
export default class PriorityQueue<T> {
    heap: T[]
    comparator: (a: T, b: T) => number
    constructor(queue: T[], comparator: (a: T, b: T) => number) {
        this.heap = queue;
        this.comparator = comparator;
    }

    slipUp(pos: number, e: T) {
        while (pos > 0) {
            const parent = (pos - (pos % 2 === 0 ? 2 : 1)) / 2
            if (this.comparator(e, this.heap[parent]) < 0) {
                this.heap[pos] = this.heap[parent];
                pos = parent;
            } else {
                break;
            }
        }
        this.heap[pos] = e;
    }

    slipDown(pos: number, e: T) {
        while (pos < Math.floor(this.heap.length / 2)) {
            let child = pos * 2 + 1;
            const right = child + 1;
            if (right < this.heap.length && this.comparator(this.heap[right], this.heap[child]) < 0) {
                child = right;
            }
            if (this.comparator(e, this.heap[child]) < 0) {
                break;
            }
            this.heap[pos] = this.heap[child]
            pos = child;

        }
        this.heap[pos] = e
    }

    init() {
        let start = Math.floor((this.heap.length / 2));
        while (start > 0) {
            this.slipDown(start, this.heap[start]);
        }
    }

    add(e: T): void {
        const last = this.heap.length
        this.heap.length += 1;
        this.slipUp(last, e)
    }

    pull(): T {
        if (this.heap.length === 0) {
            return null;
        }
        const e = this.heap[0];
        this.heap.length -= 1;
        if (this.heap.length !== 0) {
            this.slipDown(0, this.heap[this.heap.length]);
        }
        return e;
    }

    remove(e: T): boolean {
        const pos = this.heap.indexOf(e);
        if (pos === -1) {
            return false;
        }
        this.heap.length -= 1;
        const last = this.heap[this.heap.length]
        this.slipDown(pos, last);
        if (this.heap[pos] === last) {
            this.slipUp(pos, last)
        }
    }

    isEmpty(): boolean {
        return this.heap.length === 0
    }
}