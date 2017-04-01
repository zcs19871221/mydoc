1. 官网的伪代码逻辑

    require(X) from module at path Y
    1. If X is a core module,
       a. return the core module
       b. STOP
    2. If X begins with './' or '/' or '../'
       a. LOAD_AS_FILE(Y + X)
       b. LOAD_AS_DIRECTORY(Y + X)
    3. LOAD_NODE_MODULES(X, dirname(Y))
    4. THROW "not found"

    LOAD_AS_FILE(X)
    1. If X is a file, load X as JavaScript text.  STOP
    2. If X.js is a file, load X.js as JavaScript text.  STOP
    3. If X.json is a file, parse X.json to a JavaScript Object.  STOP
    4. If X.node is a file, load X.node as binary addon.  STOP

    LOAD_AS_DIRECTORY(X)
    1. If X/package.json is a file,
       a. Parse X/package.json, and look for "main" field.
       b. let M = X + (json main field)
       c. LOAD_AS_FILE(M)
    2. If X/index.js is a file, load X/index.js as JavaScript text.  STOP
    3. If X/index.json is a file, parse X/index.json to a JavaScript object. STOP
    4. If X/index.node is a file, load X/index.node as binary addon.  STOP

    LOAD_NODE_MODULES(X, START)
    1. let DIRS=NODE_MODULES_PATHS(START)
    2. for each DIR in DIRS:
       a. LOAD_AS_FILE(DIR/X)
       b. LOAD_AS_DIRECTORY(DIR/X)

    NODE_MODULES_PATHS(START)
    1. let PARTS = path split(START)
    2. let I = count of PARTS - 1
    3. let DIRS = []
    4. while I >= 0,
       a. if PARTS[I] = "node_modules" CONTINUE
       b. DIR = path join(PARTS[0 .. I] + "node_modules")
       c. DIRS = DIRS + DIR
       d. let I = I - 1
    5. return DIRS
    
2. 中文的解释

    .node文件通过dlopen打开
  
    在一个模块中执行require(x)，当前路径是y

    1. 首先判断x是否是系统模块，如果是，返回模块，结束
    2. 如果没找到，判断x是否以路径开始("./", "../", "/"),如果有路径
        1. [按照文件查找]，如果找到了，结束
        2. 如果没找到，按照目录的方式查找
        3. 结束
    3. 按照模块方式查找
    4. 如果没找到，抛出错误

    [按照文件查找]
    1. 寻找x作为一个js文件
    2. 寻找x.js作为一个js文件
    3. 寻找x.json作为一个json对象加载
    4. 寻找x.node作为一个二进制插件加载

    [按照目录方式查找]
    1. 查找x/package.json文件，如果有main字段的话，main字段[按照文件查找] x/main字段位置
    2. 查找x/index.js作为js文件
    3. 查找x/index.json作为json对象
    4. 查找x/index.node作为二进制插件

    [按照模块方式查找]
    1. 从当前目录到根目录，每个目录加上/node_modules进行查找，
        1. [按文件查找]  [每个目录/node_modules/x]
        2. [按目录查找]  [每个目录/node_modules/x]
