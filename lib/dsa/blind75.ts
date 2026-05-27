export interface Blind75Problem {
  num: number;
  title: string;
  leetcodeNum: number;
  slug: string;
  pattern: string;
  visual: string;
  premium?: boolean;
}

export interface Blind75Category {
  id: string;
  name: string;
  problems: Blind75Problem[];
}

export const BLIND75_CATEGORIES: Blind75Category[] = [
  {
    id: "array",
    name: "Array",
    problems: [
      { num: 1,  title: "Two Sum",                              leetcodeNum: 1,   slug: "two-sum",                                    pattern: "Hash map complement",         visual: "seen[target − x] lookup" },
      { num: 2,  title: "Best Time to Buy and Sell Stock",      leetcodeNum: 121, slug: "best-time-to-buy-and-sell-stock",             pattern: "Single pass",                 visual: "Track running min, profit = price − min" },
      { num: 3,  title: "Contains Duplicate",                   leetcodeNum: 217, slug: "contains-duplicate",                         pattern: "Hash set",                    visual: "Insert; if exists → true" },
      { num: 4,  title: "Product of Array Except Self",         leetcodeNum: 238, slug: "product-of-array-except-self",               pattern: "Prefix × suffix",             visual: "Two passes: left-products, right-products" },
      { num: 5,  title: "Maximum Subarray",                     leetcodeNum: 53,  slug: "maximum-subarray",                           pattern: "Kadane's",                    visual: "curr = max(x, curr+x); best = max(best, curr)" },
      { num: 6,  title: "Maximum Product Subarray",             leetcodeNum: 152, slug: "maximum-product-subarray",                   pattern: "Track min & max",             visual: "Negative flips min ↔ max" },
      { num: 7,  title: "Find Minimum in Rotated Sorted Array", leetcodeNum: 153, slug: "find-minimum-in-rotated-sorted-array",       pattern: "Binary search",               visual: "Compare mid vs right to pick half" },
      { num: 8,  title: "Search in Rotated Sorted Array",       leetcodeNum: 33,  slug: "search-in-rotated-sorted-array",             pattern: "BS with rotation",            visual: "One half is always sorted" },
      { num: 9,  title: "3Sum",                                 leetcodeNum: 15,  slug: "3sum",                                       pattern: "Sort + two pointers",         visual: "Fix i, shrink window for pair sum" },
      { num: 10, title: "Container With Most Water",            leetcodeNum: 11,  slug: "container-with-most-water",                  pattern: "Two pointers",                visual: "Move shorter wall inward" },
    ],
  },
  {
    id: "binary",
    name: "Binary",
    problems: [
      { num: 11, title: "Sum of Two Integers",  leetcodeNum: 371, slug: "sum-of-two-integers",  pattern: "Bit XOR + carry",    visual: "a^b = sum w/o carry, (a&b)<<1 = carry" },
      { num: 12, title: "Number of 1 Bits",     leetcodeNum: 191, slug: "number-of-1-bits",     pattern: "n & (n−1) trick",    visual: "Each step clears lowest set bit" },
      { num: 13, title: "Counting Bits",        leetcodeNum: 338, slug: "counting-bits",        pattern: "DP on bits",         visual: "dp[i] = dp[i>>1] + (i&1)" },
      { num: 14, title: "Missing Number",       leetcodeNum: 268, slug: "missing-number",       pattern: "XOR or sum",         visual: "XOR all indices and values" },
      { num: 15, title: "Reverse Bits",         leetcodeNum: 190, slug: "reverse-bits",         pattern: "Bit shift loop",     visual: "Pull LSB → push to result MSB" },
    ],
  },
  {
    id: "dynamic-programming",
    name: "Dynamic Programming",
    problems: [
      { num: 16, title: "Climbing Stairs",                leetcodeNum: 70,   slug: "climbing-stairs",                 pattern: "Fibonacci DP",                 visual: "dp[i] = dp[i−1] + dp[i−2]" },
      { num: 17, title: "Coin Change",                    leetcodeNum: 322,  slug: "coin-change",                     pattern: "Unbounded knapsack",           visual: "dp[a] = min(dp[a−c] + 1)" },
      { num: 18, title: "Longest Increasing Subsequence", leetcodeNum: 300,  slug: "longest-increasing-subsequence",  pattern: "DP O(n²) / patience sort",     visual: "Tails array + binary search" },
      { num: 19, title: "Longest Common Subsequence",     leetcodeNum: 1143, slug: "longest-common-subsequence",      pattern: "2D DP grid",                   visual: "Match → diag+1, else max(↑, ←)" },
      { num: 20, title: "Word Break",                     leetcodeNum: 139,  slug: "word-break",                      pattern: "DP over prefixes",             visual: "dp[i] true if any dp[j] & s[j:i] in dict" },
      { num: 21, title: "Combination Sum",                leetcodeNum: 39,   slug: "combination-sum",                 pattern: "Backtracking",                 visual: "DFS, reuse i (unbounded), prune by sum" },
      { num: 22, title: "House Robber",                   leetcodeNum: 198,  slug: "house-robber",                    pattern: "DP pick / skip",               visual: "dp[i] = max(dp[i−1], dp[i−2] + x)" },
      { num: 23, title: "House Robber II",                leetcodeNum: 213,  slug: "house-robber-ii",                 pattern: "Circular DP",                  visual: "Run #198 on [0..n−2] and [1..n−1]" },
      { num: 24, title: "Decode Ways",                    leetcodeNum: 91,   slug: "decode-ways",                     pattern: "DP on string",                 visual: "Check 1-digit & 2-digit validity" },
      { num: 25, title: "Unique Paths",                   leetcodeNum: 62,   slug: "unique-paths",                    pattern: "Grid DP",                      visual: "dp[i][j] = dp[i−1][j] + dp[i][j−1]" },
      { num: 26, title: "Jump Game",                      leetcodeNum: 55,   slug: "jump-game",                       pattern: "Greedy reach",                 visual: "Track furthest reachable index" },
    ],
  },
  {
    id: "graph",
    name: "Graph",
    problems: [
      { num: 27, title: "Clone Graph",                                    leetcodeNum: 133, slug: "clone-graph",                                     pattern: "DFS/BFS + map",          visual: "old → new node map" },
      { num: 28, title: "Course Schedule",                                leetcodeNum: 207, slug: "course-schedule",                                  pattern: "Topo sort / cycle detect", visual: "Kahn's BFS or DFS w/ colors" },
      { num: 29, title: "Pacific Atlantic Water Flow",                    leetcodeNum: 417, slug: "pacific-atlantic-water-flow",                      pattern: "Multi-source BFS/DFS",   visual: "Reverse flow from each ocean" },
      { num: 30, title: "Number of Islands",                              leetcodeNum: 200, slug: "number-of-islands",                                pattern: "DFS/BFS flood fill",     visual: "Mark visited; count starts" },
      { num: 31, title: "Longest Consecutive Sequence",                   leetcodeNum: 128, slug: "longest-consecutive-sequence",                     pattern: "Hash set",               visual: "Count only from sequence \"starts\"" },
      { num: 32, title: "Alien Dictionary",                               leetcodeNum: 269, slug: "alien-dictionary",                                 pattern: "Topo sort",              visual: "Build edges from adjacent word diffs", premium: true },
      { num: 33, title: "Graph Valid Tree",                               leetcodeNum: 261, slug: "graph-valid-tree",                                 pattern: "Union-Find / DFS",       visual: "Connected & edges == n−1", premium: true },
      { num: 34, title: "Number of Connected Components in Undirected Graph", leetcodeNum: 323, slug: "number-of-connected-components-in-an-undirected-graph", pattern: "Union-Find", visual: "Count distinct roots", premium: true },
    ],
  },
  {
    id: "interval",
    name: "Interval",
    problems: [
      { num: 35, title: "Insert Interval",          leetcodeNum: 57,  slug: "insert-interval",          pattern: "Linear scan",        visual: "Before / overlap merge / after" },
      { num: 36, title: "Merge Intervals",          leetcodeNum: 56,  slug: "merge-intervals",          pattern: "Sort by start",      visual: "Extend last end if overlap" },
      { num: 37, title: "Non-overlapping Intervals",leetcodeNum: 435, slug: "non-overlapping-intervals", pattern: "Greedy by end",      visual: "Keep earliest-ending; remove conflicts" },
      { num: 38, title: "Meeting Rooms",            leetcodeNum: 252, slug: "meeting-rooms",            pattern: "Sort + check",       visual: "Any start[i] < end[i−1] → false", premium: true },
      { num: 39, title: "Meeting Rooms II",         leetcodeNum: 253, slug: "meeting-rooms-ii",         pattern: "Min-heap of ends",   visual: "Reuse room if earliest end ≤ start", premium: true },
    ],
  },
  {
    id: "linked-list",
    name: "Linked List",
    problems: [
      { num: 40, title: "Reverse Linked List",                leetcodeNum: 206, slug: "reverse-linked-list",                 pattern: "Two pointers / iterative",  visual: "prev → curr → next, advance both" },
      { num: 41, title: "Linked List Cycle",                  leetcodeNum: 141, slug: "linked-list-cycle",                   pattern: "Fast & slow pointers",      visual: "Meet = cycle; no meet = none" },
      { num: 42, title: "Merge Two Sorted Lists",             leetcodeNum: 21,  slug: "merge-two-sorted-lists",              pattern: "Dummy head iterative",      visual: "Pick smaller node each step" },
      { num: 43, title: "Merge k Sorted Lists",               leetcodeNum: 23,  slug: "merge-k-sorted-lists",               pattern: "Min-heap of heads",         visual: "Pop min, push next from same list" },
      { num: 44, title: "Remove Nth Node From End of List",   leetcodeNum: 19,  slug: "remove-nth-node-from-end-of-list",   pattern: "Two pointers gap",          visual: "Advance fast n steps first" },
      { num: 45, title: "Reorder List",                       leetcodeNum: 143, slug: "reorder-list",                       pattern: "Find mid + reverse + merge", visual: "Split, reverse second half, interleave" },
      { num: 46, title: "Find the Duplicate Number",          leetcodeNum: 287, slug: "find-the-duplicate-number",          pattern: "Floyd's cycle detection",   visual: "Treat array as linked list" },
    ],
  },
  {
    id: "matrix",
    name: "Matrix",
    problems: [
      { num: 47, title: "Set Matrix Zeroes",    leetcodeNum: 73, slug: "set-matrix-zeroes",    pattern: "In-place flags",       visual: "Use row[0] & col[0] as markers" },
      { num: 48, title: "Spiral Matrix",        leetcodeNum: 54, slug: "spiral-matrix",        pattern: "Boundary shrink",      visual: "Right, down, left, up; shrink bounds" },
      { num: 49, title: "Rotate Image",         leetcodeNum: 48, slug: "rotate-image",         pattern: "Transpose + reflect",  visual: "Transpose then reverse each row" },
      { num: 50, title: "Word Search",          leetcodeNum: 79, slug: "word-search",          pattern: "DFS + backtrack",      visual: "Mark visited, unmark on return" },
      { num: 51, title: "Search a 2D Matrix",   leetcodeNum: 74, slug: "search-a-2d-matrix",   pattern: "Binary search",        visual: "Treat 2D as flat sorted array" },
    ],
  },
  {
    id: "string",
    name: "String",
    problems: [
      { num: 52, title: "Minimum Window Substring",        leetcodeNum: 76,  slug: "minimum-window-substring",         pattern: "Variable window + counts",   visual: "Expand right, shrink left when valid" },
      { num: 53, title: "Valid Anagram",                   leetcodeNum: 242, slug: "valid-anagram",                    pattern: "Count compare",              visual: "26-length array" },
      { num: 54, title: "Group Anagrams",                  leetcodeNum: 49,  slug: "group-anagrams",                   pattern: "Sorted-key hash",            visual: "Group by sorted string / count tuple" },
      { num: 55, title: "Valid Parentheses",               leetcodeNum: 20,  slug: "valid-parentheses",                pattern: "Stack",                      visual: "Push opens, match on close" },
      { num: 56, title: "Valid Palindrome",                leetcodeNum: 125, slug: "valid-palindrome",                 pattern: "Two pointers",               visual: "Skip non-alnum, compare lower" },
      { num: 57, title: "Longest Palindromic Substring",   leetcodeNum: 5,   slug: "longest-palindromic-substring",   pattern: "Expand around center",       visual: "2n−1 centers (odd & even)" },
      { num: 58, title: "Palindromic Substrings",          leetcodeNum: 647, slug: "palindromic-substrings",          pattern: "Expand around center",       visual: "Count expansions" },
      { num: 59, title: "Encode and Decode Strings",       leetcodeNum: 271, slug: "encode-and-decode-strings",       pattern: "Length-prefix framing",      visual: "\"len#payload\"", premium: true },
    ],
  },
  {
    id: "tree",
    name: "Tree",
    problems: [
      { num: 60, title: "Maximum Depth of Binary Tree",                     leetcodeNum: 104,  slug: "maximum-depth-of-binary-tree",                     pattern: "DFS recursion",             visual: "1 + max(L, R)" },
      { num: 61, title: "Same Tree",                                         leetcodeNum: 100,  slug: "same-tree",                                        pattern: "Parallel DFS",              visual: "Compare nodes & recurse" },
      { num: 62, title: "Invert Binary Tree",                                leetcodeNum: 226,  slug: "invert-binary-tree",                               pattern: "DFS swap",                  visual: "Swap L/R, recurse" },
      { num: 63, title: "Binary Tree Maximum Path Sum",                      leetcodeNum: 124,  slug: "binary-tree-maximum-path-sum",                     pattern: "Post-order DFS",            visual: "gain = node + max(L, R, 0); update global" },
      { num: 64, title: "Binary Tree Level Order Traversal",                 leetcodeNum: 102,  slug: "binary-tree-level-order-traversal",                pattern: "BFS by level",              visual: "Queue size = level width" },
      { num: 65, title: "Serialize and Deserialize Binary Tree",             leetcodeNum: 297,  slug: "serialize-and-deserialize-binary-tree",            pattern: "Pre-order + null markers",  visual: "Queue of tokens" },
      { num: 66, title: "Subtree of Another Tree",                           leetcodeNum: 572,  slug: "subtree-of-another-tree",                          pattern: "DFS + sameTree",            visual: "At each node, try match" },
      { num: 67, title: "Construct Binary Tree from Preorder and Inorder",   leetcodeNum: 105,  slug: "construct-binary-tree-from-preorder-and-inorder-traversal", pattern: "Recursion + index map", visual: "First preorder = root; split inorder" },
      { num: 68, title: "Validate Binary Search Tree",                       leetcodeNum: 98,   slug: "validate-binary-search-tree",                      pattern: "DFS with bounds",           visual: "Pass (low, high) down" },
      { num: 69, title: "Kth Smallest Element in a BST",                     leetcodeNum: 230,  slug: "kth-smallest-element-in-a-bst",                    pattern: "Inorder traversal",         visual: "Stop at k-th visit" },
      { num: 70, title: "Lowest Common Ancestor of a BST",                   leetcodeNum: 235,  slug: "lowest-common-ancestor-of-a-binary-search-tree",   pattern: "Walk by value",             visual: "Split point = LCA" },
      { num: 71, title: "Implement Trie (Prefix Tree)",                      leetcodeNum: 208,  slug: "implement-trie-prefix-tree",                       pattern: "Trie nodes",                visual: "26 children + isEnd" },
      { num: 72, title: "Design Add and Search Words Data Structure",         leetcodeNum: 211,  slug: "design-add-and-search-words-data-structure",       pattern: "Trie + DFS for '.'",        visual: "Wildcard branches all children" },
      { num: 73, title: "Word Search II",                                     leetcodeNum: 212,  slug: "word-search-ii",                                   pattern: "Trie + grid DFS",           visual: "Prune trie branches as found" },
    ],
  },
  {
    id: "heap",
    name: "Heap",
    problems: [
      { num: 74, title: "Top K Frequent Elements",      leetcodeNum: 347, slug: "top-k-frequent-elements",      pattern: "Bucket sort / heap",  visual: "Buckets indexed by frequency" },
      { num: 75, title: "Find Median from Data Stream", leetcodeNum: 295, slug: "find-median-from-data-stream", pattern: "Two heaps",           visual: "Max-heap (low) + min-heap (high)" },
    ],
  },
];

export const BLIND75_TOTAL = BLIND75_CATEGORIES.reduce((sum, c) => sum + c.problems.length, 0);
