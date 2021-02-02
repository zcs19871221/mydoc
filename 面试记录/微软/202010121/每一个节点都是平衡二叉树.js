// 1. 
class Tree {
  left = null; /* Tree */
  right = null;
}

const maxHeight = (tree, memo) => {
  if (!tree) {
    return 0;
  }
  if (memo.has(tree)) {
    return memo.get(tree);
  }
  memo.set(
    tree,
    1 + Math.max(maxHeight(tree.left, memo), maxHeight(tree.right, memo)),
  );
  return memo.get(tree);
};
const isBalanceTree = (tree) => {
  if (!tree) {
    return [true, 0];
  }
  const [isLeft, leftHeight] = isBalanceTree(tree.left);
  const [isRight, rightHeight] = isBalanceTree(tree.right);
  return [
    Math.abs(leftHeight - rightHeight) <= 1 && isLeft && isRight,
    1 + Math.max(leftHeight, rightHeight),
  ];
};
// helper():[boolean, number]
