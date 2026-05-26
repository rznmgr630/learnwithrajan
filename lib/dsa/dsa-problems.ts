export type Difficulty = "basic" | "medium" | "advanced";
export type SolutionLanguage = "javascript" | "typescript" | "php" | "java" | "python";
export type BasicCategory = "arrays" | "linked-lists" | "stacks-queues" | "trees" | "bst" | "heaps" | "graphs" | "hashing";

export const DSA_BASIC_CATEGORIES: { id: BasicCategory; label: string; hint: string }[] = [
  { id: "arrays",        label: "Arrays",              hint: "Fixed vs. dynamic arrays and basic operations" },
  { id: "linked-lists",  label: "Linked Lists",        hint: "Singly and doubly linked lists" },
  { id: "stacks-queues", label: "Stacks & Queues",     hint: "LIFO and FIFO structures" },
  { id: "trees",         label: "Trees",               hint: "Binary trees, traversals (pre/in/post-order)" },
  { id: "bst",           label: "Binary Search Trees", hint: "Efficient searching and sorted data management" },
  { id: "heaps",         label: "Heaps",               hint: "Min/Max heaps and Priority Queues" },
  { id: "graphs",        label: "Graphs",              hint: "Adjacency lists/matrices and basic terminology" },
  { id: "hashing",       label: "Hashing",             hint: "Understanding hash maps and internal operations" },
];

export const LANGUAGE_LABELS: Record<SolutionLanguage, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  php: "PHP",
  java: "Java",
  python: "Python",
};

export interface DsaExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface DsaSolution {
  language: SolutionLanguage;
  code: string;
}

export interface DsaProblem {
  id: number;
  slug: string;
  title: string;
  difficulty: Difficulty;
  category: BasicCategory;
  tags: string[];
  description: string;
  constraints: string[];
  examples: DsaExample[];
  solutions: DsaSolution[];
}

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  basic: "Basic",
  medium: "Medium",
  advanced: "Advanced",
};

export const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  basic: "text-emerald-500 bg-emerald-500/10",
  medium: "text-amber-500 bg-amber-500/10",
  advanced: "text-rose-500 bg-rose-500/10",
};

export const DSA_BASIC_PROBLEMS: DsaProblem[] = [
  {
    id: 1,
    slug: "two-sum",
    title: "Two Sum",
    difficulty: "basic",
    category: "hashing",
    tags: ["Array", "Hash Map"],
    description:
      "Given an array of integers `nums` and an integer `target`, return the **indices** of the two numbers that add up to `target`.\n\nYou may assume that each input has **exactly one solution**, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    constraints: [
      "2 ≤ nums.length ≤ 10⁴",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
      "-10⁹ ≤ target ≤ 10⁹",
      "Only one valid answer exists.",
    ],
    examples: [
      {
        input: "nums = [2, 7, 11, 15], target = 9",
        output: "[0, 1]",
        explanation: "nums[0] + nums[1] = 2 + 7 = 9, so return [0, 1].",
      },
      {
        input: "nums = [3, 2, 4], target = 6",
        output: "[1, 2]",
        explanation: "nums[1] + nums[2] = 2 + 4 = 6, so return [1, 2].",
      },
      {
        input: "nums = [3, 3], target = 6",
        output: "[0, 1]",
      },
    ],
    solutions: [
      {
        language: "javascript",
        code: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  const seen = new Map();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }

    seen.set(nums[i], i);
  }

  return [];
}

