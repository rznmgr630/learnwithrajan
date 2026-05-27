export type Blind75Language = "javascript" | "typescript" | "php" | "java" | "python";

export interface Blind75Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface Blind75Solution {
  language: Blind75Language;
  code: string;
}

export interface Blind75Problem {
  num: number;
  title: string;
  leetcodeNum: number;
  slug: string;
  pattern: string;
  visual: string;
  premium?: boolean;
  // Full detail — present only for problems that have been expanded
  difficulty?: "easy" | "medium" | "hard";
  tags?: string[];
  description?: string;
  examples?: Blind75Example[];
  constraints?: string[];
  approach?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  solutions?: Blind75Solution[];
}

export interface Blind75Category {
  id: string;
  name: string;
  problems: Blind75Problem[];
}

export const BLIND75_DIFFICULTY_COLOR: Record<"easy" | "medium" | "hard", string> = {
  easy:   "text-emerald-500 bg-emerald-500/10",
  medium: "text-amber-500  bg-amber-500/10",
  hard:   "text-rose-500   bg-rose-500/10",
};

export const BLIND75_DIFFICULTY_LABEL: Record<"easy" | "medium" | "hard", string> = {
  easy:   "Easy",
  medium: "Medium",
  hard:   "Hard",
};

export const BLIND75_LANGUAGE_LABELS: Record<Blind75Language, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  php:        "PHP",
  java:       "Java",
  python:     "Python",
};

export const BLIND75_LANG_DOT: Record<Blind75Language, string> = {
  javascript: "bg-yellow-400",
  typescript: "bg-blue-400",
  php:        "bg-indigo-400",
  java:       "bg-orange-400",
  python:     "bg-sky-400",
};

export const BLIND75_LANGUAGE_ORDER: Blind75Language[] = [
  "javascript", "typescript", "php", "java", "python",
];

// ─────────────────────────────────────────────────────────────────────────────
// Problem data
// ─────────────────────────────────────────────────────────────────────────────

