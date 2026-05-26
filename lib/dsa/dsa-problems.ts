export type Difficulty = "basic" | "medium" | "advanced";
export type SolutionLanguage = "javascript" | "typescript" | "php" | "java" | "python";

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
];