// Example usage
console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
console.log(twoSum([3, 2, 4], 6));      // [1, 2]`,
      },
      {
        language: "typescript",
        code: `function twoSum(nums: number[], target: number): number[] {
  const seen = new Map<number, number>();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (seen.has(complement)) {
      return [seen.get(complement)!, i];
    }

    seen.set(nums[i], i);
  }

  return [];
}

// Example usage
console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
console.log(twoSum([3, 2, 4], 6));      // [1, 2]`,
      },
      {
        language: "php",
        code: `<?php

function twoSum(array $nums, int $target): array {
    $seen = [];

    foreach ($nums as $i => $num) {
        $complement = $target - $num;

        if (isset($seen[$complement])) {
            return [$seen[$complement], $i];
        }

        $seen[$num] = $i;
    }

    return [];
}

// Example usage
print_r(twoSum([2, 7, 11, 15], 9)); // [0, 1]
print_r(twoSum([3, 2, 4], 6));      // [1, 2]`,
      },
      {
        language: "java",
        code: `import java.util.HashMap;
import java.util.Map;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();

        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];

            if (seen.containsKey(complement)) {
                return new int[]{seen.get(complement), i};
            }

            seen.put(nums[i], i);
        }

        return new int[]{};
    }

    public static void main(String[] args) {
        Solution sol = new Solution();
        int[] result = sol.twoSum(new int[]{2, 7, 11, 15}, 9);
        System.out.println(result[0] + ", " + result[1]); // 0, 1
    }
}`,
      },
      {
        language: "python",
        code: `def two_sum(nums: list[int], target: int) -> list[int]:
    seen: dict[int, int] = {}

    for i, num in enumerate(nums):
        complement = target - num

        if complement in seen:
            return [seen[complement], i]

        seen[num] = i

    return []


# Example usage
print(two_sum([2, 7, 11, 15], 9))  # [0, 1]
print(two_sum([3, 2, 4], 6))       # [1, 2]`,
      },
    ],
  },
  {
    id: 2,
    slug: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "basic",
    category: "stacks-queues",
    tags: ["Stack", "String"],
    description:
      "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is **valid**.\n\nAn input string is valid if:\n\n- Open brackets must be closed by the **same type** of brackets.\n- Open brackets must be closed in the **correct order**.\n- Every close bracket has a corresponding open bracket of the **same type**.",
    constraints: [
      "1 ≤ s.length ≤ 10⁴",
      "s consists of parentheses only '()[]{}'",
    ],
    examples: [
      {
        input: 's = "()"',
        output: "true",
      },
      {
        input: 's = "()[]{}"',
        output: "true",
      },
      {
        input: 's = "(]"',
        output: "false",
        explanation: "The bracket types don't match.",
      },
      {
        input: 's = "([)]"',
        output: "false",
        explanation: "Brackets are not closed in the correct order.",
      },
    ],
    solutions: [
      {
        language: "javascript",
        code: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
  const stack = [];
  const pairs = { ')': '(', '}': '{', ']': '[' };

  for (const ch of s) {
    if (ch in pairs) {
      // Closing bracket — top of stack must match
      if (stack.pop() !== pairs[ch]) return false;
    } else {
      // Opening bracket — push onto stack
      stack.push(ch);
    }
  }

  return stack.length === 0;
}

// Example usage
console.log(isValid("()[]{}"));  // true
console.log(isValid("(]"));      // false
console.log(isValid("([)]"));    // false`,
      },
      {
        language: "typescript",
        code: `function isValid(s: string): boolean {
  const stack: string[] = [];
  const pairs: Record<string, string> = { ')': '(', '}': '{', ']': '[' };

  for (const ch of s) {
    if (ch in pairs) {
      if (stack.pop() !== pairs[ch]) return false;
    } else {
      stack.push(ch);
    }
  }

  return stack.length === 0;
}

// Example usage
console.log(isValid("()[]{}"));  // true
console.log(isValid("(]"));      // false`,
      },
      {
        language: "php",
        code: `<?php

function isValid(string $s): bool {
    $stack = [];
    $pairs = [')' => '(', '}' => '{', ']' => '['];

    foreach (str_split($s) as $ch) {
        if (isset($pairs[$ch])) {
            if (array_pop($stack) !== $pairs[$ch]) return false;
        } else {
            $stack[] = $ch;
        }
    }

    return empty($stack);
}

// Example usage
var_dump(isValid("()[]{}"));  // true
var_dump(isValid("(]"));      // false`,
      },
      {
        language: "java",
        code: `import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;

class Solution {
    public boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        Map<Character, Character> pairs = Map.of(')', '(', '}', '{', ']', '[');

        for (char ch : s.toCharArray()) {
            if (pairs.containsKey(ch)) {
                if (stack.isEmpty() || stack.pop() != pairs.get(ch)) {
                    return false;
                }
            } else {
                stack.push(ch);
            }
        }

        return stack.isEmpty();
    }

    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(sol.isValid("()[]{}")); // true
        System.out.println(sol.isValid("(]"));     // false
    }
}`,
      },
      {
        language: "python",
        code: `def is_valid(s: str) -> bool:
    stack: list[str] = []
    pairs = {')': '(', '}': '{', ']': '['}

    for ch in s:
        if ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False
        else:
            stack.append(ch)

    return len(stack) == 0


# Example usage
print(is_valid("()[]{}"))  # True
print(is_valid("(]"))      # False
print(is_valid("([)]"))    # False`,
      },
    ],
  },
  {
    id: 3,
    slug: "best-time-to-buy-and-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "basic",
    category: "arrays",
    tags: ["Array", "Greedy"],
    description:
      "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`-th day.\n\nYou want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.\n\nReturn the **maximum profit** you can achieve from this transaction. If you cannot achieve any profit, return `0`.",
    constraints: [
      "1 ≤ prices.length ≤ 10⁵",
      "0 ≤ prices[i] ≤ 10⁴",
    ],
    examples: [
      {
        input: "prices = [7, 1, 5, 3, 6, 4]",
        output: "5",
        explanation: "Buy on day 2 (price = 1), sell on day 5 (price = 6). Profit = 6 − 1 = 5.",
      },
      {
        input: "prices = [7, 6, 4, 3, 1]",
        output: "0",
        explanation: "Prices only decrease — no profitable transaction is possible.",
      },
    ],
    solutions: [
      {
        language: "javascript",
        code: `/**
 * @param {number[]} prices
 * @return {number}
 */
function maxProfit(prices) {
  let minPrice = Infinity;
  let maxProfit = 0;

  for (const price of prices) {
    minPrice = Math.min(minPrice, price);
    maxProfit = Math.max(maxProfit, price - minPrice);
  }

  return maxProfit;
}

// Example usage
console.log(maxProfit([7, 1, 5, 3, 6, 4])); // 5
console.log(maxProfit([7, 6, 4, 3, 1]));     // 0`,
      },
      {
        language: "typescript",
        code: `function maxProfit(prices: number[]): number {
  let minPrice = Infinity;
  let maxProfit = 0;

  for (const price of prices) {
    minPrice = Math.min(minPrice, price);
    maxProfit = Math.max(maxProfit, price - minPrice);
  }

  return maxProfit;
}

// Example usage
console.log(maxProfit([7, 1, 5, 3, 6, 4])); // 5
console.log(maxProfit([7, 6, 4, 3, 1]));     // 0`,
      },
      {
        language: "php",
        code: `<?php

function maxProfit(array $prices): int {
    $minPrice = PHP_INT_MAX;
    $maxProfit = 0;

    foreach ($prices as $price) {
        $minPrice = min($minPrice, $price);
        $maxProfit = max($maxProfit, $price - $minPrice);
    }

    return $maxProfit;
}

// Example usage
echo maxProfit([7, 1, 5, 3, 6, 4]); // 5
echo maxProfit([7, 6, 4, 3, 1]);     // 0`,
      },
      {
        language: "java",
        code: `class Solution {
    public int maxProfit(int[] prices) {
        int minPrice = Integer.MAX_VALUE;
        int maxProfit = 0;

        for (int price : prices) {
            minPrice = Math.min(minPrice, price);
            maxProfit = Math.max(maxProfit, price - minPrice);
        }

        return maxProfit;
    }

    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(sol.maxProfit(new int[]{7, 1, 5, 3, 6, 4})); // 5
        System.out.println(sol.maxProfit(new int[]{7, 6, 4, 3, 1}));     // 0
    }
}`,
      },
      {
        language: "python",
        code: `def max_profit(prices: list[int]) -> int:
    min_price = float('inf')
    max_profit = 0

    for price in prices:
        min_price = min(min_price, price)
        max_profit = max(max_profit, price - min_price)

    return max_profit


# Example usage
print(max_profit([7, 1, 5, 3, 6, 4]))  # 5
print(max_profit([7, 6, 4, 3, 1]))      # 0`,
      },
    ],
  },
  {
    id: 4,
    slug: "contains-duplicate",
    title: "Contains Duplicate",
    difficulty: "basic",
    category: "hashing",
    tags: ["Array", "Hash Set"],
    description:
      "Given an integer array `nums`, return `true` if any value appears **at least twice** in the array, and return `false` if every element is **distinct**.",
    constraints: [
      "1 ≤ nums.length ≤ 10⁵",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
    ],
    examples: [
      {
        input: "nums = [1, 2, 3, 1]",
        output: "true",
        explanation: "1 appears at index 0 and index 3.",
      },
      {
        input: "nums = [1, 2, 3, 4]",
        output: "false",
        explanation: "All elements are distinct.",
      },
      {
        input: "nums = [1, 1, 1, 3, 3, 4, 3, 2, 4, 2]",
        output: "true",
      },
    ],
    solutions: [
      {
        language: "javascript",
        code: `/**
 * @param {number[]} nums
 * @return {boolean}
 */
function containsDuplicate(nums) {
  const seen = new Set();

  for (const num of nums) {
    if (seen.has(num)) return true;
    seen.add(num);
  }

  return false;
}

// Example usage
console.log(containsDuplicate([1, 2, 3, 1])); // true
console.log(containsDuplicate([1, 2, 3, 4])); // false`,
      },
      {
        language: "typescript",
        code: `function containsDuplicate(nums: number[]): boolean {
  const seen = new Set<number>();

  for (const num of nums) {
    if (seen.has(num)) return true;
    seen.add(num);
  }

  return false;
}

// Example usage
console.log(containsDuplicate([1, 2, 3, 1])); // true
console.log(containsDuplicate([1, 2, 3, 4])); // false`,
      },
      {
        language: "php",
        code: `<?php

function containsDuplicate(array $nums): bool {
    $seen = [];

    foreach ($nums as $num) {
        if (isset($seen[$num])) return true;
        $seen[$num] = true;
    }

    return false;
}

// Example usage
var_dump(containsDuplicate([1, 2, 3, 1])); // true
var_dump(containsDuplicate([1, 2, 3, 4])); // false`,
      },
      {
        language: "java",
        code: `import java.util.HashSet;
import java.util.Set;

class Solution {
    public boolean containsDuplicate(int[] nums) {
        Set<Integer> seen = new HashSet<>();

        for (int num : nums) {
            if (!seen.add(num)) return true;
        }

        return false;
    }

    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(sol.containsDuplicate(new int[]{1, 2, 3, 1})); // true
        System.out.println(sol.containsDuplicate(new int[]{1, 2, 3, 4})); // false
    }
}`,
      },
      {
        language: "python",
        code: `def contains_duplicate(nums: list[int]) -> bool:
    seen: set[int] = set()

    for num in nums:
        if num in seen:
            return True
        seen.add(num)

    return False


# Example usage
print(contains_duplicate([1, 2, 3, 1]))  # True
print(contains_duplicate([1, 2, 3, 4]))  # False`,
      },
    ],
  },
  {
    id: 5,
    slug: "maximum-subarray",
    title: "Maximum Subarray",
    difficulty: "basic",
    category: "arrays",
    tags: ["Array", "Dynamic Programming"],
    description:
      "Given an integer array `nums`, find the **subarray** with the largest sum, and return its sum.\n\nA **subarray** is a contiguous non-empty sequence of elements within an array.",
    constraints: [
      "1 ≤ nums.length ≤ 10⁵",
      "-10⁴ ≤ nums[i] ≤ 10⁴",
    ],
    examples: [
      {
        input: "nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]",
        output: "6",
        explanation: "The subarray [4, -1, 2, 1] has the largest sum = 6.",
      },
      {
        input: "nums = [1]",
        output: "1",
      },
      {
        input: "nums = [5, 4, -1, 7, 8]",
        output: "23",
        explanation: "The entire array is the subarray.",
      },
    ],
    solutions: [
      {
        language: "javascript",
        code: `/**
 * @param {number[]} nums
 * @return {number}
 */
function maxSubArray(nums) {
  let current = nums[0];
  let maxSum = nums[0];

  for (let i = 1; i < nums.length; i++) {
    // Either extend the current subarray or start fresh
    current = Math.max(nums[i], current + nums[i]);
    maxSum = Math.max(maxSum, current);
  }

  return maxSum;
}

// Example usage
console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6
console.log(maxSubArray([5, 4, -1, 7, 8]));                 // 23`,
      },
      {
        language: "typescript",
        code: `function maxSubArray(nums: number[]): number {
  let current = nums[0];
  let maxSum = nums[0];

  for (let i = 1; i < nums.length; i++) {
    current = Math.max(nums[i], current + nums[i]);
    maxSum = Math.max(maxSum, current);
  }

  return maxSum;
}

// Example usage
console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6
console.log(maxSubArray([5, 4, -1, 7, 8]));                 // 23`,
      },
      {
        language: "php",
        code: `<?php

function maxSubArray(array $nums): int {
    $current = $nums[0];
    $maxSum = $nums[0];

    for ($i = 1; $i < count($nums); $i++) {
        $current = max($nums[$i], $current + $nums[$i]);
        $maxSum = max($maxSum, $current);
    }

    return $maxSum;
}

// Example usage
echo maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]); // 6
echo maxSubArray([5, 4, -1, 7, 8]);                  // 23`,
      },
      {
        language: "java",
        code: `class Solution {
    public int maxSubArray(int[] nums) {
        int current = nums[0];
        int maxSum = nums[0];

        for (int i = 1; i < nums.length; i++) {
            current = Math.max(nums[i], current + nums[i]);
            maxSum = Math.max(maxSum, current);
        }

        return maxSum;
    }

    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(sol.maxSubArray(new int[]{-2, 1, -3, 4, -1, 2, 1, -5, 4})); // 6
        System.out.println(sol.maxSubArray(new int[]{5, 4, -1, 7, 8}));                 // 23
    }
}`,
      },
      {
        language: "python",
        code: `def max_sub_array(nums: list[int]) -> int:
    current = nums[0]
    max_sum = nums[0]

    for num in nums[1:]:
        current = max(num, current + num)
        max_sum = max(max_sum, current)

    return max_sum


# Example usage
print(max_sub_array([-2, 1, -3, 4, -1, 2, 1, -5, 4]))  # 6
print(max_sub_array([5, 4, -1, 7, 8]))                   # 23`,
      },
    ],
  },
  // ─── Arrays continued ──────────────────────────────────────────────────────
  {
    id: 6,
    slug: "product-of-array-except-self",
    title: "Product of Array Except Self",
    difficulty: "basic",
    category: "arrays",
    tags: ["Array", "Prefix Sum"],
    description:
      "Given an integer array `nums`, return an array `answer` such that `answer[i]` equals the product of all elements of `nums` except `nums[i]`.\n\nYou must write an **O(n)** algorithm **without** using the division operation.",
    constraints: [
      "2 ≤ nums.length ≤ 10⁵",
      "-30 ≤ nums[i] ≤ 30",
      "The product of any prefix or suffix is guaranteed to fit in a 32-bit integer.",
    ],
    examples: [
      {
        input: "nums = [1, 2, 3, 4]",
        output: "[24, 12, 8, 6]",
        explanation: "answer[0] = 2×3×4 = 24, answer[1] = 1×3×4 = 12, and so on.",
      },
      {
        input: "nums = [-1, 1, 0, -3, 3]",
        output: "[0, 0, 9, 0, 0]",
      },
    ],
    solutions: [
      {
        language: "javascript",
        code: `function productExceptSelf(nums) {
  const n = nums.length;
  const result = new Array(n).fill(1);

  // Left pass: result[i] holds product of all elements left of i
  let left = 1;
  for (let i = 0; i < n; i++) {
    result[i] = left;
    left *= nums[i];
  }

  // Right pass: multiply by product of all elements right of i
  let right = 1;
  for (let i = n - 1; i >= 0; i--) {
    result[i] *= right;
    right *= nums[i];
  }

  return result;
}

console.log(productExceptSelf([1, 2, 3, 4])); // [24, 12, 8, 6]`,
      },
      {
        language: "typescript",
        code: `function productExceptSelf(nums: number[]): number[] {
  const n = nums.length;
  const result = new Array<number>(n).fill(1);

  let left = 1;
  for (let i = 0; i < n; i++) {
    result[i] = left;
    left *= nums[i];
  }

  let right = 1;
  for (let i = n - 1; i >= 0; i--) {
    result[i] *= right;
    right *= nums[i];
  }

  return result;
}`,
      },
      {
        language: "php",
        code: `<?php

function productExceptSelf(array $nums): array {
    $n = count($nums);
    $result = array_fill(0, $n, 1);

    $left = 1;
    for ($i = 0; $i < $n; $i++) {
        $result[$i] = $left;
        $left *= $nums[$i];
    }

    $right = 1;
    for ($i = $n - 1; $i >= 0; $i--) {
        $result[$i] *= $right;
        $right *= $nums[$i];
    }

    return $result;
}

print_r(productExceptSelf([1, 2, 3, 4])); // [24, 12, 8, 6]`,
      },
      {
        language: "java",
        code: `import java.util.Arrays;

class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] result = new int[n];
        Arrays.fill(result, 1);

        int left = 1;
        for (int i = 0; i < n; i++) {
            result[i] = left;
            left *= nums[i];
        }

        int right = 1;
        for (int i = n - 1; i >= 0; i--) {
            result[i] *= right;
            right *= nums[i];
        }

        return result;
    }
}`,
      },
      {
        language: "python",
        code: `def product_except_self(nums: list[int]) -> list[int]:
    n = len(nums)
    result = [1] * n

    left = 1
    for i in range(n):
        result[i] = left
        left *= nums[i]

    right = 1
    for i in range(n - 1, -1, -1):
        result[i] *= right
        right *= nums[i]

    return result


print(product_except_self([1, 2, 3, 4]))  # [24, 12, 8, 6]`,
      },
    ],
  },
  {
    id: 7,
    slug: "move-zeroes",
    title: "Move Zeroes",
    difficulty: "basic",
    category: "arrays",
    tags: ["Array", "Two Pointers"],
    description:
      "Given an integer array `nums`, move all `0`s to the **end** of it while maintaining the **relative order** of the non-zero elements.\n\nNote that you must do this **in-place** without making a copy of the array.",
    constraints: [
      "1 ≤ nums.length ≤ 10⁴",
      "-2³¹ ≤ nums[i] ≤ 2³¹ − 1",
    ],
    examples: [
      {
        input: "nums = [0, 1, 0, 3, 12]",
        output: "[1, 3, 12, 0, 0]",
        explanation: "Non-zero values keep their order; zeroes shift to the end.",
      },
      {
        input: "nums = [0]",
        output: "[0]",
      },
    ],
    solutions: [
      {
        language: "javascript",
        code: `function moveZeroes(nums) {
  let insertPos = 0;

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      nums[insertPos++] = nums[i];
    }
  }

  while (insertPos < nums.length) {
    nums[insertPos++] = 0;
  }
}

const arr = [0, 1, 0, 3, 12];
moveZeroes(arr);
console.log(arr); // [1, 3, 12, 0, 0]`,
      },
      {
        language: "typescript",
        code: `function moveZeroes(nums: number[]): void {
  let insertPos = 0;

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      nums[insertPos++] = nums[i];
    }
  }

  while (insertPos < nums.length) {
    nums[insertPos++] = 0;
  }
}`,
      },
      {
        language: "php",
        code: `<?php

function moveZeroes(array &$nums): void {
    $insertPos = 0;

    foreach ($nums as $num) {
        if ($num !== 0) {
            $nums[$insertPos++] = $num;
        }
    }

    while ($insertPos < count($nums)) {
        $nums[$insertPos++] = 0;
    }
}

$arr = [0, 1, 0, 3, 12];
moveZeroes($arr);
print_r($arr); // [1, 3, 12, 0, 0]`,
      },
      {
        language: "java",
        code: `import java.util.Arrays;

class Solution {
    public void moveZeroes(int[] nums) {
        int insertPos = 0;

        for (int num : nums) {
            if (num != 0) {
                nums[insertPos++] = num;
            }
        }

        while (insertPos < nums.length) {
            nums[insertPos++] = 0;
        }
    }

    public static void main(String[] args) {
        int[] arr = {0, 1, 0, 3, 12};
        new Solution().moveZeroes(arr);
        System.out.println(Arrays.toString(arr)); // [1, 3, 12, 0, 0]
    }
}`,
      },
      {
        language: "python",
        code: `def move_zeroes(nums: list[int]) -> None:
    insert_pos = 0

    for num in nums:
        if num != 0:
            nums[insert_pos] = num
            insert_pos += 1

    while insert_pos < len(nums):
        nums[insert_pos] = 0
        insert_pos += 1


arr = [0, 1, 0, 3, 12]
move_zeroes(arr)
print(arr)  # [1, 3, 12, 0, 0]`,
      },
    ],
  },
  {
    id: 8,
    slug: "remove-duplicates-from-sorted-array",
    title: "Remove Duplicates from Sorted Array",
    difficulty: "basic",
    category: "arrays",
    tags: ["Array", "Two Pointers"],
    description:
      "Given an integer array `nums` sorted in **non-decreasing order**, remove the duplicates **in-place** so that each unique element appears only once.\n\nReturn `k` — the number of unique elements. The first `k` elements of `nums` must contain the unique values in order. The remaining elements do not matter.",
    constraints: [
      "1 ≤ nums.length ≤ 3 × 10⁴",
      "-100 ≤ nums[i] ≤ 100",
      "nums is sorted in non-decreasing order.",
    ],
    examples: [
      {
        input: "nums = [1, 1, 2]",
        output: "2, nums = [1, 2, _]",
        explanation: "Two unique elements. First two positions hold 1 and 2.",
      },
      {
        input: "nums = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]",
        output: "5, nums = [0, 1, 2, 3, 4, _, _, _, _, _]",
      },
    ],
    solutions: [
      {
        language: "javascript",
        code: `function removeDuplicates(nums) {
  let k = 1;

  for (let i = 1; i < nums.length; i++) {
    if (nums[i] !== nums[i - 1]) {
      nums[k++] = nums[i];
    }
  }

  return k;
}

console.log(removeDuplicates([0, 0, 1, 1, 1, 2, 2, 3, 3, 4])); // 5`,
      },
      {
        language: "typescript",
        code: `function removeDuplicates(nums: number[]): number {
  let k = 1;

  for (let i = 1; i < nums.length; i++) {
    if (nums[i] !== nums[i - 1]) {
      nums[k++] = nums[i];
    }
  }

  return k;
}`,
      },
      {
        language: "php",
        code: `<?php

function removeDuplicates(array &$nums): int {
    $k = 1;

    for ($i = 1; $i < count($nums); $i++) {
        if ($nums[$i] !== $nums[$i - 1]) {
            $nums[$k++] = $nums[$i];
        }
    }

    return $k;
}

$nums = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4];
echo removeDuplicates($nums); // 5`,
      },
      {
        language: "java",
        code: `class Solution {
    public int removeDuplicates(int[] nums) {
        int k = 1;

        for (int i = 1; i < nums.length; i++) {
            if (nums[i] != nums[i - 1]) {
                nums[k++] = nums[i];
            }
        }

        return k;
    }

    public static void main(String[] args) {
        int[] nums = {0, 0, 1, 1, 1, 2, 2, 3, 3, 4};
        System.out.println(new Solution().removeDuplicates(nums)); // 5
    }
}`,
      },
      {
        language: "python",
        code: `def remove_duplicates(nums: list[int]) -> int:
    k = 1

    for i in range(1, len(nums)):
        if nums[i] != nums[i - 1]:
            nums[k] = nums[i]
            k += 1

    return k


print(remove_duplicates([0, 0, 1, 1, 1, 2, 2, 3, 3, 4]))  # 5`,
      },
    ],
  },
  {
    id: 9,
    slug: "container-with-most-water",
    title: "Container With Most Water",
    difficulty: "basic",
    category: "arrays",
    tags: ["Array", "Two Pointers", "Greedy"],
    description:
      "You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i`-th line are `(i, 0)` and `(i, height[i])`.\n\nFind two lines that together with the x-axis form a container that holds the **most water**. Return the **maximum amount of water** a container can store.\n\nYou may not slant the container.",
    constraints: [
      "n == height.length",
      "2 ≤ n ≤ 10⁵",
      "0 ≤ height[i] ≤ 10⁴",
    ],
    examples: [
      {
        input: "height = [1, 8, 6, 2, 5, 4, 8, 3, 7]",
        output: "49",
        explanation: "Lines at index 1 (height 8) and index 8 (height 7). Width = 7, min height = 7. Area = 7 × 7 = 49.",
      },
      {
        input: "height = [1, 1]",
        output: "1",
      },
    ],
    solutions: [
      {
        language: "javascript",
        code: `function maxArea(height) {
  let left = 0;
  let right = height.length - 1;
  let max = 0;

  while (left < right) {
    const area = (right - left) * Math.min(height[left], height[right]);
    max = Math.max(max, area);

    // Move the shorter line inward — it's the only hope for more area
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }

  return max;
}

console.log(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7])); // 49`,
      },
      {
        language: "typescript",
        code: `function maxArea(height: number[]): number {
  let left = 0;
  let right = height.length - 1;
  let max = 0;

  while (left < right) {
    const area = (right - left) * Math.min(height[left], height[right]);
    max = Math.max(max, area);

    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }

  return max;
}`,
      },
      {
        language: "php",
        code: `<?php

function maxArea(array $height): int {
    $left = 0;
    $right = count($height) - 1;
    $max = 0;

    while ($left < $right) {
        $area = ($right - $left) * min($height[$left], $height[$right]);
        $max = max($max, $area);

        if ($height[$left] < $height[$right]) {
            $left++;
        } else {
            $right--;
        }
    }

    return $max;
}

echo maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]); // 49`,
      },
      {
        language: "java",
        code: `class Solution {
    public int maxArea(int[] height) {
        int left = 0;
        int right = height.length - 1;
        int max = 0;

        while (left < right) {
            int area = (right - left) * Math.min(height[left], height[right]);
            max = Math.max(max, area);

            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }

        return max;
    }

    public static void main(String[] args) {
        System.out.println(new Solution().maxArea(new int[]{1, 8, 6, 2, 5, 4, 8, 3, 7})); // 49
    }
}`,
      },
      {
        language: "python",
        code: `def max_area(height: list[int]) -> int:
    left, right = 0, len(height) - 1
    max_water = 0

    while left < right:
        area = (right - left) * min(height[left], height[right])
        max_water = max(max_water, area)

        if height[left] < height[right]:
            left += 1
        else:
            right -= 1

    return max_water


print(max_area([1, 8, 6, 2, 5, 4, 8, 3, 7]))  # 49`,
      },
    ],
  },
  {
    id: 10,
    slug: "three-sum",
    title: "3Sum",
    difficulty: "basic",
    category: "arrays",
    tags: ["Array", "Two Pointers", "Sorting"],
    description:
      "Given an integer array `nums`, return all the **triplets** `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.\n\nThe solution set must **not contain duplicate triplets**.",
    constraints: [
      "3 ≤ nums.length ≤ 3000",
      "-10⁵ ≤ nums[i] ≤ 10⁵",
    ],
    examples: [
      {
        input: "nums = [-1, 0, 1, 2, -1, -4]",
        output: "[[-1, -1, 2], [-1, 0, 1]]",
        explanation: "nums[0] + nums[1] + nums[2] = -1 + 0 + 1 = 0. nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0. nums[0] + nums[3] + nums[4] = -1 + 2 + (-1) = 0.",
      },
      {
        input: "nums = [0, 1, 1]",
        output: "[]",
      },
      {
        input: "nums = [0, 0, 0]",
        output: "[[0, 0, 0]]",
      },
    ],
    solutions: [
      {
        language: "javascript",
        code: `function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];

  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue; // skip outer duplicates

    let left = i + 1;
    let right = nums.length - 1;

    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];

      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++;
        right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }

  return result;
}

console.log(threeSum([-1, 0, 1, 2, -1, -4])); // [[-1,-1,2],[-1,0,1]]`,
      },
      {
        language: "typescript",
        code: `function threeSum(nums: number[]): number[][] {
  nums.sort((a, b) => a - b);
  const result: number[][] = [];

  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    let left = i + 1;
    let right = nums.length - 1;

    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];

      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++;
        right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }

  return result;
}`,
      },
      {
        language: "php",
        code: `<?php

function threeSum(array $nums): array {
    sort($nums);
    $result = [];
    $n = count($nums);

    for ($i = 0; $i < $n - 2; $i++) {
        if ($i > 0 && $nums[$i] === $nums[$i - 1]) continue;

        $left = $i + 1;
        $right = $n - 1;

        while ($left < $right) {
            $sum = $nums[$i] + $nums[$left] + $nums[$right];

            if ($sum === 0) {
                $result[] = [$nums[$i], $nums[$left], $nums[$right]];
                while ($left < $right && $nums[$left] === $nums[$left + 1]) $left++;
                while ($left < $right && $nums[$right] === $nums[$right - 1]) $right--;
                $left++;
                $right--;
            } elseif ($sum < 0) {
                $left++;
            } else {
                $right--;
            }
        }
    }

    return $result;
}

print_r(threeSum([-1, 0, 1, 2, -1, -4]));`,
      },
      {
        language: "java",
        code: `import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> result = new ArrayList<>();

        for (int i = 0; i < nums.length - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;

            int left = i + 1;
            int right = nums.length - 1;

            while (left < right) {
                int sum = nums[i] + nums[left] + nums[right];

                if (sum == 0) {
                    result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                    while (left < right && nums[left] == nums[left + 1]) left++;
                    while (left < right && nums[right] == nums[right - 1]) right--;
                    left++;
                    right--;
                } else if (sum < 0) {
                    left++;
                } else {
                    right--;
                }
            }
        }

        return result;
    }
}`,
      },
      {
        language: "python",
        code: `def three_sum(nums: list[int]) -> list[list[int]]:
    nums.sort()
    result = []

    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue

        left, right = i + 1, len(nums) - 1

        while left < right:
            s = nums[i] + nums[left] + nums[right]

            if s == 0:
                result.append([nums[i], nums[left], nums[right]])
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                left += 1
                right -= 1
            elif s < 0:
                left += 1
            else:
                right -= 1

    return result


print(three_sum([-1, 0, 1, 2, -1, -4]))  # [[-1, -1, 2], [-1, 0, 1]]`,
      },
    ],
  },
  {
    id: 11,
    slug: "sort-colors",
    title: "Sort Colors",
    difficulty: "basic",
    category: "arrays",
    tags: ["Array", "Two Pointers", "Sorting"],
    description:
      "Given an array `nums` with `n` objects colored red, white, or blue — represented as `0`, `1`, and `2` — sort them **in-place** so that objects of the same color are adjacent, in the order red → white → blue.\n\nYou must solve this without using the library's sort function and in **one pass** using **constant extra space**.",
    constraints: [
      "n == nums.length",
      "1 ≤ n ≤ 300",
      "nums[i] is 0, 1, or 2",
    ],
    examples: [
      {
        input: "nums = [2, 0, 2, 1, 1, 0]",
        output: "[0, 0, 1, 1, 2, 2]",
      },
      {
        input: "nums = [2, 0, 1]",
        output: "[0, 1, 2]",
      },
    ],
    solutions: [
      {
        language: "javascript",
        code: `// Dutch National Flag algorithm
function sortColors(nums) {
  let low = 0;
  let mid = 0;
  let high = nums.length - 1;

  while (mid <= high) {
    if (nums[mid] === 0) {
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low++;
      mid++;
    } else if (nums[mid] === 1) {
      mid++;
    } else {
      [nums[mid], nums[high]] = [nums[high], nums[mid]];
      high--;
    }
  }
}

const arr = [2, 0, 2, 1, 1, 0];
sortColors(arr);
console.log(arr); // [0, 0, 1, 1, 2, 2]`,
      },
      {
        language: "typescript",
        code: `function sortColors(nums: number[]): void {
  let low = 0;
  let mid = 0;
  let high = nums.length - 1;

  while (mid <= high) {
    if (nums[mid] === 0) {
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low++;
      mid++;
    } else if (nums[mid] === 1) {
      mid++;
    } else {
      [nums[mid], nums[high]] = [nums[high], nums[mid]];
      high--;
    }
  }
}`,
      },
      {
        language: "php",
        code: `<?php

function sortColors(array &$nums): void {
    $low = 0;
    $mid = 0;
    $high = count($nums) - 1;

    while ($mid <= $high) {
        if ($nums[$mid] === 0) {
            [$nums[$low], $nums[$mid]] = [$nums[$mid], $nums[$low]];
            $low++;
            $mid++;
        } elseif ($nums[$mid] === 1) {
            $mid++;
        } else {
            [$nums[$mid], $nums[$high]] = [$nums[$high], $nums[$mid]];
            $high--;
        }
    }
}

$arr = [2, 0, 2, 1, 1, 0];
sortColors($arr);
print_r($arr); // [0, 0, 1, 1, 2, 2]`,
      },
      {
        language: "java",
        code: `import java.util.Arrays;

class Solution {
    public void sortColors(int[] nums) {
        int low = 0, mid = 0, high = nums.length - 1;

        while (mid <= high) {
            if (nums[mid] == 0) {
                int tmp = nums[low]; nums[low] = nums[mid]; nums[mid] = tmp;
                low++;
                mid++;
            } else if (nums[mid] == 1) {
                mid++;
            } else {
                int tmp = nums[mid]; nums[mid] = nums[high]; nums[high] = tmp;
                high--;
            }
        }
    }

    public static void main(String[] args) {
        int[] arr = {2, 0, 2, 1, 1, 0};
        new Solution().sortColors(arr);
        System.out.println(Arrays.toString(arr)); // [0, 0, 1, 1, 2, 2]
    }
}`,
      },
      {
        language: "python",
        code: `def sort_colors(nums: list[int]) -> None:
    low, mid, high = 0, 0, len(nums) - 1

    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1


arr = [2, 0, 2, 1, 1, 0]
sort_colors(arr)
print(arr)  # [0, 0, 1, 1, 2, 2]`,
      },
    ],
  },
  {
    id: 12,
    slug: "rotate-array",
    title: "Rotate Array",
    difficulty: "basic",
    category: "arrays",
    tags: ["Array", "Math", "Two Pointers"],
    description:
      "Given an integer array `nums`, rotate the array to the **right** by `k` steps, where `k` is non-negative.\n\nYou must solve this **in-place** with `O(1)` extra space.",
    constraints: [
      "1 ≤ nums.length ≤ 10⁵",
      "-2³¹ ≤ nums[i] ≤ 2³¹ − 1",
      "0 ≤ k ≤ 10⁵",
    ],
    examples: [
      {
        input: "nums = [1, 2, 3, 4, 5, 6, 7], k = 3",
        output: "[5, 6, 7, 1, 2, 3, 4]",
        explanation: "Rotate right 3: [7,1,2,3,4,5,6] → [6,7,1,2,3,4,5] → [5,6,7,1,2,3,4].",
      },
      {
        input: "nums = [-1, -100, 3, 99], k = 2",
        output: "[3, 99, -1, -100]",
      },
    ],
    solutions: [
      {
        language: "javascript",
        code: `function rotate(nums, k) {
  k = k % nums.length;

  function reverse(start, end) {
    while (start < end) {
      [nums[start], nums[end]] = [nums[end], nums[start]];
      start++;
      end--;
    }
  }

  reverse(0, nums.length - 1); // reverse whole array
  reverse(0, k - 1);           // reverse first k
  reverse(k, nums.length - 1); // reverse rest
}

const arr = [1, 2, 3, 4, 5, 6, 7];
rotate(arr, 3);
console.log(arr); // [5, 6, 7, 1, 2, 3, 4]`,
      },
      {
        language: "typescript",
        code: `function rotate(nums: number[], k: number): void {
  k = k % nums.length;

  function reverse(start: number, end: number): void {
    while (start < end) {
      [nums[start], nums[end]] = [nums[end], nums[start]];
      start++;
      end--;
    }
  }

  reverse(0, nums.length - 1);
  reverse(0, k - 1);
  reverse(k, nums.length - 1);
}`,
      },
      {
        language: "php",
        code: `<?php

function rotate(array &$nums, int $k): void {
    $n = count($nums);
    $k = $k % $n;

    function reverseArr(array &$arr, int $start, int $end): void {
        while ($start < $end) {
            [$arr[$start], $arr[$end]] = [$arr[$end], $arr[$start]];
            $start++;
            $end--;
        }
    }

    reverseArr($nums, 0, $n - 1);
    reverseArr($nums, 0, $k - 1);
    reverseArr($nums, $k, $n - 1);
}

$arr = [1, 2, 3, 4, 5, 6, 7];
rotate($arr, 3);
print_r($arr); // [5, 6, 7, 1, 2, 3, 4]`,
      },
      {
        language: "java",
        code: `import java.util.Arrays;

class Solution {
    public void rotate(int[] nums, int k) {
        k = k % nums.length;
        reverse(nums, 0, nums.length - 1);
        reverse(nums, 0, k - 1);
        reverse(nums, k, nums.length - 1);
    }

    private void reverse(int[] nums, int start, int end) {
        while (start < end) {
            int tmp = nums[start];
            nums[start++] = nums[end];
            nums[end--] = tmp;
        }
    }

    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5, 6, 7};
        new Solution().rotate(arr, 3);
        System.out.println(Arrays.toString(arr)); // [5, 6, 7, 1, 2, 3, 4]
    }
}`,
      },
      {
        language: "python",
        code: `def rotate(nums: list[int], k: int) -> None:
    n = len(nums)
    k %= n

    def reverse(start: int, end: int) -> None:
        while start < end:
            nums[start], nums[end] = nums[end], nums[start]
            start += 1
            end -= 1

    reverse(0, n - 1)
    reverse(0, k - 1)
    reverse(k, n - 1)


arr = [1, 2, 3, 4, 5, 6, 7]
rotate(arr, 3)
print(arr)  # [5, 6, 7, 1, 2, 3, 4]`,
      },
    ],
  },
  {
    id: 13,
    slug: "majority-element",
    title: "Majority Element",
    difficulty: "basic",
    category: "arrays",
    tags: ["Array", "Divide and Conquer", "Sorting"],
    description:
      "Given an array `nums` of size `n`, return the **majority element**.\n\nThe majority element is the element that appears **more than ⌊n / 2⌋ times**. You may assume the majority element always exists.",
    constraints: [
      "n == nums.length",
      "1 ≤ n ≤ 5 × 10⁴",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
      "The majority element always exists.",
    ],
    examples: [
      {
        input: "nums = [3, 2, 3]",
        output: "3",
      },
      {
        input: "nums = [2, 2, 1, 1, 1, 2, 2]",
        output: "2",
      },
    ],
    solutions: [
      {
        language: "javascript",
        code: `// Boyer-Moore Voting — O(n) time, O(1) space
function majorityElement(nums) {
  let candidate = nums[0];
  let count = 1;

  for (let i = 1; i < nums.length; i++) {
    if (count === 0) {
      candidate = nums[i];
      count = 1;
    } else if (nums[i] === candidate) {
      count++;
    } else {
      count--;
    }
  }

  return candidate;
}

console.log(majorityElement([2, 2, 1, 1, 1, 2, 2])); // 2`,
      },
      {
        language: "typescript",
        code: `function majorityElement(nums: number[]): number {
  let candidate = nums[0];
  let count = 1;

  for (let i = 1; i < nums.length; i++) {
    if (count === 0) {
      candidate = nums[i];
      count = 1;
    } else if (nums[i] === candidate) {
      count++;
    } else {
      count--;
    }
  }

  return candidate;
}`,
      },
      {
        language: "php",
        code: `<?php

function majorityElement(array $nums): int {
    $candidate = $nums[0];
    $count = 1;

    for ($i = 1; $i < count($nums); $i++) {
        if ($count === 0) {
            $candidate = $nums[$i];
            $count = 1;
        } elseif ($nums[$i] === $candidate) {
            $count++;
        } else {
            $count--;
        }
    }

    return $candidate;
}

echo majorityElement([2, 2, 1, 1, 1, 2, 2]); // 2`,
      },
      {
        language: "java",
        code: `class Solution {
    public int majorityElement(int[] nums) {
        int candidate = nums[0];
        int count = 1;

        for (int i = 1; i < nums.length; i++) {
            if (count == 0) {
                candidate = nums[i];
                count = 1;
            } else if (nums[i] == candidate) {
                count++;
            } else {
                count--;
            }
        }

        return candidate;
    }

    public static void main(String[] args) {
        System.out.println(new Solution().majorityElement(new int[]{2, 2, 1, 1, 1, 2, 2})); // 2
    }
}`,
      },
      {
        language: "python",
        code: `def majority_element(nums: list[int]) -> int:
    candidate = nums[0]
    count = 1

    for num in nums[1:]:
        if count == 0:
            candidate = num
            count = 1
        elif num == candidate:
            count += 1
        else:
            count -= 1

    return candidate


print(majority_element([2, 2, 1, 1, 1, 2, 2]))  # 2`,
      },
    ],
  },
  {
    id: 14,
    slug: "missing-number",
    title: "Missing Number",
    difficulty: "basic",
    category: "arrays",
    tags: ["Array", "Math", "Bit Manipulation"],
    description:
      "Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the **only number** in the range that is missing from the array.",
    constraints: [
      "n == nums.length",
      "1 ≤ n ≤ 10⁴",
      "0 ≤ nums[i] ≤ n",
      "All numbers in nums are unique.",
    ],
    examples: [
      {
        input: "nums = [3, 0, 1]",
        output: "2",
        explanation: "n = 3. The range [0,3] has 4 numbers; 2 is the missing one.",
      },
      {
        input: "nums = [0, 1]",
        output: "2",
      },
      {
        input: "nums = [9, 6, 4, 2, 3, 5, 7, 0, 1]",
        output: "8",
      },
    ],
    solutions: [
      {
        language: "javascript",
        code: `// Gauss formula: expected sum − actual sum
function missingNumber(nums) {
  const n = nums.length;
  const expected = (n * (n + 1)) / 2;
  const actual = nums.reduce((sum, x) => sum + x, 0);
  return expected - actual;
}

console.log(missingNumber([3, 0, 1]));                    // 2
console.log(missingNumber([9, 6, 4, 2, 3, 5, 7, 0, 1])); // 8`,
      },
      {
        language: "typescript",
        code: `function missingNumber(nums: number[]): number {
  const n = nums.length;
  const expected = (n * (n + 1)) / 2;
  const actual = nums.reduce((sum, x) => sum + x, 0);
  return expected - actual;
}`,
      },
      {
        language: "php",
        code: `<?php

function missingNumber(array $nums): int {
    $n = count($nums);
    $expected = $n * ($n + 1) / 2;
    $actual = array_sum($nums);
    return $expected - $actual;
}

echo missingNumber([3, 0, 1]); // 2`,
      },
      {
        language: "java",
        code: `class Solution {
    public int missingNumber(int[] nums) {
        int n = nums.length;
        int expected = n * (n + 1) / 2;
        int actual = 0;
        for (int x : nums) actual += x;
        return expected - actual;
    }

    public static void main(String[] args) {
        System.out.println(new Solution().missingNumber(new int[]{3, 0, 1})); // 2
    }
}`,
      },
      {
        language: "python",
        code: `def missing_number(nums: list[int]) -> int:
    n = len(nums)
    return n * (n + 1) // 2 - sum(nums)


print(missing_number([3, 0, 1]))                    # 2
print(missing_number([9, 6, 4, 2, 3, 5, 7, 0, 1])) # 8`,
      },
    ],
  },
  {
    id: 15,
    slug: "maximum-product-subarray",
    title: "Maximum Product Subarray",
    difficulty: "basic",
    category: "arrays",
    tags: ["Array", "Dynamic Programming"],
    description:
      "Given an integer array `nums`, find a **subarray** that has the largest product, and return the product.\n\nThe test cases are generated so that the answer will fit in a **32-bit** integer.",
    constraints: [
      "1 ≤ nums.length ≤ 2 × 10⁴",
      "-10 ≤ nums[i] ≤ 10",
      "The product of any subarray fits in a 32-bit integer.",
    ],
    examples: [
      {
        input: "nums = [2, 3, -2, 4]",
        output: "6",
        explanation: "Subarray [2, 3] has the largest product = 6.",
      },
      {
        input: "nums = [-2, 0, -1]",
        output: "0",
        explanation: "The result cannot be 2 because [-2, -1] is not a subarray.",
      },
    ],
    solutions: [
      {
        language: "javascript",
        code: `function maxProduct(nums) {
  let maxProd = nums[0];
  let minProd = nums[0];
  let result = nums[0];

  for (let i = 1; i < nums.length; i++) {
    // A negative number flips max↔min
    if (nums[i] < 0) {
      [maxProd, minProd] = [minProd, maxProd];
    }

    maxProd = Math.max(nums[i], maxProd * nums[i]);
    minProd = Math.min(nums[i], minProd * nums[i]);
    result = Math.max(result, maxProd);
  }

  return result;
}

console.log(maxProduct([2, 3, -2, 4])); // 6
console.log(maxProduct([-2, 0, -1]));   // 0`,
      },
      {
        language: "typescript",
        code: `function maxProduct(nums: number[]): number {
  let maxProd = nums[0];
  let minProd = nums[0];
  let result = nums[0];

  for (let i = 1; i < nums.length; i++) {
    if (nums[i] < 0) {
      [maxProd, minProd] = [minProd, maxProd];
    }

    maxProd = Math.max(nums[i], maxProd * nums[i]);
    minProd = Math.min(nums[i], minProd * nums[i]);
    result = Math.max(result, maxProd);
  }

  return result;
}`,
      },
      {
        language: "php",
        code: `<?php

function maxProduct(array $nums): int {
    $maxProd = $nums[0];
    $minProd = $nums[0];
    $result = $nums[0];

    for ($i = 1; $i < count($nums); $i++) {
        if ($nums[$i] < 0) {
            [$maxProd, $minProd] = [$minProd, $maxProd];
        }

        $maxProd = max($nums[$i], $maxProd * $nums[$i]);
        $minProd = min($nums[$i], $minProd * $nums[$i]);
        $result = max($result, $maxProd);
    }

    return $result;
}

echo maxProduct([2, 3, -2, 4]); // 6`,
      },
      {
        language: "java",
        code: `class Solution {
    public int maxProduct(int[] nums) {
        int maxProd = nums[0];
        int minProd = nums[0];
        int result = nums[0];

        for (int i = 1; i < nums.length; i++) {
            if (nums[i] < 0) {
                int tmp = maxProd;
                maxProd = minProd;
                minProd = tmp;
            }

            maxProd = Math.max(nums[i], maxProd * nums[i]);
            minProd = Math.min(nums[i], minProd * nums[i]);
            result = Math.max(result, maxProd);
        }

        return result;
    }

    public static void main(String[] args) {
        System.out.println(new Solution().maxProduct(new int[]{2, 3, -2, 4})); // 6
    }
}`,
      },
      {
        language: "python",
        code: `def max_product(nums: list[int]) -> int:
    max_prod = min_prod = result = nums[0]

    for num in nums[1:]:
        if num < 0:
            max_prod, min_prod = min_prod, max_prod

        max_prod = max(num, max_prod * num)
        min_prod = min(num, min_prod * num)
        result = max(result, max_prod)

    return result


print(max_product([2, 3, -2, 4]))  # 6
print(max_product([-2, 0, -1]))    # 0`,
      },
    ],
  },
  {
    id: 16,
    slug: "find-minimum-in-rotated-sorted-array",
    title: "Find Minimum in Rotated Sorted Array",
    difficulty: "basic",
    category: "arrays",
    tags: ["Array", "Binary Search"],
    description:
      "Suppose an array of length `n` sorted in ascending order is **rotated** between `1` and `n` times. Given the sorted rotated array `nums` of **unique** elements, return the **minimum element**.\n\nYou must write an algorithm that runs in `O(log n)` time.",
    constraints: [
      "n == nums.length",
      "1 ≤ n ≤ 5000",
      "-5000 ≤ nums[i] ≤ 5000",
      "All integers in nums are unique.",
      "nums is sorted and rotated between 1 and n times.",
    ],
    examples: [
      {
        input: "nums = [3, 4, 5, 1, 2]",
        output: "1",
        explanation: "Original: [1,2,3,4,5]. Rotated 3 times.",
      },
      {
        input: "nums = [4, 5, 6, 7, 0, 1, 2]",
        output: "0",
        explanation: "Original: [0,1,2,4,5,6,7]. Rotated 4 times.",
      },
      {
        input: "nums = [11, 13, 15, 17]",
        output: "11",
        explanation: "No rotation — minimum is the first element.",
      },
    ],
    solutions: [
      {
        language: "javascript",
        code: `function findMin(nums) {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const mid = (left + right) >>> 1;

    if (nums[mid] > nums[right]) {
      // Minimum is in the right half
      left = mid + 1;
    } else {
      // Minimum is at mid or in the left half
      right = mid;
    }
  }

  return nums[left];
}

console.log(findMin([3, 4, 5, 1, 2]));       // 1
console.log(findMin([4, 5, 6, 7, 0, 1, 2])); // 0`,
      },
      {
        language: "typescript",
        code: `function findMin(nums: number[]): number {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const mid = (left + right) >>> 1;

    if (nums[mid] > nums[right]) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }

  return nums[left];
}`,
      },
      {
        language: "php",
        code: `<?php

function findMin(array $nums): int {
    $left = 0;
    $right = count($nums) - 1;

    while ($left < $right) {
        $mid = intdiv($left + $right, 2);

        if ($nums[$mid] > $nums[$right]) {
            $left = $mid + 1;
        } else {
            $right = $mid;
        }
    }

    return $nums[$left];
}

echo findMin([3, 4, 5, 1, 2]); // 1`,
      },
      {
        language: "java",
        code: `class Solution {
    public int findMin(int[] nums) {
        int left = 0;
        int right = nums.length - 1;

        while (left < right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] > nums[right]) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }

        return nums[left];
    }

    public static void main(String[] args) {
        System.out.println(new Solution().findMin(new int[]{3, 4, 5, 1, 2})); // 1
    }
}`,
      },
      {
        language: "python",
        code: `def find_min(nums: list[int]) -> int:
    left, right = 0, len(nums) - 1

    while left < right:
        mid = (left + right) // 2

        if nums[mid] > nums[right]:
            left = mid + 1
        else:
            right = mid

    return nums[left]


print(find_min([3, 4, 5, 1, 2]))       # 1
print(find_min([4, 5, 6, 7, 0, 1, 2])) # 0`,
      },
    ],
  },
  {
    id: 17,
    slug: "merge-sorted-array",
    title: "Merge Sorted Array",
    difficulty: "basic",
    category: "arrays",
    tags: ["Array", "Two Pointers", "Sorting"],
    description:
      "You are given two integer arrays `nums1` and `nums2`, sorted in **non-decreasing order**, and two integers `m` and `n`, representing the number of elements in each array.\n\nMerge `nums2` into `nums1` as one sorted array **in-place**. `nums1` has length `m + n` — its last `n` elements are `0` and should be ignored.",
    constraints: [
      "nums1.length == m + n",
      "nums2.length == n",
      "0 ≤ m, n ≤ 200",
      "1 ≤ m + n ≤ 200",
      "-10⁹ ≤ nums1[i], nums2[j] ≤ 10⁹",
    ],
    examples: [
      {
        input: "nums1 = [1, 2, 3, 0, 0, 0], m = 3, nums2 = [2, 5, 6], n = 3",
        output: "[1, 2, 2, 3, 5, 6]",
      },
      {
        input: "nums1 = [1], m = 1, nums2 = [], n = 0",
        output: "[1]",
      },
    ],
    solutions: [
      {
        language: "javascript",
        code: `// Fill from the back to avoid overwriting elements
function merge(nums1, m, nums2, n) {
  let i = m - 1;
  let j = n - 1;
  let k = m + n - 1;

  while (j >= 0) {
    if (i >= 0 && nums1[i] > nums2[j]) {
      nums1[k--] = nums1[i--];
    } else {
      nums1[k--] = nums2[j--];
    }
  }
}

const arr = [1, 2, 3, 0, 0, 0];
merge(arr, 3, [2, 5, 6], 3);
console.log(arr); // [1, 2, 2, 3, 5, 6]`,
      },
      {
        language: "typescript",
        code: `function merge(nums1: number[], m: number, nums2: number[], n: number): void {
  let i = m - 1;
  let j = n - 1;
  let k = m + n - 1;

  while (j >= 0) {
    if (i >= 0 && nums1[i] > nums2[j]) {
      nums1[k--] = nums1[i--];
    } else {
      nums1[k--] = nums2[j--];
    }
  }
}`,
      },
      {
        language: "php",
        code: `<?php

function merge(array &$nums1, int $m, array $nums2, int $n): void {
    $i = $m - 1;
    $j = $n - 1;
    $k = $m + $n - 1;

    while ($j >= 0) {
        if ($i >= 0 && $nums1[$i] > $nums2[$j]) {
            $nums1[$k--] = $nums1[$i--];
        } else {
            $nums1[$k--] = $nums2[$j--];
        }
    }
}

$nums1 = [1, 2, 3, 0, 0, 0];
merge($nums1, 3, [2, 5, 6], 3);
print_r($nums1); // [1, 2, 2, 3, 5, 6]`,
      },
      {
        language: "java",
        code: `import java.util.Arrays;

class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        int i = m - 1;
        int j = n - 1;
        int k = m + n - 1;

        while (j >= 0) {
            if (i >= 0 && nums1[i] > nums2[j]) {
                nums1[k--] = nums1[i--];
            } else {
                nums1[k--] = nums2[j--];
            }
        }
    }

    public static void main(String[] args) {
        int[] nums1 = {1, 2, 3, 0, 0, 0};
        new Solution().merge(nums1, 3, new int[]{2, 5, 6}, 3);
        System.out.println(Arrays.toString(nums1)); // [1, 2, 2, 3, 5, 6]
    }
}`,
      },
      {
        language: "python",
        code: `def merge(nums1: list[int], m: int, nums2: list[int], n: int) -> None:
    i, j, k = m - 1, n - 1, m + n - 1

    while j >= 0:
        if i >= 0 and nums1[i] > nums2[j]:
            nums1[k] = nums1[i]
            i -= 1
        else:
            nums1[k] = nums2[j]
            j -= 1
        k -= 1


nums1 = [1, 2, 3, 0, 0, 0]
merge(nums1, 3, [2, 5, 6], 3)
print(nums1)  # [1, 2, 2, 3, 5, 6]`,
      },
    ],
  },
  {
    id: 18,
    slug: "two-sum-ii-input-array-is-sorted",
    title: "Two Sum II — Input Array Is Sorted",
    difficulty: "basic",
    category: "arrays",
    tags: ["Array", "Two Pointers", "Binary Search"],
    description:
      "Given a **1-indexed** array of integers `numbers` that is already sorted in **non-decreasing order**, find two numbers that add up to a specific `target`.\n\nReturn the indices of the two numbers as an integer array `[index1, index2]`. You may not use the same element twice. There is **exactly one solution**.\n\nYou must use only **constant extra space**.",
    constraints: [
      "2 ≤ numbers.length ≤ 3 × 10⁴",
      "-1000 ≤ numbers[i] ≤ 1000",
      "numbers is sorted in non-decreasing order.",
      "-1000 ≤ target ≤ 1000",
      "The tests are generated such that there is exactly one solution.",
    ],
    examples: [
      {
        input: "numbers = [2, 7, 11, 15], target = 9",
        output: "[1, 2]",
        explanation: "numbers[0] + numbers[1] = 2 + 7 = 9. Return [1, 2] (1-indexed).",
      },
      {
        input: "numbers = [2, 3, 4], target = 6",
        output: "[1, 3]",
      },
      {
        input: "numbers = [-1, 0], target = -1",
        output: "[1, 2]",
      },
    ],
    solutions: [
      {
        language: "javascript",
        code: `function twoSumII(numbers, target) {
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const sum = numbers[left] + numbers[right];

    if (sum === target) {
      return [left + 1, right + 1]; // 1-indexed
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }

  return [];
}

console.log(twoSumII([2, 7, 11, 15], 9)); // [1, 2]`,
      },
      {
        language: "typescript",
        code: `function twoSumII(numbers: number[], target: number): number[] {
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const sum = numbers[left] + numbers[right];

    if (sum === target) {
      return [left + 1, right + 1];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }

  return [];
}`,
      },
      {
        language: "php",
        code: `<?php

function twoSumII(array $numbers, int $target): array {
    $left = 0;
    $right = count($numbers) - 1;

    while ($left < $right) {
        $sum = $numbers[$left] + $numbers[$right];

        if ($sum === $target) {
            return [$left + 1, $right + 1];
        } elseif ($sum < $target) {
            $left++;
        } else {
            $right--;
        }
    }

    return [];
}

print_r(twoSumII([2, 7, 11, 15], 9)); // [1, 2]`,
      },
      {
        language: "java",
        code: `class Solution {
    public int[] twoSum(int[] numbers, int target) {
        int left = 0;
        int right = numbers.length - 1;

        while (left < right) {
            int sum = numbers[left] + numbers[right];

            if (sum == target) {
                return new int[]{left + 1, right + 1};
            } else if (sum < target) {
                left++;
            } else {
                right--;
            }
        }

        return new int[]{};
    }

    public static void main(String[] args) {
        int[] result = new Solution().twoSum(new int[]{2, 7, 11, 15}, 9);
        System.out.println(result[0] + ", " + result[1]); // 1, 2
    }
}`,
      },
      {
        language: "python",
        code: `def two_sum_ii(numbers: list[int], target: int) -> list[int]:
    left, right = 0, len(numbers) - 1

    while left < right:
        s = numbers[left] + numbers[right]

        if s == target:
            return [left + 1, right + 1]
        elif s < target:
            left += 1
        else:
            right -= 1

    return []


print(two_sum_ii([2, 7, 11, 15], 9))  # [1, 2]`,
      },
    ],
  },
  {
    id: 19,
    slug: "merge-intervals",
    title: "Merge Intervals",
    difficulty: "basic",
    category: "arrays",
    tags: ["Array", "Sorting"],
    description:
      "Given an array of `intervals` where `intervals[i] = [starti, endi]`, merge all **overlapping intervals** and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    constraints: [
      "1 ≤ intervals.length ≤ 10⁴",
      "intervals[i].length == 2",
      "0 ≤ starti ≤ endi ≤ 10⁴",
    ],
    examples: [
      {
        input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        output: "[[1,6],[8,10],[15,18]]",
        explanation: "[1,3] and [2,6] overlap → merged to [1,6].",
      },
      {
        input: "intervals = [[1,4],[4,5]]",
        output: "[[1,5]]",
        explanation: "Intervals [1,4] and [4,5] touch at 4 and are considered overlapping.",
      },
    ],
    solutions: [
      {
        language: "javascript",
        code: `function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const result = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const last = result[result.length - 1];
    const [start, end] = intervals[i];

    if (start <= last[1]) {
      last[1] = Math.max(last[1], end); // extend current interval
    } else {
      result.push([start, end]);
    }
  }

  return result;
}

console.log(merge([[1,3],[2,6],[8,10],[15,18]])); // [[1,6],[8,10],[15,18]]`,
      },
      {
        language: "typescript",
        code: `function merge(intervals: number[][]): number[][] {
  intervals.sort((a, b) => a[0] - b[0]);
  const result: number[][] = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const last = result[result.length - 1];
    const [start, end] = intervals[i];

    if (start <= last[1]) {
      last[1] = Math.max(last[1], end);
    } else {
      result.push([start, end]);
    }
  }

  return result;
}`,
      },
      {
        language: "php",
        code: `<?php

function merge(array $intervals): array {
    usort($intervals, fn($a, $b) => $a[0] - $b[0]);
    $result = [$intervals[0]];

    for ($i = 1; $i < count($intervals); $i++) {
        $last = &$result[count($result) - 1];
        [$start, $end] = $intervals[$i];

        if ($start <= $last[1]) {
            $last[1] = max($last[1], $end);
        } else {
            $result[] = [$start, $end];
        }
    }

    return $result;
}

print_r(merge([[1,3],[2,6],[8,10],[15,18]]));`,
      },
      {
        language: "java",
        code: `import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class Solution {
    public int[][] merge(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
        List<int[]> result = new ArrayList<>();
        result.add(intervals[0]);

        for (int i = 1; i < intervals.length; i++) {
            int[] last = result.get(result.size() - 1);
            int start = intervals[i][0];
            int end = intervals[i][1];

            if (start <= last[1]) {
                last[1] = Math.max(last[1], end);
            } else {
                result.add(new int[]{start, end});
            }
        }

        return result.toArray(new int[0][]);
    }
}`,
      },
      {
        language: "python",
        code: `def merge_intervals(intervals: list[list[int]]) -> list[list[int]]:
    intervals.sort(key=lambda x: x[0])
    result = [intervals[0]]

    for start, end in intervals[1:]:
        if start <= result[-1][1]:
            result[-1][1] = max(result[-1][1], end)
        else:
            result.append([start, end])

    return result


print(merge_intervals([[1,3],[2,6],[8,10],[15,18]]))  # [[1,6],[8,10],[15,18]]`,
      },
    ],
  },
];