export const BLIND75_CATEGORIES: Blind75Category[] = [
  {
    id: "array",
    name: "Array",
    problems: [
      // ── 1. Two Sum ────────────────────────────────────────────────────────
      {
        num: 1,
        title: "Two Sum",
        leetcodeNum: 1,
        slug: "two-sum",
        pattern: "Hash map complement",
        visual: "seen[target − x] lookup",
        difficulty: "easy",
        tags: ["Array", "Hash Map"],
        description:
          "Given an array of integers `nums` and an integer `target`, return the **indices** of the two numbers that add up to `target`.\n\nYou may assume that each input has **exactly one solution**, and you may not use the same element twice.\n\nYou can return the answer in any order.",
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
        constraints: [
          "2 ≤ nums.length ≤ 10⁴",
          "-10⁹ ≤ nums[i] ≤ 10⁹",
          "-10⁹ ≤ target ≤ 10⁹",
          "Only one valid answer exists.",
        ],
        approach: "Hash map (one-pass)",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
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

      // ── 2. Best Time to Buy and Sell Stock ────────────────────────────────
      {
        num: 2,
        title: "Best Time to Buy and Sell Stock",
        leetcodeNum: 121,
        slug: "best-time-to-buy-and-sell-stock",
        pattern: "Single pass",
        visual: "Track running min, profit = price − min",
        difficulty: "easy",
        tags: ["Array", "Dynamic Programming", "Greedy"],
        description:
          "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`-th day.\n\nYou want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.\n\nReturn the **maximum profit** you can achieve from this transaction. If you cannot achieve any profit, return `0`.",
        examples: [
          {
            input: "prices = [7, 1, 5, 3, 6, 4]",
            output: "5",
            explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5.",
          },
          {
            input: "prices = [7, 6, 4, 3, 1]",
            output: "0",
            explanation: "Prices only decrease, so no transaction is done and the max profit is 0.",
          },
          {
            input: "prices = [2, 4, 1]",
            output: "2",
            explanation: "Buy on day 1 (price = 2) and sell on day 2 (price = 4), profit = 4 - 2 = 2.",
          },
        ],
        constraints: [
          "1 ≤ prices.length ≤ 10⁵",
          "0 ≤ prices[i] ≤ 10⁴",
        ],
        approach: "Greedy one-pass",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
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
    if (price < minPrice) {
      minPrice = price;         // found a cheaper buy day
    } else if (price - minPrice > maxProfit) {
      maxProfit = price - minPrice; // found a better profit
    }
  }

  return maxProfit;
}

// Example usage
console.log(maxProfit([7, 1, 5, 3, 6, 4])); // 5
console.log(maxProfit([7, 6, 4, 3, 1]));    // 0`,
          },
          {
            language: "typescript",
            code: `function maxProfit(prices: number[]): number {
  let minPrice = Infinity;
  let maxProfitVal = 0;

  for (const price of prices) {
    if (price < minPrice) {
      minPrice = price;
    } else if (price - minPrice > maxProfitVal) {
      maxProfitVal = price - minPrice;
    }
  }

  return maxProfitVal;
}

// Example usage
console.log(maxProfit([7, 1, 5, 3, 6, 4])); // 5
console.log(maxProfit([7, 6, 4, 3, 1]));    // 0`,
          },
          {
            language: "php",
            code: `<?php

function maxProfit(array $prices): int {
    $minPrice = PHP_INT_MAX;
    $maxProfit = 0;

    foreach ($prices as $price) {
        if ($price < $minPrice) {
            $minPrice = $price;
        } elseif ($price - $minPrice > $maxProfit) {
            $maxProfit = $price - $minPrice;
        }
    }

    return $maxProfit;
}

// Example usage
echo maxProfit([7, 1, 5, 3, 6, 4]) . PHP_EOL; // 5
echo maxProfit([7, 6, 4, 3, 1]) . PHP_EOL;    // 0`,
          },
          {
            language: "java",
            code: `class Solution {
    public int maxProfit(int[] prices) {
        int minPrice = Integer.MAX_VALUE;
        int maxProfit = 0;

        for (int price : prices) {
            if (price < minPrice) {
                minPrice = price;
            } else if (price - minPrice > maxProfit) {
                maxProfit = price - minPrice;
            }
        }

        return maxProfit;
    }

    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(sol.maxProfit(new int[]{7, 1, 5, 3, 6, 4})); // 5
        System.out.println(sol.maxProfit(new int[]{7, 6, 4, 3, 1}));    // 0
    }
}`,
          },
          {
            language: "python",
            code: `def max_profit(prices: list[int]) -> int:
    min_price = float('inf')
    max_profit = 0

    for price in prices:
        if price < min_price:
            min_price = price
        elif price - min_price > max_profit:
            max_profit = price - min_price

    return max_profit


# Example usage
print(max_profit([7, 1, 5, 3, 6, 4]))  # 5
print(max_profit([7, 6, 4, 3, 1]))     # 0`,
          },
        ],
      },

      // ── 3. Contains Duplicate ─────────────────────────────────────────────
      {
        num: 3,
        title: "Contains Duplicate",
        leetcodeNum: 217,
        slug: "contains-duplicate",
        pattern: "Hash set",
        visual: "Insert; if exists → true",
        difficulty: "easy",
        tags: ["Array", "Hash Set", "Sorting"],
        description:
          "Given an integer array `nums`, return `true` if any value appears **at least twice** in the array, and return `false` if every element is **distinct**.",
        examples: [
          {
            input: "nums = [1, 2, 3, 1]",
            output: "true",
            explanation: "The value 1 appears at index 0 and index 3.",
          },
          {
            input: "nums = [1, 2, 3, 4]",
            output: "false",
            explanation: "All values are distinct.",
          },
          {
            input: "nums = [1, 1, 1, 3, 3, 4, 3, 2, 4, 2]",
            output: "true",
          },
        ],
        constraints: [
          "1 ≤ nums.length ≤ 10⁵",
          "-10⁹ ≤ nums[i] ≤ 10⁹",
        ],
        approach: "Hash set — O(1) average lookup per element",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
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
console.log(containsDuplicate([1, 2, 3, 1]));          // true
console.log(containsDuplicate([1, 2, 3, 4]));          // false`,
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
var_dump(containsDuplicate([1, 2, 3, 1])); // bool(true)
var_dump(containsDuplicate([1, 2, 3, 4])); // bool(false)`,
          },
          {
            language: "java",
            code: `import java.util.HashSet;
import java.util.Set;

class Solution {
    public boolean containsDuplicate(int[] nums) {
        Set<Integer> seen = new HashSet<>();

        for (int num : nums) {
            if (!seen.add(num)) return true; // add() returns false if already present
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


# One-liner alternative
# return len(nums) != len(set(nums))

# Example usage
print(contains_duplicate([1, 2, 3, 1]))  # True
print(contains_duplicate([1, 2, 3, 4]))  # False`,
          },
        ],
      },

      // ── 4. Product of Array Except Self ───────────────────────────────────
      {
        num: 4,
        title: "Product of Array Except Self",
        leetcodeNum: 238,
        slug: "product-of-array-except-self",
        pattern: "Prefix × suffix",
        visual: "Two passes: left-products, right-products",
        difficulty: "medium",
        tags: ["Array", "Prefix Sum"],
        description:
          "Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the **product of all the elements** of `nums` **except** `nums[i]`.\n\nThe product of any prefix or suffix of `nums` is **guaranteed** to fit in a **32-bit** integer.\n\nYou must write an algorithm that runs in `O(n)` time and **without using the division operation**.",
        examples: [
          {
            input: "nums = [1, 2, 3, 4]",
            output: "[24, 12, 8, 6]",
            explanation:
              "answer[0] = 2×3×4 = 24, answer[1] = 1×3×4 = 12, answer[2] = 1×2×4 = 8, answer[3] = 1×2×3 = 6.",
          },
          {
            input: "nums = [-1, 1, 0, -3, 3]",
            output: "[0, 0, 9, 0, 0]",
          },
        ],
        constraints: [
          "2 ≤ nums.length ≤ 10⁵",
          "-30 ≤ nums[i] ≤ 30",
          "The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.",
        ],
        approach: "Two-pass prefix/suffix — build left products, then multiply right products in-place",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1) extra (output array not counted)",
        solutions: [
          {
            language: "javascript",
            code: `/**
 * @param {number[]} nums
 * @return {number[]}
 */
function productExceptSelf(nums) {
  const n = nums.length;
  const answer = new Array(n).fill(1);

  // Pass 1: fill answer[i] with product of all elements to the LEFT of i
  let leftProduct = 1;
  for (let i = 0; i < n; i++) {
    answer[i] = leftProduct;
    leftProduct *= nums[i];
  }

  // Pass 2: multiply answer[i] by product of all elements to the RIGHT of i
  let rightProduct = 1;
  for (let i = n - 1; i >= 0; i--) {
    answer[i] *= rightProduct;
    rightProduct *= nums[i];
  }

  return answer;
}

// Example usage
console.log(productExceptSelf([1, 2, 3, 4]));        // [24, 12, 8, 6]
console.log(productExceptSelf([-1, 1, 0, -3, 3]));   // [0, 0, 9, 0, 0]`,
          },
          {
            language: "typescript",
            code: `function productExceptSelf(nums: number[]): number[] {
  const n = nums.length;
  const answer: number[] = new Array(n).fill(1);

  // Pass 1: left products
  let leftProduct = 1;
  for (let i = 0; i < n; i++) {
    answer[i] = leftProduct;
    leftProduct *= nums[i];
  }

  // Pass 2: multiply by right products
  let rightProduct = 1;
  for (let i = n - 1; i >= 0; i--) {
    answer[i] *= rightProduct;
    rightProduct *= nums[i];
  }

  return answer;
}

// Example usage
console.log(productExceptSelf([1, 2, 3, 4])); // [24, 12, 8, 6]`,
          },
          {
            language: "php",
            code: `<?php

function productExceptSelf(array $nums): array {
    $n = count($nums);
    $answer = array_fill(0, $n, 1);

    // Pass 1: left products
    $leftProduct = 1;
    for ($i = 0; $i < $n; $i++) {
        $answer[$i] = $leftProduct;
        $leftProduct *= $nums[$i];
    }

    // Pass 2: multiply by right products
    $rightProduct = 1;
    for ($i = $n - 1; $i >= 0; $i--) {
        $answer[$i] *= $rightProduct;
        $rightProduct *= $nums[$i];
    }

    return $answer;
}

// Example usage
print_r(productExceptSelf([1, 2, 3, 4])); // [24, 12, 8, 6]`,
          },
          {
            language: "java",
            code: `class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] answer = new int[n];

        // Pass 1: left products
        int leftProduct = 1;
        for (int i = 0; i < n; i++) {
            answer[i] = leftProduct;
            leftProduct *= nums[i];
        }

        // Pass 2: multiply by right products
        int rightProduct = 1;
        for (int i = n - 1; i >= 0; i--) {
            answer[i] *= rightProduct;
            rightProduct *= nums[i];
        }

        return answer;
    }

    public static void main(String[] args) {
        Solution sol = new Solution();
        int[] result = sol.productExceptSelf(new int[]{1, 2, 3, 4});
        for (int x : result) System.out.print(x + " "); // 24 12 8 6
    }
}`,
          },
          {
            language: "python",
            code: `def product_except_self(nums: list[int]) -> list[int]:
    n = len(nums)
    answer = [1] * n

    # Pass 1: left products
    left_product = 1
    for i in range(n):
        answer[i] = left_product
        left_product *= nums[i]

    # Pass 2: multiply by right products
    right_product = 1
    for i in range(n - 1, -1, -1):
        answer[i] *= right_product
        right_product *= nums[i]

    return answer


# Example usage
print(product_except_self([1, 2, 3, 4]))       # [24, 12, 8, 6]
print(product_except_self([-1, 1, 0, -3, 3]))  # [0, 0, 9, 0, 0]`,
          },
        ],
      },

      // ── 5. Maximum Subarray ───────────────────────────────────────────────
      {
        num: 5,
        title: "Maximum Subarray",
        leetcodeNum: 53,
        slug: "maximum-subarray",
        pattern: "Kadane's",
        visual: "curr = max(x, curr+x); best = max(best, curr)",
        difficulty: "medium",
        tags: ["Array", "Dynamic Programming", "Divide and Conquer"],
        description:
          "Given an integer array `nums`, find the **subarray** with the largest sum, and return its **sum**.\n\nA **subarray** is a contiguous non-empty sequence of elements within an array.",
        examples: [
          {
            input: "nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]",
            output: "6",
            explanation: "The subarray [4, -1, 2, 1] has the largest sum = 6.",
          },
          {
            input: "nums = [1]",
            output: "1",
            explanation: "The only subarray is [1], with sum 1.",
          },
          {
            input: "nums = [5, 4, -1, 7, 8]",
            output: "23",
            explanation: "The entire array [5, 4, -1, 7, 8] has sum 23.",
          },
        ],
        constraints: [
          "1 ≤ nums.length ≤ 10⁵",
          "-10⁴ ≤ nums[i] ≤ 10⁴",
        ],
        approach: "Kadane's algorithm — extend or restart the subarray at each element",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        solutions: [
          {
            language: "javascript",
            code: `/**
 * @param {number[]} nums
 * @return {number}
 */
function maxSubArray(nums) {
  let currentSum = nums[0];
  let bestSum = nums[0];

  for (let i = 1; i < nums.length; i++) {
    // Either extend the running subarray or start fresh at nums[i]
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    bestSum = Math.max(bestSum, currentSum);
  }

  return bestSum;
}

// Example usage
console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6
console.log(maxSubArray([5, 4, -1, 7, 8]));                 // 23`,
          },
          {
            language: "typescript",
            code: `function maxSubArray(nums: number[]): number {
  let currentSum = nums[0];
  let bestSum = nums[0];

  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    bestSum = Math.max(bestSum, currentSum);
  }

  return bestSum;
}

// Example usage
console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6
console.log(maxSubArray([5, 4, -1, 7, 8]));                 // 23`,
          },
          {
            language: "php",
            code: `<?php

function maxSubArray(array $nums): int {
    $currentSum = $nums[0];
    $bestSum    = $nums[0];

    for ($i = 1; $i < count($nums); $i++) {
        $currentSum = max($nums[$i], $currentSum + $nums[$i]);
        $bestSum    = max($bestSum, $currentSum);
    }

    return $bestSum;
}

// Example usage
echo maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]) . PHP_EOL; // 6
echo maxSubArray([5, 4, -1, 7, 8]) . PHP_EOL;                 // 23`,
          },
          {
            language: "java",
            code: `class Solution {
    public int maxSubArray(int[] nums) {
        int currentSum = nums[0];
        int bestSum    = nums[0];

        for (int i = 1; i < nums.length; i++) {
            currentSum = Math.max(nums[i], currentSum + nums[i]);
            bestSum    = Math.max(bestSum, currentSum);
        }

        return bestSum;
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
    current_sum = nums[0]
    best_sum    = nums[0]

    for num in nums[1:]:
        # Extend running subarray or start fresh
        current_sum = max(num, current_sum + num)
        best_sum    = max(best_sum, current_sum)

    return best_sum


# Example usage
print(max_sub_array([-2, 1, -3, 4, -1, 2, 1, -5, 4]))  # 6
print(max_sub_array([5, 4, -1, 7, 8]))                   # 23`,
          },
        ],
      },

      // ── 6. Maximum Product Subarray ───────────────────────────────────────
      {
        num: 6,
        title: "Maximum Product Subarray",
        leetcodeNum: 152,
        slug: "maximum-product-subarray",
        pattern: "Track min & max",
        visual: "Negative flips min ↔ max",
        difficulty: "medium",
        tags: ["Array", "Dynamic Programming"],
        description:
          "Given an integer array `nums`, find a **subarray** that has the largest product, and return the **product**.\n\nThe test cases are generated so that the answer will fit in a **32-bit** integer.\n\nA **subarray** is a contiguous non-empty sequence of elements within an array.",
        examples: [
          {
            input: "nums = [2, 3, -2, 4]",
            output: "6",
            explanation: "The subarray [2, 3] has the largest product = 6.",
          },
          {
            input: "nums = [-2, 0, -1]",
            output: "0",
            explanation: "The result cannot be 2 because [-2, -1] is not a subarray.",
          },
          {
            input: "nums = [-2, 3, -4]",
            output: "24",
            explanation: "The entire array [-2, 3, -4] has product = 24.",
          },
        ],
        constraints: [
          "1 ≤ nums.length ≤ 2 × 10⁴",
          "-10 ≤ nums[i] ≤ 10",
          "The product of any subarray of nums is guaranteed to fit in a 32-bit integer.",
        ],
        approach: "Track running max AND min — a negative × negative becomes the new max",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        solutions: [
          {
            language: "javascript",
            code: `/**
 * @param {number[]} nums
 * @return {number}
 */
function maxProduct(nums) {
  let curMax = nums[0];
  let curMin = nums[0];
  let result = nums[0];

  for (let i = 1; i < nums.length; i++) {
    const num = nums[i];

    // A negative number swaps max and min, so compute both candidates first
    const tempMax = Math.max(num, curMax * num, curMin * num);
    const tempMin = Math.min(num, curMax * num, curMin * num);

    curMax = tempMax;
    curMin = tempMin;
    result = Math.max(result, curMax);
  }

  return result;
}

// Example usage
console.log(maxProduct([2, 3, -2, 4]));  // 6
console.log(maxProduct([-2, 3, -4]));    // 24`,
          },
          {
            language: "typescript",
            code: `function maxProduct(nums: number[]): number {
  let curMax = nums[0];
  let curMin = nums[0];
  let result = nums[0];

  for (let i = 1; i < nums.length; i++) {
    const num = nums[i];
    const tempMax = Math.max(num, curMax * num, curMin * num);
    const tempMin = Math.min(num, curMax * num, curMin * num);
    curMax = tempMax;
    curMin = tempMin;
    result = Math.max(result, curMax);
  }

  return result;
}

// Example usage
console.log(maxProduct([2, 3, -2, 4])); // 6
console.log(maxProduct([-2, 3, -4]));   // 24`,
          },
          {
            language: "php",
            code: `<?php

function maxProduct(array $nums): int {
    $curMax = $nums[0];
    $curMin = $nums[0];
    $result = $nums[0];

    for ($i = 1; $i < count($nums); $i++) {
        $num    = $nums[$i];
        $tempMax = max($num, $curMax * $num, $curMin * $num);
        $tempMin = min($num, $curMax * $num, $curMin * $num);
        $curMax  = $tempMax;
        $curMin  = $tempMin;
        $result  = max($result, $curMax);
    }

    return $result;
}

// Example usage
echo maxProduct([2, 3, -2, 4]) . PHP_EOL; // 6
echo maxProduct([-2, 3, -4])   . PHP_EOL; // 24`,
          },
          {
            language: "java",
            code: `class Solution {
    public int maxProduct(int[] nums) {
        int curMax = nums[0];
        int curMin = nums[0];
        int result = nums[0];

        for (int i = 1; i < nums.length; i++) {
            int num     = nums[i];
            int tempMax = Math.max(num, Math.max(curMax * num, curMin * num));
            int tempMin = Math.min(num, Math.min(curMax * num, curMin * num));
            curMax = tempMax;
            curMin = tempMin;
            result = Math.max(result, curMax);
        }

        return result;
    }

    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(sol.maxProduct(new int[]{2, 3, -2, 4})); // 6
        System.out.println(sol.maxProduct(new int[]{-2, 3, -4}));   // 24
    }
}`,
          },
          {
            language: "python",
            code: `def max_product(nums: list[int]) -> int:
    cur_max = nums[0]
    cur_min = nums[0]
    result  = nums[0]

    for num in nums[1:]:
        candidates = (num, cur_max * num, cur_min * num)
        cur_max, cur_min = max(candidates), min(candidates)
        result = max(result, cur_max)

    return result


# Example usage
print(max_product([2, 3, -2, 4]))  # 6
print(max_product([-2, 3, -4]))    # 24`,
          },
        ],
      },

      // ── 7. Find Minimum in Rotated Sorted Array ───────────────────────────
      {
        num: 7,
        title: "Find Minimum in Rotated Sorted Array",
        leetcodeNum: 153,
        slug: "find-minimum-in-rotated-sorted-array",
        pattern: "Binary search",
        visual: "Compare mid vs right to pick half",
        difficulty: "medium",
        tags: ["Array", "Binary Search"],
        description:
          "Suppose an array of length `n` sorted in ascending order is **rotated** between `1` and `n` times.\n\nGiven the sorted rotated array `nums` of **unique** elements, return the **minimum element** of this array.\n\nYou must write an algorithm that runs in `O(log n)` time.",
        examples: [
          {
            input: "nums = [3, 4, 5, 1, 2]",
            output: "1",
            explanation: "The original array was [1, 2, 3, 4, 5] and it was rotated 3 times.",
          },
          {
            input: "nums = [4, 5, 6, 7, 0, 1, 2]",
            output: "0",
            explanation: "The original array was [0, 1, 2, 4, 5, 6, 7] and it was rotated 4 times.",
          },
          {
            input: "nums = [11, 13, 15, 17]",
            output: "11",
            explanation: "The array was rotated 0 times — it remains sorted.",
          },
        ],
        constraints: [
          "n == nums.length",
          "1 ≤ n ≤ 5000",
          "-5000 ≤ nums[i] ≤ 5000",
          "All the integers of nums are unique.",
          "nums is sorted and rotated between 1 and n times.",
        ],
        approach: "Binary search — if nums[mid] > nums[right], minimum is in the right half; otherwise left half (including mid)",
        timeComplexity: "O(log n)",
        spaceComplexity: "O(1)",
        solutions: [
          {
            language: "javascript",
            code: `/**
 * @param {number[]} nums
 * @return {number}
 */
function findMin(nums) {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] > nums[right]) {
      // Minimum must be in the right half
      left = mid + 1;
    } else {
      // Minimum is in the left half (mid could be the answer)
      right = mid;
    }
  }

  return nums[left];
}

// Example usage
console.log(findMin([3, 4, 5, 1, 2]));       // 1
console.log(findMin([4, 5, 6, 7, 0, 1, 2])); // 0`,
          },
          {
            language: "typescript",
            code: `function findMin(nums: number[]): number {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] > nums[right]) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }

  return nums[left];
}

// Example usage
console.log(findMin([3, 4, 5, 1, 2]));       // 1
console.log(findMin([4, 5, 6, 7, 0, 1, 2])); // 0`,
          },
          {
            language: "php",
            code: `<?php

function findMin(array $nums): int {
    $left  = 0;
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

// Example usage
echo findMin([3, 4, 5, 1, 2])       . PHP_EOL; // 1
echo findMin([4, 5, 6, 7, 0, 1, 2]) . PHP_EOL; // 0`,
          },
          {
            language: "java",
            code: `class Solution {
    public int findMin(int[] nums) {
        int left  = 0;
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
        Solution sol = new Solution();
        System.out.println(sol.findMin(new int[]{3, 4, 5, 1, 2}));       // 1
        System.out.println(sol.findMin(new int[]{4, 5, 6, 7, 0, 1, 2})); // 0
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
            left = mid + 1   # minimum is in right half
        else:
            right = mid      # mid could be the minimum

    return nums[left]


# Example usage
print(find_min([3, 4, 5, 1, 2]))       # 1
print(find_min([4, 5, 6, 7, 0, 1, 2])) # 0`,
          },
        ],
      },

      // ── 8. Search in Rotated Sorted Array ────────────────────────────────
      {
        num: 8,
        title: "Search in Rotated Sorted Array",
        leetcodeNum: 33,
        slug: "search-in-rotated-sorted-array",
        pattern: "BS with rotation",
        visual: "One half is always sorted",
        difficulty: "medium",
        tags: ["Array", "Binary Search"],
        description:
          "There is an integer array `nums` sorted in ascending order (with **distinct** values) that has been possibly rotated at an unknown pivot index.\n\nGiven the array `nums` and an integer `target`, return the **index** of `target` if it is in `nums`, or `-1` if it is not in `nums`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.",
        examples: [
          {
            input: "nums = [4, 5, 6, 7, 0, 1, 2], target = 0",
            output: "4",
          },
          {
            input: "nums = [4, 5, 6, 7, 0, 1, 2], target = 3",
            output: "-1",
          },
          {
            input: "nums = [1], target = 0",
            output: "-1",
          },
        ],
        constraints: [
          "1 ≤ nums.length ≤ 5000",
          "-10⁴ ≤ nums[i] ≤ 10⁴",
          "All values in nums are unique.",
          "nums is an ascending array that is possibly rotated.",
          "-10⁴ ≤ target ≤ 10⁴",
        ],
        approach: "Binary search — at every step one half is guaranteed to be sorted; check if target falls in that sorted half",
        timeComplexity: "O(log n)",
        spaceComplexity: "O(1)",
        solutions: [
          {
            language: "javascript",
            code: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
function search(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] === target) return mid;

    // Left half is sorted
    if (nums[left] <= nums[mid]) {
      if (target >= nums[left] && target < nums[mid]) {
        right = mid - 1; // target is in sorted left half
      } else {
        left = mid + 1;  // target must be in right half
      }
    } else {
      // Right half is sorted
      if (target > nums[mid] && target <= nums[right]) {
        left = mid + 1;  // target is in sorted right half
      } else {
        right = mid - 1; // target must be in left half
      }
    }
  }

  return -1;
}

