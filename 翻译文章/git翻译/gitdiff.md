原文地址：https://git-scm.com/docs/git-diff


# 基本知识
1. 方括号表示可选
2. 尖括号表示必须填
# 名称
git-diff 在提交，提交和工作树之间显示不同

# 语法

    git diff [options] [<commit>] [--] [<path>…​]
    git diff [options] --cached [<commit>] [--] [<path>…​]
    git diff [options] <commit> <commit> [--] [<path>…​]
    git diff [options] <blob> <blob>
    git diff [options] [--no-index] [--] <path> <path>

# 描述

`git diff [--options] [--] [<path>…​]` 
比较路径文件内容和暂存区内容（add后的未commit的内容）不同

`git diff --no-index [--options] [--] [<path>…​]`
比较文件之间不同,忽略暂存区文件，如果文件都在git目录中需要加--no-index,
否则不用加。

`git diff [--options] --cached [<commit>] [--] [<path>…​]`
比较指定路径下暂存区的文件（add后未commit的内容）和指定版本号的文件的不同，如果不提供commit，默认取HEAD。
这个暂存区包括目前已经commit的部分，不单指add了没有提交的部分

`git diff [--options] <commit> [--] [<path>…​]`
比较指定commit和路径下工作文件的不同

`git diff [--options] <commit>...<commit> [--] [<path>…​]`
等价于git diff 两个分支的公共父分支 第二个分支

# 选项
-p
-u
--patch
产生一个patch