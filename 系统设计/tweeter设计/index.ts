class PriorityQueue<T> {
    heap: T[]
    comparator: (a:T,b:T) => number
    constructor(queue: T[], comparator: (a:T,b:T) => number) {
        this.heap = queue;
        this.comparator = comparator;
    }

    add(e:T):void {

    }

    pull():T {

    }

    isEmpty():boolean {
        return false;
    }
}
class Tweet {
    time:number;
    id:string;
    prev:Tweet|null;
    constructor(id:string) {
        this.id = id;
        this.time = Date.now();
        this.prev = null;
    }
}
class TweetUser {
    id:string;
    tweet:Tweet|null = null;
    follows: Set<string> = new Set();
    constructor(id:string) {
        this.id = id;
        this.follows.add(id);
    }


    follow(followeeId: string): void {
        this.follows.add(followeeId)
    }

    unfollow(followeeId: string): void {
        this.follows.delete(followeeId)
    }

    postTweet(tweetId:string) {
        const tweet = new Tweet(tweetId);
        tweet.prev = this.tweet;
        this.tweet = tweet;
    }
}
class Tweeter {
    userIdMap:Map<string, TweetUser> = new Map();
    postTweet(userId: string, tweetId: string) {
        if (!this.userIdMap.has(userId)) {
            this.userIdMap.set(userId, new TweetUser(userId))
        }
        this.userIdMap.get(userId).postTweet(tweetId)
    }

    getNewsFeed(userId: string): string[] {
        if (!this.userIdMap.has(userId)) {
            this.userIdMap.set(userId, new TweetUser(userId))
        }
        const res = []
        const pq = new PriorityQueue([...this.userIdMap.get(userId).follows].map(id => this.userIdMap.get(id).tweet), (a, b) => b.time - a.time);
        while (!pq.isEmpty() && res.length < 10) {
            const tweet = pq.pull();
            res.unshift(tweet.id)
            if (tweet.prev) {
                pq.add(tweet.prev)
            }
        }
        return res;
    }

    follow(followerId: string, followeeId: string): void {
        if (!this.userIdMap.has(followerId)) {
            this.userIdMap.set(followerId, new TweetUser(followerId))
        }
        if (!this.userIdMap.has(followeeId)) {
            this.userIdMap.set(followeeId, new TweetUser(followeeId))
        }
        this.userIdMap.get(followerId).follow(followeeId)
    }

    unfollow(followerId: string, followeeId: string): void {
        if (!this.userIdMap.has(followerId) || followerId === followeeId) {
            return 
        }
        this.userIdMap.get(followerId).unfollow(followeeId)
    }
}