// Example usage
console.log(search([4, 5, 6, 7, 0, 1, 2], 0)); // 4
console.log(search([4, 5, 6, 7, 0, 1, 2], 3)); // -1`,
          },
          {
            language: "typescript",
            code: `function search(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] === target) return mid;

    if (nums[left] <= nums[mid]) {
      if (target >= nums[left] && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      if (target > nums[mid] && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }

  return -1;
}

// Example usage
console.log(search([4, 5, 6, 7, 0, 1, 2], 0)); // 4
console.log(search([4, 5, 6, 7, 0, 1, 2], 3)); // -1`,
          },
          {
            language: "php",
            code: `<?php

function search(array $nums, int $target): int {
    $left  = 0;
    $right = count($nums) - 1;

    while ($left <= $right) {
        $mid = intdiv($left + $right, 2);

        if ($nums[$mid] === $target) return $mid;

        if ($nums[$left] <= $nums[$mid]) {
            // Left half sorted
            if ($target >= $nums[$left] && $target < $nums[$mid]) {
                $right = $mid - 1;
            } else {
                $left = $mid + 1;
            }
        } else {
            // Right half sorted
            if ($target > $nums[$mid] && $target <= $nums[$right]) {
                $left = $mid + 1;
            } else {
                $right = $mid - 1;
            }
        }
    }

    return -1;
}

// Example usage
echo search([4, 5, 6, 7, 0, 1, 2], 0) . PHP_EOL; // 4
echo search([4, 5, 6, 7, 0, 1, 2], 3) . PHP_EOL; // -1`,
          },
          {
            language: "java",
            code: `class Solution {
    public int search(int[] nums, int target) {
        int left  = 0;
        int right = nums.length - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] == target) return mid;

            if (nums[left] <= nums[mid]) {
                // Left half is sorted
                if (target >= nums[left] && target < nums[mid]) {
                    right = mid - 1;
                } else {
                    left = mid + 1;
                }
            } else {
                // Right half is sorted
                if (target > nums[mid] && target <= nums[right]) {
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }
        }

        return -1;
    }

    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(sol.search(new int[]{4, 5, 6, 7, 0, 1, 2}, 0)); // 4
        System.out.println(sol.search(new int[]{4, 5, 6, 7, 0, 1, 2}, 3)); // -1
    }
}`,
          },
          {
            language: "python",
            code: `def search(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = (left + right) // 2

        if nums[mid] == target:
            return mid

        # Left half is sorted
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:
            # Right half is sorted
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1

    return -1


# Example usage
print(search([4, 5, 6, 7, 0, 1, 2], 0))  # 4
print(search([4, 5, 6, 7, 0, 1, 2], 3))  # -1`,
          },
        ],
      },

      // ── 9. 3Sum ───────────────────────────────────────────────────────────
      {
        num: 9,
        title: "3Sum",
        leetcodeNum: 15,
        slug: "3sum",
        pattern: "Sort + two pointers",
        visual: "Fix i, shrink window for pair sum",
        difficulty: "medium",
        tags: ["Array", "Two Pointers", "Sorting"],
        description:
          "Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.\n\nNotice that the solution set **must not contain duplicate triplets**.",
        examples: [
          {
            input: "nums = [-1, 0, 1, 2, -1, -4]",
            output: "[[-1, -1, 2], [-1, 0, 1]]",
            explanation:
              "nums[0] + nums[1] + nums[2] = -1 + 0 + 1 = 0. nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0. The distinct triplets are [-1,-1,2] and [-1,0,1].",
          },
          {
            input: "nums = [0, 1, 1]",
            output: "[]",
            explanation: "The only possible triplet does not sum up to 0.",
          },
          {
            input: "nums = [0, 0, 0]",
            output: "[[0, 0, 0]]",
          },
        ],
        constraints: [
          "3 ≤ nums.length ≤ 3000",
          "-10⁵ ≤ nums[i] ≤ 10⁵",
        ],
        approach: "Sort array, fix one element, use two pointers for the remaining pair — skip duplicates at each step",
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1) extra (output not counted)",
        solutions: [
          {
            language: "javascript",
            code: `/**
 * @param {number[]} nums
 * @return {number[][]}
 */
function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];

  for (let i = 0; i < nums.length - 2; i++) {
    // Skip duplicate values for the fixed element
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    // Early exit: smallest possible sum is already > 0
    if (nums[i] > 0) break;

    let left = i + 1;
    let right = nums.length - 1;

    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];

      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        // Skip duplicates for left and right pointers
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

// Example usage
console.log(threeSum([-1, 0, 1, 2, -1, -4])); // [[-1,-1,2],[-1,0,1]]
console.log(threeSum([0, 0, 0]));              // [[0,0,0]]`,
          },
          {
            language: "typescript",
            code: `function threeSum(nums: number[]): number[][] {
  nums.sort((a, b) => a - b);
  const result: number[][] = [];

  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    if (nums[i] > 0) break;

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

// Example usage
console.log(threeSum([-1, 0, 1, 2, -1, -4])); // [[-1,-1,2],[-1,0,1]]`,
          },
          {
            language: "php",
            code: `<?php

function threeSum(array $nums): array {
    sort($nums);
    $result = [];
    $n      = count($nums);

    for ($i = 0; $i < $n - 2; $i++) {
        if ($i > 0 && $nums[$i] === $nums[$i - 1]) continue;
        if ($nums[$i] > 0) break;

        $left  = $i + 1;
        $right = $n - 1;

        while ($left < $right) {
            $sum = $nums[$i] + $nums[$left] + $nums[$right];

            if ($sum === 0) {
                $result[] = [$nums[$i], $nums[$left], $nums[$right]];
                while ($left < $right && $nums[$left]  === $nums[$left + 1])  $left++;
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

// Example usage
print_r(threeSum([-1, 0, 1, 2, -1, -4])); // [[-1,-1,2],[-1,0,1]]`,
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
            if (nums[i] > 0) break;

            int left  = i + 1;
            int right = nums.length - 1;

            while (left < right) {
                int sum = nums[i] + nums[left] + nums[right];

                if (sum == 0) {
                    result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                    while (left < right && nums[left]  == nums[left + 1])  left++;
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

    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(sol.threeSum(new int[]{-1, 0, 1, 2, -1, -4}));
        // [[-1, -1, 2], [-1, 0, 1]]
    }
}`,
          },
          {
            language: "python",
            code: `def three_sum(nums: list[int]) -> list[list[int]]:
    nums.sort()
    result: list[list[int]] = []

    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue  # skip duplicate fixed element
        if nums[i] > 0:
            break     # smallest element is positive — no zero sum possible

        left, right = i + 1, len(nums) - 1

        while left < right:
            total = nums[i] + nums[left] + nums[right]

            if total == 0:
                result.append([nums[i], nums[left], nums[right]])
                while left < right and nums[left]  == nums[left + 1]:  left  += 1
                while left < right and nums[right] == nums[right - 1]: right -= 1
                left  += 1
                right -= 1
            elif total < 0:
                left += 1
            else:
                right -= 1

    return result


# Example usage
print(three_sum([-1, 0, 1, 2, -1, -4]))  # [[-1, -1, 2], [-1, 0, 1]]
print(three_sum([0, 0, 0]))              # [[0, 0, 0]]`,
          },
        ],
      },

      // ── 10. Container With Most Water ─────────────────────────────────────
      {
        num: 10,
        title: "Container With Most Water",
        leetcodeNum: 11,
        slug: "container-with-most-water",
        pattern: "Two pointers",
        visual: "Move shorter wall inward",
        difficulty: "medium",
        tags: ["Array", "Two Pointers", "Greedy"],
        description:
          "You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i`-th line are `(i, 0)` and `(i, height[i])`.\n\nFind two lines that together with the x-axis form a container, such that the container contains the **most water**.\n\nReturn the **maximum amount of water** a container can store.\n\n**Notice** that you may not slant the container.",
        examples: [
          {
            input: "height = [1, 8, 6, 2, 5, 4, 8, 3, 7]",
            output: "49",
            explanation:
              "The vertical lines at index 1 (height=8) and index 8 (height=7) form a container. Water = min(8,7) × (8-1) = 7 × 7 = 49.",
          },
          {
            input: "height = [1, 1]",
            output: "1",
          },
        ],
        constraints: [
          "n == height.length",
          "2 ≤ n ≤ 10⁵",
          "0 ≤ height[i] ≤ 10⁴",
        ],
        approach: "Two pointers — always move the pointer with the shorter height inward (moving the taller one can only decrease area)",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        solutions: [
          {
            language: "javascript",
            code: `/**
 * @param {number[]} height
 * @return {number}
 */
function maxArea(height) {
  let left = 0;
  let right = height.length - 1;
  let maxWater = 0;

  while (left < right) {
    const h = Math.min(height[left], height[right]);
    const w = right - left;
    maxWater = Math.max(maxWater, h * w);

    // Move the shorter wall — moving the taller one can never increase area
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }

  return maxWater;
}

// Example usage
console.log(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7])); // 49
console.log(maxArea([1, 1]));                        // 1`,
          },
          {
            language: "typescript",
            code: `function maxArea(height: number[]): number {
  let left = 0;
  let right = height.length - 1;
  let maxWater = 0;

  while (left < right) {
    const h = Math.min(height[left], height[right]);
    const w = right - left;
    maxWater = Math.max(maxWater, h * w);

    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }

  return maxWater;
}

// Example usage
console.log(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7])); // 49
console.log(maxArea([1, 1]));                        // 1`,
          },
          {
            language: "php",
            code: `<?php

function maxArea(array $height): int {
    $left     = 0;
    $right    = count($height) - 1;
    $maxWater = 0;

    while ($left < $right) {
        $h        = min($height[$left], $height[$right]);
        $w        = $right - $left;
        $maxWater = max($maxWater, $h * $w);

        if ($height[$left] < $height[$right]) {
            $left++;
        } else {
            $right--;
        }
    }

    return $maxWater;
}

// Example usage
echo maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]) . PHP_EOL; // 49
echo maxArea([1, 1])                        . PHP_EOL; // 1`,
          },
          {
            language: "java",
            code: `class Solution {
    public int maxArea(int[] height) {
        int left     = 0;
        int right    = height.length - 1;
        int maxWater = 0;

        while (left < right) {
            int h = Math.min(height[left], height[right]);
            int w = right - left;
            maxWater = Math.max(maxWater, h * w);

            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }

        return maxWater;
    }

    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(sol.maxArea(new int[]{1, 8, 6, 2, 5, 4, 8, 3, 7})); // 49
        System.out.println(sol.maxArea(new int[]{1, 1}));                        // 1
    }
}`,
          },
          {
            language: "python",
            code: `def max_area(height: list[int]) -> int:
    left, right = 0, len(height) - 1
    max_water   = 0

    while left < right:
        h = min(height[left], height[right])
        w = right - left
        max_water = max(max_water, h * w)

        # Move the shorter wall inward
        if height[left] < height[right]:
            left  += 1
        else:
            right -= 1

    return max_water


# Example usage
print(max_area([1, 8, 6, 2, 5, 4, 8, 3, 7]))  # 49
print(max_area([1, 1]))                          # 1`,
          },
        ],
      },
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
      { num: 27, title: "Clone Graph",                                        leetcodeNum: 133, slug: "clone-graph",                                              pattern: "DFS/BFS + map",            visual: "old → new node map" },
      { num: 28, title: "Course Schedule",                                    leetcodeNum: 207, slug: "course-schedule",                                          pattern: "Topo sort / cycle detect", visual: "Kahn's BFS or DFS w/ colors" },
      { num: 29, title: "Pacific Atlantic Water Flow",                        leetcodeNum: 417, slug: "pacific-atlantic-water-flow",                              pattern: "Multi-source BFS/DFS",     visual: "Reverse flow from each ocean" },
      { num: 30, title: "Number of Islands",                                  leetcodeNum: 200, slug: "number-of-islands",                                        pattern: "DFS/BFS flood fill",       visual: "Mark visited; count starts" },
      { num: 31, title: "Longest Consecutive Sequence",                       leetcodeNum: 128, slug: "longest-consecutive-sequence",                             pattern: "Hash set",                 visual: "Count only from sequence \"starts\"" },
      { num: 32, title: "Alien Dictionary",                                   leetcodeNum: 269, slug: "alien-dictionary",                                         pattern: "Topo sort",                visual: "Build edges from adjacent word diffs", premium: true },
      { num: 33, title: "Graph Valid Tree",                                   leetcodeNum: 261, slug: "graph-valid-tree",                                         pattern: "Union-Find / DFS",         visual: "Connected & edges == n−1", premium: true },
      { num: 34, title: "Number of Connected Components in Undirected Graph", leetcodeNum: 323, slug: "number-of-connected-components-in-an-undirected-graph",    pattern: "Union-Find",               visual: "Count distinct roots", premium: true },
    ],
  },
  {
    id: "interval",
    name: "Interval",
    problems: [
      { num: 35, title: "Insert Interval",           leetcodeNum: 57,  slug: "insert-interval",           pattern: "Linear scan",      visual: "Before / overlap merge / after" },
      { num: 36, title: "Merge Intervals",           leetcodeNum: 56,  slug: "merge-intervals",           pattern: "Sort by start",    visual: "Extend last end if overlap" },
      { num: 37, title: "Non-overlapping Intervals", leetcodeNum: 435, slug: "non-overlapping-intervals",  pattern: "Greedy by end",    visual: "Keep earliest-ending; remove conflicts" },
      { num: 38, title: "Meeting Rooms",             leetcodeNum: 252, slug: "meeting-rooms",             pattern: "Sort + check",     visual: "Any start[i] < end[i−1] → false", premium: true },
      { num: 39, title: "Meeting Rooms II",          leetcodeNum: 253, slug: "meeting-rooms-ii",          pattern: "Min-heap of ends", visual: "Reuse room if earliest end ≤ start", premium: true },
    ],
  },
  {
    id: "linked-list",
    name: "Linked List",
    problems: [
      { num: 40, title: "Reverse Linked List",              leetcodeNum: 206, slug: "reverse-linked-list",              pattern: "Two pointers / iterative",   visual: "prev → curr → next, advance both" },
      { num: 41, title: "Linked List Cycle",                leetcodeNum: 141, slug: "linked-list-cycle",                pattern: "Fast & slow pointers",       visual: "Meet = cycle; no meet = none" },
      { num: 42, title: "Merge Two Sorted Lists",           leetcodeNum: 21,  slug: "merge-two-sorted-lists",           pattern: "Dummy head iterative",       visual: "Pick smaller node each step" },
      { num: 43, title: "Merge k Sorted Lists",             leetcodeNum: 23,  slug: "merge-k-sorted-lists",             pattern: "Min-heap of heads",          visual: "Pop min, push next from same list" },
      { num: 44, title: "Remove Nth Node From End of List", leetcodeNum: 19,  slug: "remove-nth-node-from-end-of-list", pattern: "Two pointers gap",           visual: "Advance fast n steps first" },
      { num: 45, title: "Reorder List",                     leetcodeNum: 143, slug: "reorder-list",                     pattern: "Find mid + reverse + merge", visual: "Split, reverse second half, interleave" },
      { num: 46, title: "Find the Duplicate Number",        leetcodeNum: 287, slug: "find-the-duplicate-number",        pattern: "Floyd's cycle detection",    visual: "Treat array as linked list" },
    ],
  },
  {
    id: "matrix",
    name: "Matrix",
    problems: [
      { num: 47, title: "Set Matrix Zeroes",  leetcodeNum: 73, slug: "set-matrix-zeroes",  pattern: "In-place flags",      visual: "Use row[0] & col[0] as markers" },
      { num: 48, title: "Spiral Matrix",      leetcodeNum: 54, slug: "spiral-matrix",      pattern: "Boundary shrink",     visual: "Right, down, left, up; shrink bounds" },
      { num: 49, title: "Rotate Image",       leetcodeNum: 48, slug: "rotate-image",       pattern: "Transpose + reflect", visual: "Transpose then reverse each row" },
      { num: 50, title: "Word Search",        leetcodeNum: 79, slug: "word-search",        pattern: "DFS + backtrack",     visual: "Mark visited, unmark on return" },
      { num: 51, title: "Search a 2D Matrix", leetcodeNum: 74, slug: "search-a-2d-matrix", pattern: "Binary search",       visual: "Treat 2D as flat sorted array" },
    ],
  },
  {
    id: "string",
    name: "String",
    problems: [
      { num: 52, title: "Minimum Window Substring",      leetcodeNum: 76,  slug: "minimum-window-substring",      pattern: "Variable window + counts", visual: "Expand right, shrink left when valid" },
      { num: 53, title: "Valid Anagram",                 leetcodeNum: 242, slug: "valid-anagram",                 pattern: "Count compare",            visual: "26-length array" },
      { num: 54, title: "Group Anagrams",                leetcodeNum: 49,  slug: "group-anagrams",               pattern: "Sorted-key hash",          visual: "Group by sorted string / count tuple" },
      { num: 55, title: "Valid Parentheses",             leetcodeNum: 20,  slug: "valid-parentheses",            pattern: "Stack",                    visual: "Push opens, match on close" },
      { num: 56, title: "Valid Palindrome",              leetcodeNum: 125, slug: "valid-palindrome",             pattern: "Two pointers",             visual: "Skip non-alnum, compare lower" },
      { num: 57, title: "Longest Palindromic Substring", leetcodeNum: 5,   slug: "longest-palindromic-substring", pattern: "Expand around center",     visual: "2n−1 centers (odd & even)" },
      { num: 58, title: "Palindromic Substrings",        leetcodeNum: 647, slug: "palindromic-substrings",       pattern: "Expand around center",     visual: "Count expansions" },
      { num: 59, title: "Encode and Decode Strings",     leetcodeNum: 271, slug: "encode-and-decode-strings",    pattern: "Length-prefix framing",    visual: "\"len#payload\"", premium: true },
    ],
  },
  {
    id: "tree",
    name: "Tree",
    problems: [
      { num: 60, title: "Maximum Depth of Binary Tree",                   leetcodeNum: 104, slug: "maximum-depth-of-binary-tree",                               pattern: "DFS recursion",            visual: "1 + max(L, R)" },
      { num: 61, title: "Same Tree",                                       leetcodeNum: 100, slug: "same-tree",                                                  pattern: "Parallel DFS",             visual: "Compare nodes & recurse" },
      { num: 62, title: "Invert Binary Tree",                              leetcodeNum: 226, slug: "invert-binary-tree",                                         pattern: "DFS swap",                 visual: "Swap L/R, recurse" },
      { num: 63, title: "Binary Tree Maximum Path Sum",                    leetcodeNum: 124, slug: "binary-tree-maximum-path-sum",                               pattern: "Post-order DFS",           visual: "gain = node + max(L, R, 0); update global" },
      { num: 64, title: "Binary Tree Level Order Traversal",               leetcodeNum: 102, slug: "binary-tree-level-order-traversal",                          pattern: "BFS by level",             visual: "Queue size = level width" },
      { num: 65, title: "Serialize and Deserialize Binary Tree",           leetcodeNum: 297, slug: "serialize-and-deserialize-binary-tree",                      pattern: "Pre-order + null markers", visual: "Queue of tokens" },
      { num: 66, title: "Subtree of Another Tree",                         leetcodeNum: 572, slug: "subtree-of-another-tree",                                    pattern: "DFS + sameTree",           visual: "At each node, try match" },
      { num: 67, title: "Construct Binary Tree from Preorder and Inorder", leetcodeNum: 105, slug: "construct-binary-tree-from-preorder-and-inorder-traversal",  pattern: "Recursion + index map",    visual: "First preorder = root; split inorder" },
      { num: 68, title: "Validate Binary Search Tree",                     leetcodeNum: 98,  slug: "validate-binary-search-tree",                                pattern: "DFS with bounds",          visual: "Pass (low, high) down" },
      { num: 69, title: "Kth Smallest Element in a BST",                  leetcodeNum: 230, slug: "kth-smallest-element-in-a-bst",                              pattern: "Inorder traversal",        visual: "Stop at k-th visit" },
      { num: 70, title: "Lowest Common Ancestor of a BST",                leetcodeNum: 235, slug: "lowest-common-ancestor-of-a-binary-search-tree",             pattern: "Walk by value",            visual: "Split point = LCA" },
      { num: 71, title: "Implement Trie (Prefix Tree)",                    leetcodeNum: 208, slug: "implement-trie-prefix-tree",                                 pattern: "Trie nodes",               visual: "26 children + isEnd" },
      { num: 72, title: "Design Add and Search Words Data Structure",      leetcodeNum: 211, slug: "design-add-and-search-words-data-structure",                 pattern: "Trie + DFS for '.'",       visual: "Wildcard branches all children" },
      { num: 73, title: "Word Search II",                                  leetcodeNum: 212, slug: "word-search-ii",                                             pattern: "Trie + grid DFS",          visual: "Prune trie branches as found" },
    ],
  },
  {
    id: "heap",
    name: "Heap",
    problems: [
      { num: 74, title: "Top K Frequent Elements",      leetcodeNum: 347, slug: "top-k-frequent-elements",      pattern: "Bucket sort / heap", visual: "Buckets indexed by frequency" },
      { num: 75, title: "Find Median from Data Stream", leetcodeNum: 295, slug: "find-median-from-data-stream", pattern: "Two heaps",          visual: "Max-heap (low) + min-heap (high)" },
    ],
  },
];

export const BLIND75_TOTAL = BLIND75_CATEGORIES.reduce((sum, c) => sum + c.problems.length, 0);
