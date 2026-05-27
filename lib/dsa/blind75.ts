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
      {
        num: 76, title: "Move Zeroes", leetcodeNum: 283, slug: "move-zeroes",
        pattern: "Two pointers / write pointer", visual: "writeIdx fills non-zeros, then zeros",
        difficulty: "easy",
        tags: ["Array", "Two Pointers"],
        description: "Given an integer array `nums`, move all `0`s to the **end** while maintaining the **relative order** of the non-zero elements. Do this **in-place** without making a copy.\n\nUse a `writeIdx` pointer. Scan through: whenever a non-zero is found, write it at `writeIdx` and advance. Then fill the rest with zeros.",
        examples: [
          { input: "nums = [0,1,0,3,12]", output: "[1,3,12,0,0]", explanation: "Non-zero values keep their order; zeroes shift to the end." },
          { input: "nums = [0]", output: "[0]" },
        ],
        constraints: ["1 <= nums.length <= 10^4", "-2^31 <= nums[i] <= 2^31 - 1"],
        approach: "writeIdx pointer: copy non-zeros forward in one pass, then fill remaining positions with 0.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        solutions: [
          {
            language: "javascript",
            code: `function moveZeroes(nums) {
  let writeIdx = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) nums[writeIdx++] = nums[i];
  }
  while (writeIdx < nums.length) nums[writeIdx++] = 0;
}`,
          },
          {
            language: "typescript",
            code: `function moveZeroes(nums: number[]): void {
  let writeIdx = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) nums[writeIdx++] = nums[i];
  }
  while (writeIdx < nums.length) nums[writeIdx++] = 0;
}`,
          },
          {
            language: "php",
            code: `function moveZeroes(array &$nums): void {
    $writeIdx = 0;
    foreach ($nums as $num) {
        if ($num !== 0) $nums[$writeIdx++] = $num;
    }
    while ($writeIdx < count($nums)) $nums[$writeIdx++] = 0;
}`,
          },
          {
            language: "java",
            code: `public void moveZeroes(int[] nums) {
    int writeIdx = 0;
    for (int num : nums) {
        if (num != 0) nums[writeIdx++] = num;
    }
    while (writeIdx < nums.length) nums[writeIdx++] = 0;
}`,
          },
          {
            language: "python",
            code: `def moveZeroes(nums: list[int]) -> None:
    write_idx = 0
    for num in nums:
        if num != 0:
            nums[write_idx] = num
            write_idx += 1
    while write_idx < len(nums):
        nums[write_idx] = 0
        write_idx += 1`,
          },
        ],
      },
      {
        num: 77, title: "Remove Duplicates from Sorted Array", leetcodeNum: 26, slug: "remove-duplicates-from-sorted-array",
        pattern: "Slow / fast pointer", visual: "k tracks unique write position",
        difficulty: "easy",
        tags: ["Array", "Two Pointers"],
        description: "Given a sorted array `nums`, remove the duplicates **in-place** so each unique element appears only once. Return `k` — the number of unique elements. The first `k` elements of `nums` must hold the unique values in order.\n\nUse a slow pointer `k` tracking where to write next. Whenever the current element differs from the previous, write it at `k` and advance.",
        examples: [
          { input: "nums = [1,1,2]", output: "2, nums = [1,2,_]", explanation: "Two unique elements in first two positions." },
          { input: "nums = [0,0,1,1,1,2,2,3,3,4]", output: "5, nums = [0,1,2,3,4,_,_,_,_,_]" },
        ],
        constraints: ["1 <= nums.length <= 3 × 10^4", "-100 <= nums[i] <= 100", "nums is sorted in non-decreasing order"],
        approach: "k=1 (first element always kept). For i from 1: if nums[i] != nums[i-1], copy to nums[k++].",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        solutions: [
          {
            language: "javascript",
            code: `function removeDuplicates(nums) {
  let k = 1;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] !== nums[i - 1]) nums[k++] = nums[i];
  }
  return k;
}`,
          },
          {
            language: "typescript",
            code: `function removeDuplicates(nums: number[]): number {
  let k = 1;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] !== nums[i - 1]) nums[k++] = nums[i];
  }
  return k;
}`,
          },
          {
            language: "php",
            code: `function removeDuplicates(array &$nums): int {
    $k = 1;
    for ($i = 1; $i < count($nums); $i++) {
        if ($nums[$i] !== $nums[$i - 1]) $nums[$k++] = $nums[$i];
    }
    return $k;
}`,
          },
          {
            language: "java",
            code: `public int removeDuplicates(int[] nums) {
    int k = 1;
    for (int i = 1; i < nums.length; i++) {
        if (nums[i] != nums[i - 1]) nums[k++] = nums[i];
    }
    return k;
}`,
          },
          {
            language: "python",
            code: `def removeDuplicates(nums: list[int]) -> int:
    k = 1
    for i in range(1, len(nums)):
        if nums[i] != nums[i - 1]:
            nums[k] = nums[i]
            k += 1
    return k`,
          },
        ],
      },
      {
        num: 78, title: "Sort Colors", leetcodeNum: 75, slug: "sort-colors",
        pattern: "Dutch National Flag", visual: "low/mid/high 3-way partition",
        difficulty: "medium",
        tags: ["Array", "Two Pointers", "Sorting"],
        description: "Given an array `nums` with `n` objects colored `0` (red), `1` (white), or `2` (blue), sort them **in-place** in one pass with constant extra space.\n\n**Dutch National Flag algorithm:** Three pointers — `low`, `mid`, `high`. `mid` scans forward:\n- `nums[mid] == 0` → swap with low, advance both\n- `nums[mid] == 1` → advance mid\n- `nums[mid] == 2` → swap with high, retreat high",
        examples: [
          { input: "nums = [2,0,2,1,1,0]", output: "[0,0,1,1,2,2]" },
          { input: "nums = [2,0,1]", output: "[0,1,2]" },
        ],
        constraints: ["n == nums.length", "1 <= n <= 300", "nums[i] is 0, 1, or 2"],
        approach: "Dutch National Flag: low tracks end of 0s, high tracks start of 2s, mid scans. One pass.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        solutions: [
          {
            language: "javascript",
            code: `function sortColors(nums) {
  let low = 0, mid = 0, high = nums.length - 1;
  while (mid <= high) {
    if (nums[mid] === 0) {
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low++; mid++;
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
            language: "typescript",
            code: `function sortColors(nums: number[]): void {
  let low = 0, mid = 0, high = nums.length - 1;
  while (mid <= high) {
    if (nums[mid] === 0) {
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low++; mid++;
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
            code: `function sortColors(array &$nums): void {
    $low = 0; $mid = 0; $high = count($nums) - 1;
    while ($mid <= $high) {
        if ($nums[$mid] === 0) {
            [$nums[$low], $nums[$mid]] = [$nums[$mid], $nums[$low]];
            $low++; $mid++;
        } elseif ($nums[$mid] === 1) {
            $mid++;
        } else {
            [$nums[$mid], $nums[$high]] = [$nums[$high], $nums[$mid]];
            $high--;
        }
    }
}`,
          },
          {
            language: "java",
            code: `public void sortColors(int[] nums) {
    int low = 0, mid = 0, high = nums.length - 1;
    while (mid <= high) {
        if (nums[mid] == 0) {
            int tmp = nums[low]; nums[low++] = nums[mid]; nums[mid++] = tmp;
        } else if (nums[mid] == 1) {
            mid++;
        } else {
            int tmp = nums[mid]; nums[mid] = nums[high]; nums[high--] = tmp;
        }
    }
}`,
          },
          {
            language: "python",
            code: `def sortColors(nums: list[int]) -> None:
    low = mid = 0
    high = len(nums) - 1
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1; mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1`,
          },
        ],
      },
      {
        num: 79, title: "Rotate Array", leetcodeNum: 189, slug: "rotate-array",
        pattern: "Triple reverse", visual: "Reverse all → reverse [0..k-1] → reverse [k..n-1]",
        difficulty: "medium",
        tags: ["Array", "Math", "Two Pointers"],
        description: "Given an integer array `nums`, rotate it to the **right** by `k` steps in-place with O(1) extra space.\n\n**Triple reverse trick:**\n1. Reverse the entire array\n2. Reverse the first `k` elements\n3. Reverse the remaining `n-k` elements\n\nThis works because rotating right by `k` is equivalent to bringing the last `k` elements to the front.",
        examples: [
          { input: "nums = [1,2,3,4,5,6,7], k = 3", output: "[5,6,7,1,2,3,4]" },
          { input: "nums = [-1,-100,3,99], k = 2", output: "[3,99,-1,-100]" },
        ],
        constraints: ["1 <= nums.length <= 10^5", "0 <= k <= 10^5"],
        approach: "k = k % n. Reverse whole array, then reverse [0..k-1], then reverse [k..n-1].",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        solutions: [
          {
            language: "javascript",
            code: `function rotate(nums, k) {
  k = k % nums.length;
  const rev = (lo, hi) => { while (lo < hi) { [nums[lo], nums[hi]] = [nums[hi], nums[lo]]; lo++; hi--; } };
  rev(0, nums.length - 1);
  rev(0, k - 1);
  rev(k, nums.length - 1);
}`,
          },
          {
            language: "typescript",
            code: `function rotate(nums: number[], k: number): void {
  k = k % nums.length;
  const rev = (lo: number, hi: number) => { while (lo < hi) { [nums[lo], nums[hi]] = [nums[hi], nums[lo]]; lo++; hi--; } };
  rev(0, nums.length - 1);
  rev(0, k - 1);
  rev(k, nums.length - 1);
}`,
          },
          {
            language: "php",
            code: `function rotate(array &$nums, int $k): void {
    $n = count($nums); $k %= $n;
    function revArr(array &$arr, int $lo, int $hi): void {
        while ($lo < $hi) { [$arr[$lo], $arr[$hi]] = [$arr[$hi], $arr[$lo]]; $lo++; $hi--; }
    }
    revArr($nums, 0, $n - 1);
    revArr($nums, 0, $k - 1);
    revArr($nums, $k, $n - 1);
}`,
          },
          {
            language: "java",
            code: `public void rotate(int[] nums, int k) {
    k %= nums.length;
    reverse(nums, 0, nums.length - 1);
    reverse(nums, 0, k - 1);
    reverse(nums, k, nums.length - 1);
}
private void reverse(int[] nums, int lo, int hi) {
    while (lo < hi) { int t = nums[lo]; nums[lo++] = nums[hi]; nums[hi--] = t; }
}`,
          },
          {
            language: "python",
            code: `def rotate(nums: list[int], k: int) -> None:
    n = len(nums)
    k %= n
    def rev(lo, hi):
        while lo < hi:
            nums[lo], nums[hi] = nums[hi], nums[lo]
            lo += 1; hi -= 1
    rev(0, n - 1)
    rev(0, k - 1)
    rev(k, n - 1)`,
          },
        ],
      },
      {
        num: 80, title: "Majority Element", leetcodeNum: 169, slug: "majority-element",
        pattern: "Boyer-Moore voting", visual: "candidate survives net cancellation",
        difficulty: "easy",
        tags: ["Array", "Divide and Conquer", "Sorting"],
        description: "Given an array `nums` of size `n`, return the **majority element** — the one appearing more than ⌊n/2⌋ times. It always exists.\n\n**Boyer-Moore Voting:** maintain a `candidate` and a `count`. When count drops to 0, pick the current element as new candidate. Pairs of different elements cancel each other out — the majority element survives.",
        examples: [
          { input: "nums = [3,2,3]", output: "3" },
          { input: "nums = [2,2,1,1,1,2,2]", output: "2" },
        ],
        constraints: ["n == nums.length", "1 <= n <= 5 × 10^4", "-10^9 <= nums[i] <= 10^9", "Majority element always exists"],
        approach: "Boyer-Moore: candidate / count pair. count=0 → new candidate. Same → count++. Diff → count--.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        solutions: [
          {
            language: "javascript",
            code: `function majorityElement(nums) {
  let candidate = nums[0], count = 1;
  for (let i = 1; i < nums.length; i++) {
    if (count === 0) { candidate = nums[i]; count = 1; }
    else if (nums[i] === candidate) count++;
    else count--;
  }
  return candidate;
}`,
          },
          {
            language: "typescript",
            code: `function majorityElement(nums: number[]): number {
  let candidate = nums[0], count = 1;
  for (let i = 1; i < nums.length; i++) {
    if (count === 0) { candidate = nums[i]; count = 1; }
    else if (nums[i] === candidate) count++;
    else count--;
  }
  return candidate;
}`,
          },
          {
            language: "php",
            code: `function majorityElement(array $nums): int {
    $candidate = $nums[0]; $count = 1;
    for ($i = 1; $i < count($nums); $i++) {
        if ($count === 0) { $candidate = $nums[$i]; $count = 1; }
        elseif ($nums[$i] === $candidate) $count++;
        else $count--;
    }
    return $candidate;
}`,
          },
          {
            language: "java",
            code: `public int majorityElement(int[] nums) {
    int candidate = nums[0], count = 1;
    for (int i = 1; i < nums.length; i++) {
        if (count == 0) { candidate = nums[i]; count = 1; }
        else if (nums[i] == candidate) count++;
        else count--;
    }
    return candidate;
}`,
          },
          {
            language: "python",
            code: `def majorityElement(nums: list[int]) -> int:
    candidate, count = nums[0], 1
    for num in nums[1:]:
        if count == 0:
            candidate, count = num, 1
        elif num == candidate:
            count += 1
        else:
            count -= 1
    return candidate`,
          },
        ],
      },
      {
        num: 81, title: "Merge Sorted Array", leetcodeNum: 88, slug: "merge-sorted-array",
        pattern: "Fill from the back", visual: "Three pointers i, j, k starting at ends",
        difficulty: "easy",
        tags: ["Array", "Two Pointers", "Sorting"],
        description: "Given two sorted arrays `nums1` (size `m+n`, last `n` slots are 0) and `nums2` (size `n`), merge `nums2` into `nums1` **in-place** in sorted order.\n\n**Fill from the back:** compare from the ends of both arrays and write the larger value at position `k = m+n-1`. This avoids overwriting unprocessed elements in `nums1`.",
        examples: [
          { input: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3", output: "[1,2,2,3,5,6]" },
          { input: "nums1 = [1], m = 1, nums2 = [], n = 0", output: "[1]" },
        ],
        constraints: ["nums1.length == m + n", "nums2.length == n", "0 <= m, n <= 200"],
        approach: "i = m-1, j = n-1, k = m+n-1. Compare nums1[i] and nums2[j], place larger at k. Continue until j < 0.",
        timeComplexity: "O(m + n)",
        spaceComplexity: "O(1)",
        solutions: [
          {
            language: "javascript",
            code: `function merge(nums1, m, nums2, n) {
  let i = m - 1, j = n - 1, k = m + n - 1;
  while (j >= 0) {
    if (i >= 0 && nums1[i] > nums2[j]) nums1[k--] = nums1[i--];
    else nums1[k--] = nums2[j--];
  }
}`,
          },
          {
            language: "typescript",
            code: `function merge(nums1: number[], m: number, nums2: number[], n: number): void {
  let i = m - 1, j = n - 1, k = m + n - 1;
  while (j >= 0) {
    if (i >= 0 && nums1[i] > nums2[j]) nums1[k--] = nums1[i--];
    else nums1[k--] = nums2[j--];
  }
}`,
          },
          {
            language: "php",
            code: `function merge(array &$nums1, int $m, array $nums2, int $n): void {
    $i = $m - 1; $j = $n - 1; $k = $m + $n - 1;
    while ($j >= 0) {
        if ($i >= 0 && $nums1[$i] > $nums2[$j]) $nums1[$k--] = $nums1[$i--];
        else $nums1[$k--] = $nums2[$j--];
    }
}`,
          },
          {
            language: "java",
            code: `public void merge(int[] nums1, int m, int[] nums2, int n) {
    int i = m - 1, j = n - 1, k = m + n - 1;
    while (j >= 0) {
        if (i >= 0 && nums1[i] > nums2[j]) nums1[k--] = nums1[i--];
        else nums1[k--] = nums2[j--];
    }
}`,
          },
          {
            language: "python",
            code: `def merge(nums1: list[int], m: int, nums2: list[int], n: int) -> None:
    i, j, k = m - 1, n - 1, m + n - 1
    while j >= 0:
        if i >= 0 and nums1[i] > nums2[j]:
            nums1[k] = nums1[i]; i -= 1
        else:
            nums1[k] = nums2[j]; j -= 1
        k -= 1`,
          },
        ],
      },
      {
        num: 82, title: "Two Sum II — Input Array Is Sorted", leetcodeNum: 167, slug: "two-sum-ii-input-array-is-sorted",
        pattern: "Two pointers on sorted array", visual: "Move left up or right down based on sum",
        difficulty: "medium",
        tags: ["Array", "Two Pointers", "Binary Search"],
        description: "Given a **1-indexed** sorted array `numbers`, find two numbers that add up to `target`. Return their 1-indexed positions. Use only **constant extra space**.\n\nSince the array is sorted, use two pointers from both ends. If `sum < target` → move left pointer right (increase sum). If `sum > target` → move right pointer left (decrease sum). Guaranteed exactly one solution.",
        examples: [
          { input: "numbers = [2,7,11,15], target = 9", output: "[1,2]", explanation: "numbers[0] + numbers[1] = 2 + 7 = 9." },
          { input: "numbers = [2,3,4], target = 6", output: "[1,3]" },
          { input: "numbers = [-1,0], target = -1", output: "[1,2]" },
        ],
        constraints: ["2 <= numbers.length <= 3 × 10^4", "-1000 <= numbers[i] <= 1000", "Exactly one solution exists"],
        approach: "left=0, right=n-1. If sum < target → left++. If sum > target → right--. If equal → return [left+1, right+1].",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        solutions: [
          {
            language: "javascript",
            code: `function twoSum(numbers, target) {
  let left = 0, right = numbers.length - 1;
  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) return [left + 1, right + 1];
    else if (sum < target) left++;
    else right--;
  }
}`,
          },
          {
            language: "typescript",
            code: `function twoSum(numbers: number[], target: number): number[] {
  let left = 0, right = numbers.length - 1;
  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) return [left + 1, right + 1];
    else if (sum < target) left++;
    else right--;
  }
  return [];
}`,
          },
          {
            language: "php",
            code: `function twoSum(array $numbers, int $target): array {
    $left = 0; $right = count($numbers) - 1;
    while ($left < $right) {
        $sum = $numbers[$left] + $numbers[$right];
        if ($sum === $target) return [$left + 1, $right + 1];
        elseif ($sum < $target) $left++;
        else $right--;
    }
    return [];
}`,
          },
          {
            language: "java",
            code: `public int[] twoSum(int[] numbers, int target) {
    int left = 0, right = numbers.length - 1;
    while (left < right) {
        int sum = numbers[left] + numbers[right];
        if (sum == target) return new int[]{left + 1, right + 1};
        else if (sum < target) left++;
        else right--;
    }
    return new int[]{};
}`,
          },
          {
            language: "python",
            code: `def twoSum(numbers: list[int], target: int) -> list[int]:
    left, right = 0, len(numbers) - 1
    while left < right:
        s = numbers[left] + numbers[right]
        if s == target: return [left + 1, right + 1]
        elif s < target: left += 1
        else: right -= 1
    return []`,
          },
        ],
      },
    ],
  },
  {
    id: "binary",
    name: "Binary",
    problems: [
      {
        num: 11, title: "Sum of Two Integers", leetcodeNum: 371, slug: "sum-of-two-integers",
        pattern: "Bit XOR + carry", visual: "a^b = sum w/o carry, (a&b)<<1 = carry",
        difficulty: "medium",
        tags: ["Bit Manipulation"],
        description: "Given two integers `a` and `b`, return the sum of the two integers **without using the operators `+` and `-`**.\n\nUse bitwise XOR to add bits without carry, and AND shifted left by 1 to compute the carry. Repeat until carry is zero.",
        examples: [
          { input: "a = 1, b = 2", output: "3" },
          { input: "a = 2, b = 3", output: "5" },
        ],
        constraints: ["-1000 <= a, b <= 1000"],
        approach: "XOR gives the sum without carry; AND<<1 gives the carry. Loop until carry is 0.",
        timeComplexity: "O(1)",
        spaceComplexity: "O(1)",
        solutions: [
          {
            language: "javascript",
            code: `function getSum(a, b) {
  while (b !== 0) {
    const carry = (a & b) << 1;
    a = a ^ b;
    b = carry;
  }
  return a;
}`,
          },
          {
            language: "typescript",
            code: `function getSum(a: number, b: number): number {
  while (b !== 0) {
    const carry = (a & b) << 1;
    a = a ^ b;
    b = carry;
  }
  return a;
}`,
          },
          {
            language: "php",
            code: `function getSum(int $a, int $b): int {
    while ($b !== 0) {
        $carry = ($a & $b) << 1;
        $a = $a ^ $b;
        $b = $carry;
    }
    return $a;
}`,
          },
          {
            language: "java",
            code: `public int getSum(int a, int b) {
    while (b != 0) {
        int carry = (a & b) << 1;
        a = a ^ b;
        b = carry;
    }
    return a;
}`,
          },
          {
            language: "python",
            code: `def getSum(a: int, b: int) -> int:
    mask = 0xFFFFFFFF
    while b & mask:
        carry = (a & b) << 1
        a = a ^ b
        b = carry
    # Handle negative numbers in Python
    return a if a <= 0x7FFFFFFF else ~(a ^ mask)`,
          },
        ],
      },
      {
        num: 12, title: "Number of 1 Bits", leetcodeNum: 191, slug: "number-of-1-bits",
        pattern: "n & (n−1) trick", visual: "Each step clears lowest set bit",
        difficulty: "easy",
        tags: ["Bit Manipulation"],
        description: "Write a function that takes the binary representation of a positive integer and returns the number of set bits it has (also known as the **Hamming weight**).\n\n**Key insight:** `n & (n-1)` always clears the lowest set bit of `n`. Count how many times you can do this before `n` reaches 0.",
        examples: [
          { input: "n = 11 (binary: 1011)", output: "3", explanation: "Three 1s in the binary representation." },
          { input: "n = 128 (binary: 10000000)", output: "1" },
        ],
        constraints: ["1 <= n <= 2^31 - 1"],
        approach: "Use n & (n-1) to clear the lowest set bit on each iteration. Count iterations until n = 0.",
        timeComplexity: "O(k) — k = number of set bits",
        spaceComplexity: "O(1)",
        solutions: [
          {
            language: "javascript",
            code: `function hammingWeight(n) {
  let count = 0;
  while (n !== 0) {
    n = n & (n - 1); // clear lowest set bit
    count++;
  }
  return count;
}`,
          },
          {
            language: "typescript",
            code: `function hammingWeight(n: number): number {
  let count = 0;
  while (n !== 0) {
    n = n & (n - 1);
    count++;
  }
  return count;
}`,
          },
          {
            language: "php",
            code: `function hammingWeight(int $n): int {
    $count = 0;
    while ($n !== 0) {
        $n = $n & ($n - 1);
        $count++;
    }
    return $count;
}`,
          },
          {
            language: "java",
            code: `public int hammingWeight(int n) {
    int count = 0;
    while (n != 0) {
        n &= (n - 1);
        count++;
    }
    return count;
}`,
          },
          {
            language: "python",
            code: `def hammingWeight(n: int) -> int:
    count = 0
    while n:
        n &= n - 1  # clear lowest set bit
        count += 1
    return count`,
          },
        ],
      },
      {
        num: 13, title: "Counting Bits", leetcodeNum: 338, slug: "counting-bits",
        pattern: "DP on bits", visual: "dp[i] = dp[i>>1] + (i&1)",
        difficulty: "easy",
        tags: ["Bit Manipulation", "Dynamic Programming"],
        description: "Given an integer `n`, return an array `ans` of length `n + 1` such that for each `i` (0 <= i <= n), `ans[i]` is the **number of 1's** in the binary representation of `i`.\n\n**Key insight:** `dp[i] = dp[i >> 1] + (i & 1)`. Right-shifting `i` removes the last bit (which was already counted), and `(i & 1)` checks if the last bit is 1.",
        examples: [
          { input: "n = 2", output: "[0,1,1]" },
          { input: "n = 5", output: "[0,1,1,2,1,2]" },
        ],
        constraints: ["0 <= n <= 10^5"],
        approach: "DP: each number's bit count = (count of number without last bit) + (last bit value).",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
        solutions: [
          {
            language: "javascript",
            code: `function countBits(n) {
  const dp = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    dp[i] = dp[i >> 1] + (i & 1);
  }
  return dp;
}`,
          },
          {
            language: "typescript",
            code: `function countBits(n: number): number[] {
  const dp: number[] = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    dp[i] = dp[i >> 1] + (i & 1);
  }
  return dp;
}`,
          },
          {
            language: "php",
            code: `function countBits(int $n): array {
    $dp = array_fill(0, $n + 1, 0);
    for ($i = 1; $i <= $n; $i++) {
        $dp[$i] = $dp[$i >> 1] + ($i & 1);
    }
    return $dp;
}`,
          },
          {
            language: "java",
            code: `public int[] countBits(int n) {
    int[] dp = new int[n + 1];
    for (int i = 1; i <= n; i++) {
        dp[i] = dp[i >> 1] + (i & 1);
    }
    return dp;
}`,
          },
          {
            language: "python",
            code: `def countBits(n: int) -> list[int]:
    dp = [0] * (n + 1)
    for i in range(1, n + 1):
        dp[i] = dp[i >> 1] + (i & 1)
    return dp`,
          },
        ],
      },
      {
        num: 14, title: "Missing Number", leetcodeNum: 268, slug: "missing-number",
        pattern: "XOR or sum", visual: "XOR all indices and values",
        difficulty: "easy",
        tags: ["Array", "Bit Manipulation", "Math"],
        description: "Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the **only number in the range that is missing** from the array.\n\n**XOR approach:** XOR all indices (0..n) with all values. Each number that appears cancels out, leaving only the missing number.\n\n**Math approach:** Expected sum = n*(n+1)/2. Return expected - actual sum.",
        examples: [
          { input: "nums = [3,0,1]", output: "2", explanation: "n = 3. Numbers 0,1,3 are present; 2 is missing." },
          { input: "nums = [9,6,4,2,3,5,7,0,1]", output: "8" },
        ],
        constraints: ["n == nums.length", "1 <= n <= 10^4", "0 <= nums[i] <= n", "All numbers are unique"],
        approach: "XOR every index 0..n with every element. Paired values cancel; the unpaired one is the answer.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        solutions: [
          {
            language: "javascript",
            code: `function missingNumber(nums) {
  let result = nums.length;
  for (let i = 0; i < nums.length; i++) {
    result ^= i ^ nums[i];
  }
  return result;
}`,
          },
          {
            language: "typescript",
            code: `function missingNumber(nums: number[]): number {
  let result = nums.length;
  for (let i = 0; i < nums.length; i++) {
    result ^= i ^ nums[i];
  }
  return result;
}`,
          },
          {
            language: "php",
            code: `function missingNumber(array $nums): int {
    $result = count($nums);
    foreach ($nums as $i => $v) {
        $result ^= $i ^ $v;
    }
    return $result;
}`,
          },
          {
            language: "java",
            code: `public int missingNumber(int[] nums) {
    int result = nums.length;
    for (int i = 0; i < nums.length; i++) {
        result ^= i ^ nums[i];
    }
    return result;
}`,
          },
          {
            language: "python",
            code: `def missingNumber(nums: list[int]) -> int:
    result = len(nums)
    for i, v in enumerate(nums):
        result ^= i ^ v
    return result`,
          },
        ],
      },
      {
        num: 15, title: "Reverse Bits", leetcodeNum: 190, slug: "reverse-bits",
        pattern: "Bit shift loop", visual: "Pull LSB → push to result MSB",
        difficulty: "easy",
        tags: ["Bit Manipulation"],
        description: "Reverse the bits of a given 32-bit unsigned integer.\n\nFor each of the 32 bit positions, pull the **least significant bit** of `n` and push it into the **most significant** position of `result`. Shift `n` right and `result` left on each iteration.",
        examples: [
          { input: "n = 00000010100101000001111010011100", output: "964176192 (00111001011110000010100101000000)", explanation: "The bits are reversed." },
          { input: "n = 11111111111111111111111111111101", output: "3221225471 (10111111111111111111111111111111)" },
        ],
        constraints: ["The input must be a binary string of length 32"],
        approach: "Loop 32 times: shift result left, OR in the last bit of n, then shift n right.",
        timeComplexity: "O(1)",
        spaceComplexity: "O(1)",
        solutions: [
          {
            language: "javascript",
            code: `function reverseBits(n) {
  let result = 0;
  for (let i = 0; i < 32; i++) {
    result = (result * 2) + (n & 1);
    n = Math.floor(n / 2);
  }
  return result >>> 0; // ensure unsigned 32-bit
}`,
          },
          {
            language: "typescript",
            code: `function reverseBits(n: number): number {
  let result = 0;
  for (let i = 0; i < 32; i++) {
    result = (result * 2) + (n & 1);
    n = Math.floor(n / 2);
  }
  return result >>> 0;
}`,
          },
          {
            language: "php",
            code: `function reverseBits(int $n): int {
    $result = 0;
    for ($i = 0; $i < 32; $i++) {
        $result = ($result << 1) | ($n & 1);
        $n >>= 1;
    }
    return $result;
}`,
          },
          {
            language: "java",
            code: `public int reverseBits(int n) {
    int result = 0;
    for (int i = 0; i < 32; i++) {
        result = (result << 1) | (n & 1);
        n >>>= 1;
    }
    return result;
}`,
          },
          {
            language: "python",
            code: `def reverseBits(n: int) -> int:
    result = 0
    for _ in range(32):
        result = (result << 1) | (n & 1)
        n >>= 1
    return result`,
          },
        ],
      },
    ],
  },
  {
    id: "dynamic-programming",
    name: "Dynamic Programming",
    problems: [
      {
        num: 16, title: "Climbing Stairs", leetcodeNum: 70, slug: "climbing-stairs",
        pattern: "Fibonacci DP", visual: "dp[i] = dp[i−1] + dp[i−2]",
        difficulty: "easy",
        tags: ["Dynamic Programming"],
        description: "You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb `1` or `2` steps. In how many **distinct ways** can you climb to the top?\n\nThis is the Fibonacci sequence in disguise: the number of ways to reach step `i` equals the ways to reach `i-1` (take 1 step) plus the ways to reach `i-2` (take 2 steps).",
        examples: [
          { input: "n = 2", output: "2", explanation: "Two ways: 1+1, 2." },
          { input: "n = 3", output: "3", explanation: "Three ways: 1+1+1, 1+2, 2+1." },
        ],
        constraints: ["1 <= n <= 45"],
        approach: "Use two variables (prev, curr) rolling forward. curr = prev + curr each step — O(1) space.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        solutions: [
          {
            language: "javascript",
            code: `function climbStairs(n) {
  if (n <= 2) return n;
  let prev = 1, curr = 2;
  for (let i = 3; i <= n; i++) {
    [prev, curr] = [curr, prev + curr];
  }
  return curr;
}`,
          },
          {
            language: "typescript",
            code: `function climbStairs(n: number): number {
  if (n <= 2) return n;
  let prev = 1, curr = 2;
  for (let i = 3; i <= n; i++) {
    [prev, curr] = [curr, prev + curr];
  }
  return curr;
}`,
          },
          {
            language: "php",
            code: `function climbStairs(int $n): int {
    if ($n <= 2) return $n;
    $prev = 1; $curr = 2;
    for ($i = 3; $i <= $n; $i++) {
        [$prev, $curr] = [$curr, $prev + $curr];
    }
    return $curr;
}`,
          },
          {
            language: "java",
            code: `public int climbStairs(int n) {
    if (n <= 2) return n;
    int prev = 1, curr = 2;
    for (int i = 3; i <= n; i++) {
        int next = prev + curr;
        prev = curr;
        curr = next;
    }
    return curr;
}`,
          },
          {
            language: "python",
            code: `def climbStairs(n: int) -> int:
    if n <= 2:
        return n
    prev, curr = 1, 2
    for _ in range(3, n + 1):
        prev, curr = curr, prev + curr
    return curr`,
          },
        ],
      },
      {
        num: 17, title: "Coin Change", leetcodeNum: 322, slug: "coin-change",
        pattern: "Unbounded knapsack", visual: "dp[a] = min(dp[a−c] + 1)",
        difficulty: "medium",
        tags: ["Dynamic Programming"],
        description: "You are given an integer array `coins` representing coins of different denominations and an integer `amount`. Return the **fewest number of coins** needed to make up that amount. If no combination is possible, return `-1`.\n\nBuild a DP array where `dp[a]` = minimum coins to make amount `a`. For each amount, try every coin and take the minimum.",
        examples: [
          { input: "coins = [1,2,5], amount = 11", output: "3", explanation: "5 + 5 + 1 = 11, using 3 coins." },
          { input: "coins = [2], amount = 3", output: "-1" },
        ],
        constraints: ["1 <= coins.length <= 12", "1 <= coins[i] <= 2^31 - 1", "0 <= amount <= 10^4"],
        approach: "dp[0] = 0; dp[a] = min(dp[a - c] + 1) for each coin c. Initialize all to amount+1 (infinity).",
        timeComplexity: "O(amount × coins)",
        spaceComplexity: "O(amount)",
        solutions: [
          {
            language: "javascript",
            code: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(amount + 1);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const c of coins) {
      if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);
    }
  }
  return dp[amount] > amount ? -1 : dp[amount];
}`,
          },
          {
            language: "typescript",
            code: `function coinChange(coins: number[], amount: number): number {
  const dp: number[] = new Array(amount + 1).fill(amount + 1);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const c of coins) {
      if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);
    }
  }
  return dp[amount] > amount ? -1 : dp[amount];
}`,
          },
          {
            language: "php",
            code: `function coinChange(array $coins, int $amount): int {
    $dp = array_fill(0, $amount + 1, $amount + 1);
    $dp[0] = 0;
    for ($a = 1; $a <= $amount; $a++) {
        foreach ($coins as $c) {
            if ($c <= $a) {
                $dp[$a] = min($dp[$a], $dp[$a - $c] + 1);
            }
        }
    }
    return $dp[$amount] > $amount ? -1 : $dp[$amount];
}`,
          },
          {
            language: "java",
            code: `public int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);
    dp[0] = 0;
    for (int a = 1; a <= amount; a++) {
        for (int c : coins) {
            if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}`,
          },
          {
            language: "python",
            code: `def coinChange(coins: list[int], amount: int) -> int:
    dp = [amount + 1] * (amount + 1)
    dp[0] = 0
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a:
                dp[a] = min(dp[a], dp[a - c] + 1)
    return -1 if dp[amount] > amount else dp[amount]`,
          },
        ],
      },
      {
        num: 18, title: "Longest Increasing Subsequence", leetcodeNum: 300, slug: "longest-increasing-subsequence",
        pattern: "DP O(n²) / patience sort", visual: "Tails array + binary search",
        difficulty: "medium",
        tags: ["Dynamic Programming", "Binary Search"],
        description: "Given an integer array `nums`, return the length of the **longest strictly increasing subsequence**.\n\n**O(n log n) patience sort approach:** Maintain a `tails` array where `tails[i]` is the smallest tail element for all increasing subsequences of length `i+1`. Use binary search to find where to place each number.",
        examples: [
          { input: "nums = [10,9,2,5,3,7,101,18]", output: "4", explanation: "[2,3,7,101] is the LIS." },
          { input: "nums = [0,1,0,3,2,3]", output: "4" },
        ],
        constraints: ["1 <= nums.length <= 2500", "-10^4 <= nums[i] <= 10^4"],
        approach: "Binary search for the insertion point of each number in tails[]. The tails array length = LIS length.",
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(n)",
        solutions: [
          {
            language: "javascript",
            code: `function lengthOfLIS(nums) {
  const tails = [];
  for (const num of nums) {
    let lo = 0, hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < num) lo = mid + 1;
      else hi = mid;
    }
    tails[lo] = num;
  }
  return tails.length;
}`,
          },
          {
            language: "typescript",
            code: `function lengthOfLIS(nums: number[]): number {
  const tails: number[] = [];
  for (const num of nums) {
    let lo = 0, hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < num) lo = mid + 1;
      else hi = mid;
    }
    tails[lo] = num;
  }
  return tails.length;
}`,
          },
          {
            language: "php",
            code: `function lengthOfLIS(array $nums): int {
    $tails = [];
    foreach ($nums as $num) {
        $lo = 0; $hi = count($tails);
        while ($lo < $hi) {
            $mid = ($lo + $hi) >> 1;
            if ($tails[$mid] < $num) $lo = $mid + 1;
            else $hi = $mid;
        }
        $tails[$lo] = $num;
    }
    return count($tails);
}`,
          },
          {
            language: "java",
            code: `public int lengthOfLIS(int[] nums) {
    List<Integer> tails = new ArrayList<>();
    for (int num : nums) {
        int lo = 0, hi = tails.size();
        while (lo < hi) {
            int mid = (lo + hi) / 2;
            if (tails.get(mid) < num) lo = mid + 1;
            else hi = mid;
        }
        if (lo == tails.size()) tails.add(num);
        else tails.set(lo, num);
    }
    return tails.size();
}`,
          },
          {
            language: "python",
            code: `import bisect

def lengthOfLIS(nums: list[int]) -> int:
    tails = []
    for num in nums:
        pos = bisect.bisect_left(tails, num)
        if pos == len(tails):
            tails.append(num)
        else:
            tails[pos] = num
    return len(tails)`,
          },
        ],
      },
      {
        num: 19, title: "Longest Common Subsequence", leetcodeNum: 1143, slug: "longest-common-subsequence",
        pattern: "2D DP grid", visual: "Match → diag+1, else max(↑, ←)",
        difficulty: "medium",
        tags: ["Dynamic Programming", "String"],
        description: "Given two strings `text1` and `text2`, return the length of their **longest common subsequence**. If there is no common subsequence, return `0`.\n\nBuild a 2D DP table: `dp[i][j]` = LCS of `text1[0..i-1]` and `text2[0..j-1]`.\n- If chars match: `dp[i][j] = dp[i-1][j-1] + 1`\n- Else: `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`",
        examples: [
          { input: 'text1 = "abcde", text2 = "ace"', output: "3", explanation: '"ace" is the LCS.' },
          { input: 'text1 = "abc", text2 = "abc"', output: "3" },
          { input: 'text1 = "abc", text2 = "def"', output: "0" },
        ],
        constraints: ["1 <= text1.length, text2.length <= 1000", "text1 and text2 consist of only lowercase English characters"],
        approach: "Fill 2D DP table row by row. dp[i][j] = dp[i-1][j-1]+1 if match, else max(dp[i-1][j], dp[i][j-1]).",
        timeComplexity: "O(m × n)",
        spaceComplexity: "O(m × n)",
        solutions: [
          {
            language: "javascript",
            code: `function longestCommonSubsequence(text1, text2) {
  const m = text1.length, n = text2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) dp[i][j] = dp[i-1][j-1] + 1;
      else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
    }
  }
  return dp[m][n];
}`,
          },
          {
            language: "typescript",
            code: `function longestCommonSubsequence(text1: string, text2: string): number {
  const m = text1.length, n = text2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) dp[i][j] = dp[i-1][j-1] + 1;
      else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
    }
  }
  return dp[m][n];
}`,
          },
          {
            language: "php",
            code: `function longestCommonSubsequence(string $text1, string $text2): int {
    $m = strlen($text1); $n = strlen($text2);
    $dp = array_fill(0, $m + 1, array_fill(0, $n + 1, 0));
    for ($i = 1; $i <= $m; $i++) {
        for ($j = 1; $j <= $n; $j++) {
            if ($text1[$i-1] === $text2[$j-1]) $dp[$i][$j] = $dp[$i-1][$j-1] + 1;
            else $dp[$i][$j] = max($dp[$i-1][$j], $dp[$i][$j-1]);
        }
    }
    return $dp[$m][$n];
}`,
          },
          {
            language: "java",
            code: `public int longestCommonSubsequence(String text1, String text2) {
    int m = text1.length(), n = text2.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (text1.charAt(i-1) == text2.charAt(j-1)) dp[i][j] = dp[i-1][j-1] + 1;
            else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
        }
    }
    return dp[m][n];
}`,
          },
          {
            language: "python",
            code: `def longestCommonSubsequence(text1: str, text2: str) -> int:
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]`,
          },
        ],
      },
      {
        num: 20, title: "Word Break", leetcodeNum: 139, slug: "word-break",
        pattern: "DP over prefixes", visual: "dp[i] true if any dp[j] & s[j:i] in dict",
        difficulty: "medium",
        tags: ["Dynamic Programming", "String", "Hash Table"],
        description: "Given a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words.\n\n`dp[i]` = can we segment `s[0..i-1]`? For each position `i`, check every `j < i`: if `dp[j]` is true and `s[j..i-1]` is in the dictionary, then `dp[i] = true`.",
        examples: [
          { input: 's = "leetcode", wordDict = ["leet","code"]', output: "true", explanation: '"leet" + "code".' },
          { input: 's = "applepenapple", wordDict = ["apple","pen"]', output: "true" },
          { input: 's = "catsandog", wordDict = ["cats","dog","sand","and","cat"]', output: "false" },
        ],
        constraints: ["1 <= s.length <= 300", "1 <= wordDict.length <= 1000"],
        approach: "dp[0] = true. For each end index i, try every start j where dp[j] is true and s[j..i] is in the word set.",
        timeComplexity: "O(n²)",
        spaceComplexity: "O(n)",
        solutions: [
          {
            language: "javascript",
            code: `function wordBreak(s, wordDict) {
  const wordSet = new Set(wordDict);
  const dp = new Array(s.length + 1).fill(false);
  dp[0] = true;
  for (let i = 1; i <= s.length; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && wordSet.has(s.slice(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }
  return dp[s.length];
}`,
          },
          {
            language: "typescript",
            code: `function wordBreak(s: string, wordDict: string[]): boolean {
  const wordSet = new Set(wordDict);
  const dp: boolean[] = new Array(s.length + 1).fill(false);
  dp[0] = true;
  for (let i = 1; i <= s.length; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && wordSet.has(s.slice(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }
  return dp[s.length];
}`,
          },
          {
            language: "php",
            code: `function wordBreak(string $s, array $wordDict): bool {
    $wordSet = array_flip($wordDict);
    $n = strlen($s);
    $dp = array_fill(0, $n + 1, false);
    $dp[0] = true;
    for ($i = 1; $i <= $n; $i++) {
        for ($j = 0; $j < $i; $j++) {
            if ($dp[$j] && isset($wordSet[substr($s, $j, $i - $j)])) {
                $dp[$i] = true;
                break;
            }
        }
    }
    return $dp[$n];
}`,
          },
          {
            language: "java",
            code: `public boolean wordBreak(String s, List<String> wordDict) {
    Set<String> wordSet = new HashSet<>(wordDict);
    int n = s.length();
    boolean[] dp = new boolean[n + 1];
    dp[0] = true;
    for (int i = 1; i <= n; i++) {
        for (int j = 0; j < i; j++) {
            if (dp[j] && wordSet.contains(s.substring(j, i))) {
                dp[i] = true;
                break;
            }
        }
    }
    return dp[n];
}`,
          },
          {
            language: "python",
            code: `def wordBreak(s: str, wordDict: list[str]) -> bool:
    word_set = set(wordDict)
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True
    for i in range(1, n + 1):
        for j in range(i):
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break
    return dp[n]`,
          },
        ],
      },
      {
        num: 21, title: "Combination Sum", leetcodeNum: 39, slug: "combination-sum",
        pattern: "Backtracking", visual: "DFS, reuse i (unbounded), prune by sum",
        difficulty: "medium",
        tags: ["Array", "Backtracking"],
        description: "Given an array of **distinct** integers `candidates` and a target integer `target`, return a list of all **unique combinations** of candidates where the chosen numbers sum to `target`. You may use the same number **unlimited times**.\n\nUse DFS backtracking: at each step pick a candidate, subtract from remaining target, recurse. Start each recursive call from the **same index** (not i+1) to allow reuse.",
        examples: [
          { input: "candidates = [2,3,6,7], target = 7", output: "[[2,2,3],[7]]" },
          { input: "candidates = [2,3,5], target = 8", output: "[[2,2,2,2],[2,3,3],[3,5]]" },
        ],
        constraints: ["1 <= candidates.length <= 30", "2 <= candidates[i] <= 40", "1 <= target <= 40"],
        approach: "Sort candidates, then DFS. At each position, try candidates[i..end]. Prune if candidate > remaining.",
        timeComplexity: "O(n^(t/m)) — t = target, m = min candidate",
        spaceComplexity: "O(t/m)",
        solutions: [
          {
            language: "javascript",
            code: `function combinationSum(candidates, target) {
  candidates.sort((a, b) => a - b);
  const result = [];
  function dfs(start, current, remaining) {
    if (remaining === 0) { result.push([...current]); return; }
    for (let i = start; i < candidates.length; i++) {
      if (candidates[i] > remaining) break;
      current.push(candidates[i]);
      dfs(i, current, remaining - candidates[i]);
      current.pop();
    }
  }
  dfs(0, [], target);
  return result;
}`,
          },
          {
            language: "typescript",
            code: `function combinationSum(candidates: number[], target: number): number[][] {
  candidates.sort((a, b) => a - b);
  const result: number[][] = [];
  function dfs(start: number, current: number[], remaining: number): void {
    if (remaining === 0) { result.push([...current]); return; }
    for (let i = start; i < candidates.length; i++) {
      if (candidates[i] > remaining) break;
      current.push(candidates[i]);
      dfs(i, current, remaining - candidates[i]);
      current.pop();
    }
  }
  dfs(0, [], target);
  return result;
}`,
          },
          {
            language: "php",
            code: `function combinationSum(array $candidates, int $target): array {
    sort($candidates);
    $result = [];
    function dfs(array $candidates, int $start, array &$current, int $remaining, array &$result): void {
        if ($remaining === 0) { $result[] = $current; return; }
        for ($i = $start; $i < count($candidates); $i++) {
            if ($candidates[$i] > $remaining) break;
            $current[] = $candidates[$i];
            dfs($candidates, $i, $current, $remaining - $candidates[$i], $result);
            array_pop($current);
        }
    }
    dfs($candidates, 0, $current, $target, $result);
    return $result;
}`,
          },
          {
            language: "java",
            code: `public List<List<Integer>> combinationSum(int[] candidates, int target) {
    Arrays.sort(candidates);
    List<List<Integer>> result = new ArrayList<>();
    dfs(candidates, 0, new ArrayList<>(), target, result);
    return result;
}
private void dfs(int[] c, int start, List<Integer> cur, int rem, List<List<Integer>> res) {
    if (rem == 0) { res.add(new ArrayList<>(cur)); return; }
    for (int i = start; i < c.length; i++) {
        if (c[i] > rem) break;
        cur.add(c[i]);
        dfs(c, i, cur, rem - c[i], res);
        cur.remove(cur.size() - 1);
    }
}`,
          },
          {
            language: "python",
            code: `def combinationSum(candidates: list[int], target: int) -> list[list[int]]:
    candidates.sort()
    result = []
    def dfs(start, current, remaining):
        if remaining == 0:
            result.append(list(current))
            return
        for i in range(start, len(candidates)):
            if candidates[i] > remaining:
                break
            current.append(candidates[i])
            dfs(i, current, remaining - candidates[i])
            current.pop()
    dfs(0, [], target)
    return result`,
          },
        ],
      },
      {
        num: 22, title: "House Robber", leetcodeNum: 198, slug: "house-robber",
        pattern: "DP pick / skip", visual: "dp[i] = max(dp[i−1], dp[i−2] + x)",
        difficulty: "medium",
        tags: ["Dynamic Programming"],
        description: "You are a professional robber. Given an integer array `nums` where `nums[i]` represents the amount of money of the i-th house, return the **maximum amount you can rob** without robbing two adjacent houses.\n\nAt each house: either **skip it** (take the previous max) or **rob it** (add to the max two houses back).",
        examples: [
          { input: "nums = [1,2,3,1]", output: "4", explanation: "Rob house 1 (1) + house 3 (3) = 4." },
          { input: "nums = [2,7,9,3,1]", output: "12", explanation: "Rob house 1+3+5 = 2+9+1 = 12." },
        ],
        constraints: ["1 <= nums.length <= 100", "0 <= nums[i] <= 400"],
        approach: "Track two variables (prev2, prev1). For each house: new = max(prev1, prev2 + nums[i]).",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        solutions: [
          {
            language: "javascript",
            code: `function rob(nums) {
  let prev2 = 0, prev1 = 0;
  for (const n of nums) {
    const curr = Math.max(prev1, prev2 + n);
    prev2 = prev1;
    prev1 = curr;
  }
  return prev1;
}`,
          },
          {
            language: "typescript",
            code: `function rob(nums: number[]): number {
  let prev2 = 0, prev1 = 0;
  for (const n of nums) {
    const curr = Math.max(prev1, prev2 + n);
    prev2 = prev1;
    prev1 = curr;
  }
  return prev1;
}`,
          },
          {
            language: "php",
            code: `function rob(array $nums): int {
    $prev2 = 0; $prev1 = 0;
    foreach ($nums as $n) {
        $curr = max($prev1, $prev2 + $n);
        $prev2 = $prev1;
        $prev1 = $curr;
    }
    return $prev1;
}`,
          },
          {
            language: "java",
            code: `public int rob(int[] nums) {
    int prev2 = 0, prev1 = 0;
    for (int n : nums) {
        int curr = Math.max(prev1, prev2 + n);
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}`,
          },
          {
            language: "python",
            code: `def rob(nums: list[int]) -> int:
    prev2 = prev1 = 0
    for n in nums:
        curr = max(prev1, prev2 + n)
        prev2, prev1 = prev1, curr
    return prev1`,
          },
        ],
      },
      {
        num: 23, title: "House Robber II", leetcodeNum: 213, slug: "house-robber-ii",
        pattern: "Circular DP", visual: "Run #198 on [0..n−2] and [1..n−1]",
        difficulty: "medium",
        tags: ["Dynamic Programming"],
        description: "All houses are arranged in a **circle** (first and last are adjacent). Return the maximum amount you can rob without robbing two adjacent houses.\n\nSince first and last can't both be robbed, run the House Robber I algorithm **twice**: once on `nums[0..n-2]` and once on `nums[1..n-1]`, then return the max of both results.",
        examples: [
          { input: "nums = [2,3,2]", output: "3", explanation: "Cannot rob house 1 and 3 together (adjacent in circle)." },
          { input: "nums = [1,2,3,1]", output: "4" },
        ],
        constraints: ["1 <= nums.length <= 100", "0 <= nums[i] <= 1000"],
        approach: "Reduce to two House Robber I runs excluding one endpoint each time.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        solutions: [
          {
            language: "javascript",
            code: `function rob(nums) {
  if (nums.length === 1) return nums[0];
  function robRange(arr, lo, hi) {
    let prev2 = 0, prev1 = 0;
    for (let i = lo; i <= hi; i++) {
      const curr = Math.max(prev1, prev2 + arr[i]);
      prev2 = prev1; prev1 = curr;
    }
    return prev1;
  }
  return Math.max(robRange(nums, 0, nums.length - 2), robRange(nums, 1, nums.length - 1));
}`,
          },
          {
            language: "typescript",
            code: `function rob(nums: number[]): number {
  if (nums.length === 1) return nums[0];
  function robRange(arr: number[], lo: number, hi: number): number {
    let prev2 = 0, prev1 = 0;
    for (let i = lo; i <= hi; i++) {
      const curr = Math.max(prev1, prev2 + arr[i]);
      prev2 = prev1; prev1 = curr;
    }
    return prev1;
  }
  return Math.max(robRange(nums, 0, nums.length - 2), robRange(nums, 1, nums.length - 1));
}`,
          },
          {
            language: "php",
            code: `function rob(array $nums): int {
    if (count($nums) === 1) return $nums[0];
    function robRange(array $arr, int $lo, int $hi): int {
        $prev2 = 0; $prev1 = 0;
        for ($i = $lo; $i <= $hi; $i++) {
            $curr = max($prev1, $prev2 + $arr[$i]);
            $prev2 = $prev1; $prev1 = $curr;
        }
        return $prev1;
    }
    $n = count($nums);
    return max(robRange($nums, 0, $n - 2), robRange($nums, 1, $n - 1));
}`,
          },
          {
            language: "java",
            code: `public int rob(int[] nums) {
    if (nums.length == 1) return nums[0];
    return Math.max(robRange(nums, 0, nums.length - 2), robRange(nums, 1, nums.length - 1));
}
private int robRange(int[] nums, int lo, int hi) {
    int prev2 = 0, prev1 = 0;
    for (int i = lo; i <= hi; i++) {
        int curr = Math.max(prev1, prev2 + nums[i]);
        prev2 = prev1; prev1 = curr;
    }
    return prev1;
}`,
          },
          {
            language: "python",
            code: `def rob(nums: list[int]) -> int:
    if len(nums) == 1:
        return nums[0]
    def rob_range(arr):
        prev2 = prev1 = 0
        for n in arr:
            curr = max(prev1, prev2 + n)
            prev2, prev1 = prev1, curr
        return prev1
    return max(rob_range(nums[:-1]), rob_range(nums[1:]))`,
          },
        ],
      },
      {
        num: 24, title: "Decode Ways", leetcodeNum: 91, slug: "decode-ways",
        pattern: "DP on string", visual: "Check 1-digit & 2-digit validity",
        difficulty: "medium",
        tags: ["Dynamic Programming", "String"],
        description: "A string of digits can be decoded as letters: '1'→'A', '2'→'B', ..., '26'→'Z'. Given a string `s` of digits, return the **number of ways to decode it**.\n\n`dp[i]` = number of ways to decode `s[0..i-1]`.\n- If `s[i-1]` != '0': `dp[i] += dp[i-1]` (single digit decode)\n- If `s[i-2..i-1]` is in '10'..'26': `dp[i] += dp[i-2]` (two digit decode)",
        examples: [
          { input: 's = "12"', output: "2", explanation: '"AB" (1+2) or "L" (12).' },
          { input: 's = "226"', output: "3", explanation: '"BZ" (2+26), "VF" (22+6), "BBF" (2+2+6).' },
          { input: 's = "06"', output: "0" },
        ],
        constraints: ["1 <= s.length <= 100", "s contains only digits", "s may contain leading zeros"],
        approach: "dp[0]=1, dp[1]=s[0]!='0'?1:0. Fill forward checking one- and two-digit windows.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
        solutions: [
          {
            language: "javascript",
            code: `function numDecodings(s) {
  const n = s.length;
  const dp = new Array(n + 1).fill(0);
  dp[0] = 1;
  dp[1] = s[0] !== '0' ? 1 : 0;
  for (let i = 2; i <= n; i++) {
    const one = parseInt(s[i - 1]);
    const two = parseInt(s.slice(i - 2, i));
    if (one >= 1) dp[i] += dp[i - 1];
    if (two >= 10 && two <= 26) dp[i] += dp[i - 2];
  }
  return dp[n];
}`,
          },
          {
            language: "typescript",
            code: `function numDecodings(s: string): number {
  const n = s.length;
  const dp: number[] = new Array(n + 1).fill(0);
  dp[0] = 1;
  dp[1] = s[0] !== '0' ? 1 : 0;
  for (let i = 2; i <= n; i++) {
    const one = parseInt(s[i - 1]);
    const two = parseInt(s.slice(i - 2, i));
    if (one >= 1) dp[i] += dp[i - 1];
    if (two >= 10 && two <= 26) dp[i] += dp[i - 2];
  }
  return dp[n];
}`,
          },
          {
            language: "php",
            code: `function numDecodings(string $s): int {
    $n = strlen($s);
    $dp = array_fill(0, $n + 1, 0);
    $dp[0] = 1;
    $dp[1] = $s[0] !== '0' ? 1 : 0;
    for ($i = 2; $i <= $n; $i++) {
        $one = intval($s[$i - 1]);
        $two = intval(substr($s, $i - 2, 2));
        if ($one >= 1) $dp[$i] += $dp[$i - 1];
        if ($two >= 10 && $two <= 26) $dp[$i] += $dp[$i - 2];
    }
    return $dp[$n];
}`,
          },
          {
            language: "java",
            code: `public int numDecodings(String s) {
    int n = s.length();
    int[] dp = new int[n + 1];
    dp[0] = 1;
    dp[1] = s.charAt(0) != '0' ? 1 : 0;
    for (int i = 2; i <= n; i++) {
        int one = s.charAt(i - 1) - '0';
        int two = Integer.parseInt(s.substring(i - 2, i));
        if (one >= 1) dp[i] += dp[i - 1];
        if (two >= 10 && two <= 26) dp[i] += dp[i - 2];
    }
    return dp[n];
}`,
          },
          {
            language: "python",
            code: `def numDecodings(s: str) -> int:
    n = len(s)
    dp = [0] * (n + 1)
    dp[0] = 1
    dp[1] = 1 if s[0] != '0' else 0
    for i in range(2, n + 1):
        one = int(s[i-1])
        two = int(s[i-2:i])
        if one >= 1:
            dp[i] += dp[i-1]
        if 10 <= two <= 26:
            dp[i] += dp[i-2]
    return dp[n]`,
          },
        ],
      },
      {
        num: 25, title: "Unique Paths", leetcodeNum: 62, slug: "unique-paths",
        pattern: "Grid DP", visual: "dp[i][j] = dp[i−1][j] + dp[i][j−1]",
        difficulty: "medium",
        tags: ["Dynamic Programming", "Math"],
        description: "A robot starts at the **top-left** corner of an `m x n` grid and tries to reach the **bottom-right** corner. It can only move **right** or **down**. How many unique paths are there?\n\n`dp[i][j]` = number of ways to reach cell `(i, j)` = ways from above + ways from left. First row and first column are all 1 (only one path — go straight).",
        examples: [
          { input: "m = 3, n = 7", output: "28" },
          { input: "m = 3, n = 2", output: "3", explanation: "R→D→D, D→R→D, D→D→R." },
        ],
        constraints: ["1 <= m, n <= 100"],
        approach: "Use 1D DP (rolling row). dp[j] += dp[j-1] for each row. Initialize all 1s.",
        timeComplexity: "O(m × n)",
        spaceComplexity: "O(n)",
        solutions: [
          {
            language: "javascript",
            code: `function uniquePaths(m, n) {
  const dp = new Array(n).fill(1);
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[j] += dp[j - 1];
    }
  }
  return dp[n - 1];
}`,
          },
          {
            language: "typescript",
            code: `function uniquePaths(m: number, n: number): number {
  const dp: number[] = new Array(n).fill(1);
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[j] += dp[j - 1];
    }
  }
  return dp[n - 1];
}`,
          },
          {
            language: "php",
            code: `function uniquePaths(int $m, int $n): int {
    $dp = array_fill(0, $n, 1);
    for ($i = 1; $i < $m; $i++) {
        for ($j = 1; $j < $n; $j++) {
            $dp[$j] += $dp[$j - 1];
        }
    }
    return $dp[$n - 1];
}`,
          },
          {
            language: "java",
            code: `public int uniquePaths(int m, int n) {
    int[] dp = new int[n];
    Arrays.fill(dp, 1);
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            dp[j] += dp[j - 1];
        }
    }
    return dp[n - 1];
}`,
          },
          {
            language: "python",
            code: `def uniquePaths(m: int, n: int) -> int:
    dp = [1] * n
    for _ in range(1, m):
        for j in range(1, n):
            dp[j] += dp[j - 1]
    return dp[n - 1]`,
          },
        ],
      },
      {
        num: 26, title: "Jump Game", leetcodeNum: 55, slug: "jump-game",
        pattern: "Greedy reach", visual: "Track furthest reachable index",
        difficulty: "medium",
        tags: ["Array", "Greedy"],
        description: "You are given an integer array `nums`. You are initially positioned at index 0. Each element `nums[i]` represents the **maximum jump length** from that position. Return `true` if you can reach the last index.\n\n**Greedy:** Track the **furthest reachable index** so far. At each index, if you're still within reach, update the furthest. If furthest >= last index, return true.",
        examples: [
          { input: "nums = [2,3,1,1,4]", output: "true", explanation: "Jump 1 step from 0 to 1, then 3 steps to the last index." },
          { input: "nums = [3,2,1,0,4]", output: "false", explanation: "Always stuck at index 3." },
        ],
        constraints: ["1 <= nums.length <= 10^4", "0 <= nums[i] <= 10^5"],
        approach: "Track maxReach. If i > maxReach, return false. Otherwise update maxReach = max(maxReach, i + nums[i]).",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        solutions: [
          {
            language: "javascript",
            code: `function canJump(nums) {
  let maxReach = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) return false;
    maxReach = Math.max(maxReach, i + nums[i]);
  }
  return true;
}`,
          },
          {
            language: "typescript",
            code: `function canJump(nums: number[]): boolean {
  let maxReach = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) return false;
    maxReach = Math.max(maxReach, i + nums[i]);
  }
  return true;
}`,
          },
          {
            language: "php",
            code: `function canJump(array $nums): bool {
    $maxReach = 0;
    foreach ($nums as $i => $v) {
        if ($i > $maxReach) return false;
        $maxReach = max($maxReach, $i + $v);
    }
    return true;
}`,
          },
          {
            language: "java",
            code: `public boolean canJump(int[] nums) {
    int maxReach = 0;
    for (int i = 0; i < nums.length; i++) {
        if (i > maxReach) return false;
        maxReach = Math.max(maxReach, i + nums[i]);
    }
    return true;
}`,
          },
          {
            language: "python",
            code: `def canJump(nums: list[int]) -> bool:
    max_reach = 0
    for i, v in enumerate(nums):
        if i > max_reach:
            return False
        max_reach = max(max_reach, i + v)
    return True`,
          },
        ],
      },
    ],
  },
  {
    id: "graph",
    name: "Graph",
    problems: [
      {
        num: 27, title: "Clone Graph", leetcodeNum: 133, slug: "clone-graph",
        pattern: "DFS/BFS + map", visual: "old → new node map",
        difficulty: "medium",
        tags: ["Graph", "DFS", "BFS", "Hash Table"],
        description: "Given a reference to a node in a **connected undirected graph**, return a **deep copy** of the graph. Each node has a value and a list of its neighbors.\n\nUse a hash map `old → clone`. DFS through each node: if already cloned, return the clone. Otherwise create a new node, store it in the map, then recursively clone all neighbors.",
        examples: [
          { input: "adjList = [[2,4],[1,3],[2,4],[1,3]]", output: "[[2,4],[1,3],[2,4],[1,3]]", explanation: "Returns a deep copy of the 4-node graph." },
          { input: "adjList = [[]]", output: "[[]]" },
        ],
        constraints: ["The number of nodes is in [0, 100]", "1 <= Node.val <= 100", "No repeated edges, no self-loops"],
        approach: "DFS with a visited map. On first visit, create clone and store it, then recursively clone neighbors.",
        timeComplexity: "O(V + E)",
        spaceComplexity: "O(V)",
        solutions: [
          {
            language: "javascript",
            code: `function cloneGraph(node) {
  if (!node) return null;
  const map = new Map();
  function dfs(n) {
    if (map.has(n)) return map.get(n);
    const clone = { val: n.val, neighbors: [] };
    map.set(n, clone);
    for (const nb of n.neighbors) {
      clone.neighbors.push(dfs(nb));
    }
    return clone;
  }
  return dfs(node);
}`,
          },
          {
            language: "typescript",
            code: `function cloneGraph(node: Node | null): Node | null {
  if (!node) return null;
  const map = new Map<Node, Node>();
  function dfs(n: Node): Node {
    if (map.has(n)) return map.get(n)!;
    const clone = new Node(n.val);
    map.set(n, clone);
    for (const nb of n.neighbors) {
      clone.neighbors.push(dfs(nb!));
    }
    return clone;
  }
  return dfs(node);
}`,
          },
          {
            language: "php",
            code: `function cloneGraph(?Node $node): ?Node {
    if (!$node) return null;
    $map = new SplObjectStorage();
    function dfs(Node $n, SplObjectStorage &$map): Node {
        if ($map->contains($n)) return $map[$n];
        $clone = new Node($n->val);
        $map[$n] = $clone;
        foreach ($n->neighbors as $nb) {
            $clone->neighbors[] = dfs($nb, $map);
        }
        return $clone;
    }
    return dfs($node, $map);
}`,
          },
          {
            language: "java",
            code: `public Node cloneGraph(Node node) {
    if (node == null) return null;
    Map<Node, Node> map = new HashMap<>();
    return dfs(node, map);
}
private Node dfs(Node node, Map<Node, Node> map) {
    if (map.containsKey(node)) return map.get(node);
    Node clone = new Node(node.val);
    map.put(node, clone);
    for (Node nb : node.neighbors) {
        clone.neighbors.add(dfs(nb, map));
    }
    return clone;
}`,
          },
          {
            language: "python",
            code: `def cloneGraph(node: 'Node') -> 'Node':
    if not node:
        return None
    cloned = {}
    def dfs(n):
        if n in cloned:
            return cloned[n]
        clone = Node(n.val)
        cloned[n] = clone
        for nb in n.neighbors:
            clone.neighbors.append(dfs(nb))
        return clone
    return dfs(node)`,
          },
        ],
      },
      {
        num: 28, title: "Course Schedule", leetcodeNum: 207, slug: "course-schedule",
        pattern: "Topo sort / cycle detect", visual: "Kahn's BFS or DFS w/ colors",
        difficulty: "medium",
        tags: ["Graph", "Topological Sort", "BFS", "DFS"],
        description: "You have `numCourses` courses (0 to numCourses-1) and a list of `prerequisites [a, b]` meaning you must take course `b` before `a`. Return `true` if you can finish all courses (i.e., no cycle exists in the dependency graph).\n\n**Kahn's algorithm:** compute in-degrees, add all zero-in-degree nodes to queue, process them BFS-style, decrement neighbors' in-degrees. If all nodes are processed, there's no cycle.",
        examples: [
          { input: "numCourses = 2, prerequisites = [[1,0]]", output: "true", explanation: "Take course 0, then course 1." },
          { input: "numCourses = 2, prerequisites = [[1,0],[0,1]]", output: "false", explanation: "Circular dependency." },
        ],
        constraints: ["1 <= numCourses <= 2000", "0 <= prerequisites.length <= 5000"],
        approach: "Build adjacency list + in-degree array. BFS from in-degree-0 nodes. If processed count == numCourses → no cycle.",
        timeComplexity: "O(V + E)",
        spaceComplexity: "O(V + E)",
        solutions: [
          {
            language: "javascript",
            code: `function canFinish(numCourses, prerequisites) {
  const adj = Array.from({ length: numCourses }, () => []);
  const inDeg = new Array(numCourses).fill(0);
  for (const [a, b] of prerequisites) { adj[b].push(a); inDeg[a]++; }
  const queue = [];
  for (let i = 0; i < numCourses; i++) if (inDeg[i] === 0) queue.push(i);
  let count = 0;
  while (queue.length) {
    const node = queue.shift();
    count++;
    for (const nb of adj[node]) { if (--inDeg[nb] === 0) queue.push(nb); }
  }
  return count === numCourses;
}`,
          },
          {
            language: "typescript",
            code: `function canFinish(numCourses: number, prerequisites: number[][]): boolean {
  const adj: number[][] = Array.from({ length: numCourses }, () => []);
  const inDeg: number[] = new Array(numCourses).fill(0);
  for (const [a, b] of prerequisites) { adj[b].push(a); inDeg[a]++; }
  const queue: number[] = [];
  for (let i = 0; i < numCourses; i++) if (inDeg[i] === 0) queue.push(i);
  let count = 0;
  while (queue.length) {
    const node = queue.shift()!;
    count++;
    for (const nb of adj[node]) { if (--inDeg[nb] === 0) queue.push(nb); }
  }
  return count === numCourses;
}`,
          },
          {
            language: "php",
            code: `function canFinish(int $numCourses, array $prerequisites): bool {
    $adj = array_fill(0, $numCourses, []);
    $inDeg = array_fill(0, $numCourses, 0);
    foreach ($prerequisites as [$a, $b]) { $adj[$b][] = $a; $inDeg[$a]++; }
    $queue = [];
    for ($i = 0; $i < $numCourses; $i++) if ($inDeg[$i] === 0) $queue[] = $i;
    $count = 0;
    while (!empty($queue)) {
        $node = array_shift($queue); $count++;
        foreach ($adj[$node] as $nb) { if (--$inDeg[$nb] === 0) $queue[] = $nb; }
    }
    return $count === $numCourses;
}`,
          },
          {
            language: "java",
            code: `public boolean canFinish(int numCourses, int[][] prerequisites) {
    List<List<Integer>> adj = new ArrayList<>();
    int[] inDeg = new int[numCourses];
    for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
    for (int[] p : prerequisites) { adj.get(p[1]).add(p[0]); inDeg[p[0]]++; }
    Queue<Integer> q = new LinkedList<>();
    for (int i = 0; i < numCourses; i++) if (inDeg[i] == 0) q.offer(i);
    int count = 0;
    while (!q.isEmpty()) {
        int node = q.poll(); count++;
        for (int nb : adj.get(node)) if (--inDeg[nb] == 0) q.offer(nb);
    }
    return count == numCourses;
}`,
          },
          {
            language: "python",
            code: `from collections import deque

def canFinish(numCourses: int, prerequisites: list[list[int]]) -> bool:
    adj = [[] for _ in range(numCourses)]
    in_deg = [0] * numCourses
    for a, b in prerequisites:
        adj[b].append(a)
        in_deg[a] += 1
    queue = deque(i for i in range(numCourses) if in_deg[i] == 0)
    count = 0
    while queue:
        node = queue.popleft()
        count += 1
        for nb in adj[node]:
            in_deg[nb] -= 1
            if in_deg[nb] == 0:
                queue.append(nb)
    return count == numCourses`,
          },
        ],
      },
      {
        num: 29, title: "Pacific Atlantic Water Flow", leetcodeNum: 417, slug: "pacific-atlantic-water-flow",
        pattern: "Multi-source BFS/DFS", visual: "Reverse flow from each ocean",
        difficulty: "medium",
        tags: ["Graph", "BFS", "DFS", "Matrix"],
        description: "Given an `m x n` matrix of heights, rain water flows to **Pacific** (top/left edge) or **Atlantic** (bottom/right edge) if it can move to adjacent cells with equal or lower height. Return all cells that can flow to **both** oceans.\n\n**Reverse thinking:** instead of simulating flow downhill, do BFS/DFS *uphill* from each ocean's border. Cells reachable from both sets are the answer.",
        examples: [
          {
            input: "heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]",
            output: "[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]",
          },
        ],
        constraints: ["m == heights.length", "n == heights[r].length", "1 <= m, n <= 200"],
        approach: "BFS from Pacific borders into `pacific` set, BFS from Atlantic borders into `atlantic` set. Return intersection.",
        timeComplexity: "O(m × n)",
        spaceComplexity: "O(m × n)",
        solutions: [
          {
            language: "javascript",
            code: `function pacificAtlantic(heights) {
  const m = heights.length, n = heights[0].length;
  const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
  function bfs(starts) {
    const visited = Array.from({ length: m }, () => new Array(n).fill(false));
    const queue = [...starts];
    for (const [r, c] of starts) visited[r][c] = true;
    while (queue.length) {
      const [r, c] = queue.shift();
      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < m && nc >= 0 && nc < n && !visited[nr][nc] && heights[nr][nc] >= heights[r][c]) {
          visited[nr][nc] = true;
          queue.push([nr, nc]);
        }
      }
    }
    return visited;
  }
  const pac = [], atl = [];
  for (let r = 0; r < m; r++) { pac.push([r, 0]); atl.push([r, n - 1]); }
  for (let c = 0; c < n; c++) { pac.push([0, c]); atl.push([m - 1, c]); }
  const pVisited = bfs(pac), aVisited = bfs(atl);
  const result = [];
  for (let r = 0; r < m; r++)
    for (let c = 0; c < n; c++)
      if (pVisited[r][c] && aVisited[r][c]) result.push([r, c]);
  return result;
}`,
          },
          {
            language: "typescript",
            code: `function pacificAtlantic(heights: number[][]): number[][] {
  const m = heights.length, n = heights[0].length;
  const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
  function bfs(starts: number[][]): boolean[][] {
    const visited: boolean[][] = Array.from({ length: m }, () => new Array(n).fill(false));
    const queue = [...starts];
    for (const [r, c] of starts) visited[r][c] = true;
    while (queue.length) {
      const [r, c] = queue.shift()!;
      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < m && nc >= 0 && nc < n && !visited[nr][nc] && heights[nr][nc] >= heights[r][c]) {
          visited[nr][nc] = true; queue.push([nr, nc]);
        }
      }
    }
    return visited;
  }
  const pac: number[][] = [], atl: number[][] = [];
  for (let r = 0; r < m; r++) { pac.push([r, 0]); atl.push([r, n - 1]); }
  for (let c = 0; c < n; c++) { pac.push([0, c]); atl.push([m - 1, c]); }
  const pV = bfs(pac), aV = bfs(atl);
  const result: number[][] = [];
  for (let r = 0; r < m; r++)
    for (let c = 0; c < n; c++)
      if (pV[r][c] && aV[r][c]) result.push([r, c]);
  return result;
}`,
          },
          {
            language: "php",
            code: `function pacificAtlantic(array $heights): array {
    $m = count($heights); $n = count($heights[0]);
    $dirs = [[0,1],[0,-1],[1,0],[-1,0]];
    function bfs(array $starts, array $heights, int $m, int $n, array $dirs): array {
        $visited = array_fill(0, $m, array_fill(0, $n, false));
        $queue = $starts;
        foreach ($starts as [$r, $c]) $visited[$r][$c] = true;
        while (!empty($queue)) {
            [$r, $c] = array_shift($queue);
            foreach ($dirs as [$dr, $dc]) {
                $nr = $r + $dr; $nc = $c + $dc;
                if ($nr >= 0 && $nr < $m && $nc >= 0 && $nc < $n && !$visited[$nr][$nc] && $heights[$nr][$nc] >= $heights[$r][$c]) {
                    $visited[$nr][$nc] = true; $queue[] = [$nr, $nc];
                }
            }
        }
        return $visited;
    }
    $pac = []; $atl = [];
    for ($r = 0; $r < $m; $r++) { $pac[] = [$r, 0]; $atl[] = [$r, $n - 1]; }
    for ($c = 0; $c < $n; $c++) { $pac[] = [0, $c]; $atl[] = [$m - 1, $c]; }
    $pV = bfs($pac, $heights, $m, $n, $dirs); $aV = bfs($atl, $heights, $m, $n, $dirs);
    $result = [];
    for ($r = 0; $r < $m; $r++)
        for ($c = 0; $c < $n; $c++)
            if ($pV[$r][$c] && $aV[$r][$c]) $result[] = [$r, $c];
    return $result;
}`,
          },
          {
            language: "java",
            code: `public List<List<Integer>> pacificAtlantic(int[][] heights) {
    int m = heights.length, n = heights[0].length;
    int[][] dirs = {{0,1},{0,-1},{1,0},{-1,0}};
    boolean[][] pac = bfs(heights, m, n, dirs, true);
    boolean[][] atl = bfs(heights, m, n, dirs, false);
    List<List<Integer>> res = new ArrayList<>();
    for (int r = 0; r < m; r++)
        for (int c = 0; c < n; c++)
            if (pac[r][c] && atl[r][c]) res.add(List.of(r, c));
    return res;
}
private boolean[][] bfs(int[][] h, int m, int n, int[][] dirs, boolean pacific) {
    boolean[][] vis = new boolean[m][n];
    Queue<int[]> q = new LinkedList<>();
    for (int r = 0; r < m; r++) { int c = pacific ? 0 : n-1; vis[r][c] = true; q.offer(new int[]{r,c}); }
    for (int c = 0; c < n; c++) { int r = pacific ? 0 : m-1; if (!vis[r][c]) { vis[r][c]=true; q.offer(new int[]{r,c}); } }
    while (!q.isEmpty()) {
        int[] cur = q.poll();
        for (int[] d : dirs) {
            int nr = cur[0]+d[0], nc = cur[1]+d[1];
            if (nr>=0&&nr<m&&nc>=0&&nc<n&&!vis[nr][nc]&&h[nr][nc]>=h[cur[0]][cur[1]]) { vis[nr][nc]=true; q.offer(new int[]{nr,nc}); }
        }
    }
    return vis;
}`,
          },
          {
            language: "python",
            code: `from collections import deque

def pacificAtlantic(heights: list[list[int]]) -> list[list[int]]:
    m, n = len(heights), len(heights[0])
    dirs = [(0,1),(0,-1),(1,0),(-1,0)]
    def bfs(starts):
        visited = [[False]*n for _ in range(m)]
        queue = deque(starts)
        for r, c in starts:
            visited[r][c] = True
        while queue:
            r, c = queue.popleft()
            for dr, dc in dirs:
                nr, nc = r+dr, c+dc
                if 0<=nr<m and 0<=nc<n and not visited[nr][nc] and heights[nr][nc]>=heights[r][c]:
                    visited[nr][nc] = True
                    queue.append((nr, nc))
        return visited
    pac = [(r, 0) for r in range(m)] + [(0, c) for c in range(n)]
    atl = [(r, n-1) for r in range(m)] + [(m-1, c) for c in range(n)]
    pv, av = bfs(pac), bfs(atl)
    return [[r,c] for r in range(m) for c in range(n) if pv[r][c] and av[r][c]]`,
          },
        ],
      },
      {
        num: 30, title: "Number of Islands", leetcodeNum: 200, slug: "number-of-islands",
        pattern: "DFS/BFS flood fill", visual: "Mark visited; count starts",
        difficulty: "medium",
        tags: ["Graph", "DFS", "BFS", "Matrix"],
        description: "Given an `m x n` 2D binary grid where '1' is land and '0' is water, return the **number of islands**. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.\n\nFor each unvisited '1', increment the island count and DFS to mark all connected '1's as visited (change to '0' or use a visited set).",
        examples: [
          {
            input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]',
            output: "1",
          },
          {
            input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]',
            output: "3",
          },
        ],
        constraints: ["m == grid.length", "n == grid[i].length", "1 <= m, n <= 300", "grid[i][j] is '0' or '1'"],
        approach: "Iterate grid. On '1', increment count, then DFS flood-fill to sink the island (mark '1' → '0').",
        timeComplexity: "O(m × n)",
        spaceComplexity: "O(m × n) — recursion stack",
        solutions: [
          {
            language: "javascript",
            code: `function numIslands(grid) {
  let count = 0;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === '1') { count++; dfs(grid, r, c); }
    }
  }
  return count;
}
function dfs(grid, r, c) {
  if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] !== '1') return;
  grid[r][c] = '0';
  dfs(grid, r+1, c); dfs(grid, r-1, c); dfs(grid, r, c+1); dfs(grid, r, c-1);
}`,
          },
          {
            language: "typescript",
            code: `function numIslands(grid: string[][]): number {
  let count = 0;
  function dfs(r: number, c: number): void {
    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] !== '1') return;
    grid[r][c] = '0';
    dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1);
  }
  for (let r = 0; r < grid.length; r++)
    for (let c = 0; c < grid[0].length; c++)
      if (grid[r][c] === '1') { count++; dfs(r, c); }
  return count;
}`,
          },
          {
            language: "php",
            code: `function numIslands(array $grid): int {
    $count = 0;
    for ($r = 0; $r < count($grid); $r++) {
        for ($c = 0; $c < count($grid[0]); $c++) {
            if ($grid[$r][$c] === '1') { $count++; dfs($grid, $r, $c); }
        }
    }
    return $count;
}
function dfs(array &$grid, int $r, int $c): void {
    if ($r < 0 || $r >= count($grid) || $c < 0 || $c >= count($grid[0]) || $grid[$r][$c] !== '1') return;
    $grid[$r][$c] = '0';
    dfs($grid, $r+1, $c); dfs($grid, $r-1, $c); dfs($grid, $r, $c+1); dfs($grid, $r, $c-1);
}`,
          },
          {
            language: "java",
            code: `public int numIslands(char[][] grid) {
    int count = 0;
    for (int r = 0; r < grid.length; r++)
        for (int c = 0; c < grid[0].length; c++)
            if (grid[r][c] == '1') { count++; dfs(grid, r, c); }
    return count;
}
private void dfs(char[][] grid, int r, int c) {
    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] != '1') return;
    grid[r][c] = '0';
    dfs(grid,r+1,c); dfs(grid,r-1,c); dfs(grid,r,c+1); dfs(grid,r,c-1);
}`,
          },
          {
            language: "python",
            code: `def numIslands(grid: list[list[str]]) -> int:
    def dfs(r, c):
        if r < 0 or r >= len(grid) or c < 0 or c >= len(grid[0]) or grid[r][c] != '1':
            return
        grid[r][c] = '0'
        dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1)
    count = 0
    for r in range(len(grid)):
        for c in range(len(grid[0])):
            if grid[r][c] == '1':
                count += 1
                dfs(r, c)
    return count`,
          },
        ],
      },
      {
        num: 31, title: "Longest Consecutive Sequence", leetcodeNum: 128, slug: "longest-consecutive-sequence",
        pattern: "Hash set", visual: "Count only from sequence \"starts\"",
        difficulty: "medium",
        tags: ["Array", "Hash Table"],
        description: "Given an unsorted array of integers `nums`, return the length of the **longest consecutive elements sequence**. The algorithm must run in O(n) time.\n\nPut all numbers in a hash set. For each number, only start counting if `num - 1` is **not** in the set (i.e., it's the start of a sequence). Then count how far the sequence extends.",
        examples: [
          { input: "nums = [100,4,200,1,3,2]", output: "4", explanation: "[1, 2, 3, 4] is the longest consecutive sequence." },
          { input: "nums = [0,3,7,2,5,8,4,6,0,1]", output: "9" },
        ],
        constraints: ["0 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],
        approach: "Hash set for O(1) lookup. Only start sequence from numbers where num-1 is absent. Expand and track max length.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
        solutions: [
          {
            language: "javascript",
            code: `function longestConsecutive(nums) {
  const set = new Set(nums);
  let best = 0;
  for (const num of set) {
    if (!set.has(num - 1)) { // sequence start
      let len = 1;
      while (set.has(num + len)) len++;
      best = Math.max(best, len);
    }
  }
  return best;
}`,
          },
          {
            language: "typescript",
            code: `function longestConsecutive(nums: number[]): number {
  const set = new Set(nums);
  let best = 0;
  for (const num of set) {
    if (!set.has(num - 1)) {
      let len = 1;
      while (set.has(num + len)) len++;
      best = Math.max(best, len);
    }
  }
  return best;
}`,
          },
          {
            language: "php",
            code: `function longestConsecutive(array $nums): int {
    $set = array_flip($nums);
    $best = 0;
    foreach ($set as $num => $_) {
        if (!isset($set[$num - 1])) {
            $len = 1;
            while (isset($set[$num + $len])) $len++;
            $best = max($best, $len);
        }
    }
    return $best;
}`,
          },
          {
            language: "java",
            code: `public int longestConsecutive(int[] nums) {
    Set<Integer> set = new HashSet<>();
    for (int n : nums) set.add(n);
    int best = 0;
    for (int num : set) {
        if (!set.contains(num - 1)) {
            int len = 1;
            while (set.contains(num + len)) len++;
            best = Math.max(best, len);
        }
    }
    return best;
}`,
          },
          {
            language: "python",
            code: `def longestConsecutive(nums: list[int]) -> int:
    num_set = set(nums)
    best = 0
    for num in num_set:
        if num - 1 not in num_set:  # start of sequence
            length = 1
            while num + length in num_set:
                length += 1
            best = max(best, length)
    return best`,
          },
        ],
      },
      {
        num: 32, title: "Alien Dictionary", leetcodeNum: 269, slug: "alien-dictionary",
        pattern: "Topo sort", visual: "Build edges from adjacent word diffs",
        difficulty: "hard",
        tags: ["Graph", "Topological Sort", "String"],
        premium: true,
        description: "Given a list of words sorted according to an **alien language's alphabet**, derive the character order of the alien language. Return any valid ordering, or empty string if impossible.\n\nCompare adjacent words to extract character ordering constraints, then topologically sort the character graph. Return empty string if a cycle is detected.",
        examples: [
          { input: 'words = ["wrt","wrf","er","ett","rftt"]', output: '"wertf"' },
          { input: 'words = ["z","x"]', output: '"zx"' },
          { input: 'words = ["z","x","z"]', output: '""', explanation: "Cycle detected — impossible." },
        ],
        constraints: ["1 <= words.length <= 100", "1 <= words[i].length <= 100"],
        approach: "Build char graph from adjacent word diffs. Kahn's BFS topo sort. Detect invalid input (prefix before word).",
        timeComplexity: "O(C) — C = total characters",
        spaceComplexity: "O(1) — at most 26 chars",
        solutions: [
          {
            language: "javascript",
            code: `function alienOrder(words) {
  const adj = new Map();
  const inDeg = new Map();
  for (const w of words) for (const c of w) { if (!adj.has(c)) adj.set(c, new Set()); if (!inDeg.has(c)) inDeg.set(c, 0); }
  for (let i = 0; i < words.length - 1; i++) {
    const [w1, w2] = [words[i], words[i+1]];
    if (w1.length > w2.length && w1.startsWith(w2)) return "";
    for (let j = 0; j < Math.min(w1.length, w2.length); j++) {
      if (w1[j] !== w2[j]) { if (!adj.get(w1[j]).has(w2[j])) { adj.get(w1[j]).add(w2[j]); inDeg.set(w2[j], (inDeg.get(w2[j]) || 0) + 1); } break; }
    }
  }
  const queue = [...inDeg.entries()].filter(([,d]) => d === 0).map(([c]) => c);
  let result = "";
  while (queue.length) {
    const c = queue.shift(); result += c;
    for (const nb of adj.get(c)) { inDeg.set(nb, inDeg.get(nb) - 1); if (inDeg.get(nb) === 0) queue.push(nb); }
  }
  return result.length === inDeg.size ? result : "";
}`,
          },
          {
            language: "typescript",
            code: `function alienOrder(words: string[]): string {
  const adj = new Map<string, Set<string>>();
  const inDeg = new Map<string, number>();
  for (const w of words) for (const c of w) { if (!adj.has(c)) adj.set(c, new Set()); if (!inDeg.has(c)) inDeg.set(c, 0); }
  for (let i = 0; i < words.length - 1; i++) {
    const [w1, w2] = [words[i], words[i+1]];
    if (w1.length > w2.length && w1.startsWith(w2)) return "";
    for (let j = 0; j < Math.min(w1.length, w2.length); j++) {
      if (w1[j] !== w2[j]) { if (!adj.get(w1[j])!.has(w2[j])) { adj.get(w1[j])!.add(w2[j]); inDeg.set(w2[j], (inDeg.get(w2[j]) ?? 0) + 1); } break; }
    }
  }
  const queue: string[] = [...inDeg.entries()].filter(([,d]) => d === 0).map(([c]) => c);
  let result = "";
  while (queue.length) {
    const c = queue.shift()!; result += c;
    for (const nb of adj.get(c)!) { inDeg.set(nb, inDeg.get(nb)! - 1); if (inDeg.get(nb) === 0) queue.push(nb); }
  }
  return result.length === inDeg.size ? result : "";
}`,
          },
          {
            language: "php",
            code: `function alienOrder(array $words): string {
    $adj = []; $inDeg = [];
    foreach ($words as $w) foreach (str_split($w) as $c) { $adj[$c] = $adj[$c] ?? []; $inDeg[$c] = $inDeg[$c] ?? 0; }
    for ($i = 0; $i < count($words) - 1; $i++) {
        [$w1, $w2] = [$words[$i], $words[$i+1]];
        if (strlen($w1) > strlen($w2) && str_starts_with($w1, $w2)) return "";
        for ($j = 0; $j < min(strlen($w1), strlen($w2)); $j++) {
            if ($w1[$j] !== $w2[$j]) { if (!in_array($w2[$j], $adj[$w1[$j]])) { $adj[$w1[$j]][] = $w2[$j]; $inDeg[$w2[$j]]++; } break; }
        }
    }
    $queue = array_keys(array_filter($inDeg, fn($d) => $d === 0));
    $result = "";
    while (!empty($queue)) {
        $c = array_shift($queue); $result .= $c;
        foreach ($adj[$c] as $nb) { $inDeg[$nb]--; if ($inDeg[$nb] === 0) $queue[] = $nb; }
    }
    return strlen($result) === count($inDeg) ? $result : "";
}`,
          },
          {
            language: "java",
            code: `public String alienOrder(String[] words) {
    Map<Character, Set<Character>> adj = new HashMap<>();
    Map<Character, Integer> inDeg = new HashMap<>();
    for (String w : words) for (char c : w.toCharArray()) { adj.putIfAbsent(c, new HashSet<>()); inDeg.putIfAbsent(c, 0); }
    for (int i = 0; i < words.length - 1; i++) {
        String w1 = words[i], w2 = words[i+1];
        if (w1.length() > w2.length() && w1.startsWith(w2)) return "";
        for (int j = 0; j < Math.min(w1.length(), w2.length()); j++) {
            if (w1.charAt(j) != w2.charAt(j)) { if (adj.get(w1.charAt(j)).add(w2.charAt(j))) inDeg.merge(w2.charAt(j), 1, Integer::sum); break; }
        }
    }
    Queue<Character> q = new LinkedList<>();
    for (Map.Entry<Character,Integer> e : inDeg.entrySet()) if (e.getValue() == 0) q.offer(e.getKey());
    StringBuilder sb = new StringBuilder();
    while (!q.isEmpty()) { char c = q.poll(); sb.append(c); for (char nb : adj.get(c)) { inDeg.merge(nb, -1, Integer::sum); if (inDeg.get(nb) == 0) q.offer(nb); } }
    return sb.length() == inDeg.size() ? sb.toString() : "";
}`,
          },
          {
            language: "python",
            code: `from collections import deque, defaultdict

def alienOrder(words: list[str]) -> str:
    adj = defaultdict(set)
    in_deg = {c: 0 for w in words for c in w}
    for i in range(len(words) - 1):
        w1, w2 = words[i], words[i+1]
        if len(w1) > len(w2) and w1.startswith(w2):
            return ""
        for c1, c2 in zip(w1, w2):
            if c1 != c2:
                if c2 not in adj[c1]:
                    adj[c1].add(c2)
                    in_deg[c2] += 1
                break
    queue = deque(c for c in in_deg if in_deg[c] == 0)
    result = []
    while queue:
        c = queue.popleft()
        result.append(c)
        for nb in adj[c]:
            in_deg[nb] -= 1
            if in_deg[nb] == 0:
                queue.append(nb)
    return "".join(result) if len(result) == len(in_deg) else ""`,
          },
        ],
      },
      {
        num: 33, title: "Graph Valid Tree", leetcodeNum: 261, slug: "graph-valid-tree",
        pattern: "Union-Find / DFS", visual: "Connected & edges == n−1",
        difficulty: "medium",
        tags: ["Graph", "Union-Find", "DFS"],
        premium: true,
        description: "Given `n` nodes (0 to n-1) and a list of **undirected edges**, return `true` if these edges form a **valid tree**.\n\nA valid tree must: (1) have exactly `n-1` edges, and (2) be fully connected (no isolated nodes, no cycles).\n\nQuick check: if edges != n-1, return false. Then DFS/BFS from node 0 and check if all nodes are visited.",
        examples: [
          { input: "n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]", output: "true" },
          { input: "n = 5, edges = [[0,1],[1,2],[2,3],[1,3],[1,4]]", output: "false", explanation: "Contains a cycle." },
        ],
        constraints: ["1 <= n <= 2000", "0 <= edges.length <= 5000"],
        approach: "If edges.length != n-1, return false. DFS from node 0 with parent tracking. If all n nodes visited, it's a tree.",
        timeComplexity: "O(V + E)",
        spaceComplexity: "O(V + E)",
        solutions: [
          {
            language: "javascript",
            code: `function validTree(n, edges) {
  if (edges.length !== n - 1) return false;
  const adj = Array.from({ length: n }, () => []);
  for (const [a, b] of edges) { adj[a].push(b); adj[b].push(a); }
  const visited = new Set();
  function dfs(node, parent) {
    visited.add(node);
    for (const nb of adj[node]) {
      if (nb === parent) continue;
      if (visited.has(nb)) return false;
      if (!dfs(nb, node)) return false;
    }
    return true;
  }
  return dfs(0, -1) && visited.size === n;
}`,
          },
          {
            language: "typescript",
            code: `function validTree(n: number, edges: number[][]): boolean {
  if (edges.length !== n - 1) return false;
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [a, b] of edges) { adj[a].push(b); adj[b].push(a); }
  const visited = new Set<number>();
  function dfs(node: number, parent: number): boolean {
    visited.add(node);
    for (const nb of adj[node]) {
      if (nb === parent) continue;
      if (visited.has(nb)) return false;
      if (!dfs(nb, node)) return false;
    }
    return true;
  }
  return dfs(0, -1) && visited.size === n;
}`,
          },
          {
            language: "php",
            code: `function validTree(int $n, array $edges): bool {
    if (count($edges) !== $n - 1) return false;
    $adj = array_fill(0, $n, []);
    foreach ($edges as [$a, $b]) { $adj[$a][] = $b; $adj[$b][] = $a; }
    $visited = [];
    function dfs(int $node, int $parent, array &$adj, array &$visited): bool {
        $visited[$node] = true;
        foreach ($adj[$node] as $nb) {
            if ($nb === $parent) continue;
            if (isset($visited[$nb])) return false;
            if (!dfs($nb, $node, $adj, $visited)) return false;
        }
        return true;
    }
    return dfs(0, -1, $adj, $visited) && count($visited) === $n;
}`,
          },
          {
            language: "java",
            code: `public boolean validTree(int n, int[][] edges) {
    if (edges.length != n - 1) return false;
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    for (int[] e : edges) { adj.get(e[0]).add(e[1]); adj.get(e[1]).add(e[0]); }
    Set<Integer> visited = new HashSet<>();
    return dfs(adj, visited, 0, -1) && visited.size() == n;
}
private boolean dfs(List<List<Integer>> adj, Set<Integer> visited, int node, int parent) {
    visited.add(node);
    for (int nb : adj.get(node)) {
        if (nb == parent) continue;
        if (visited.contains(nb)) return false;
        if (!dfs(adj, visited, nb, node)) return false;
    }
    return true;
}`,
          },
          {
            language: "python",
            code: `def validTree(n: int, edges: list[list[int]]) -> bool:
    if len(edges) != n - 1:
        return False
    adj = [[] for _ in range(n)]
    for a, b in edges:
        adj[a].append(b)
        adj[b].append(a)
    visited = set()
    def dfs(node, parent):
        visited.add(node)
        for nb in adj[node]:
            if nb == parent:
                continue
            if nb in visited:
                return False
            if not dfs(nb, node):
                return False
        return True
    return dfs(0, -1) and len(visited) == n`,
          },
        ],
      },
      {
        num: 34, title: "Number of Connected Components in Undirected Graph", leetcodeNum: 323, slug: "number-of-connected-components-in-an-undirected-graph",
        pattern: "Union-Find", visual: "Count distinct roots",
        difficulty: "medium",
        tags: ["Graph", "Union-Find", "DFS"],
        premium: true,
        description: "Given `n` nodes (0 to n-1) and a list of **undirected edges**, return the **number of connected components** in the graph.\n\n**Union-Find approach:** Start with `n` components. For each edge, if the two nodes have different roots, union them and decrement component count.",
        examples: [
          { input: "n = 5, edges = [[0,1],[1,2],[3,4]]", output: "2" },
          { input: "n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]", output: "1" },
        ],
        constraints: ["1 <= n <= 2000", "1 <= edges.length <= 5000"],
        approach: "Union-Find with path compression. Initialize count=n. Each successful union decrements count.",
        timeComplexity: "O(n + E × α(n)) — α is inverse Ackermann",
        spaceComplexity: "O(n)",
        solutions: [
          {
            language: "javascript",
            code: `function countComponents(n, edges) {
  const parent = Array.from({ length: n }, (_, i) => i);
  function find(x) { if (parent[x] !== x) parent[x] = find(parent[x]); return parent[x]; }
  let count = n;
  for (const [a, b] of edges) {
    const ra = find(a), rb = find(b);
    if (ra !== rb) { parent[ra] = rb; count--; }
  }
  return count;
}`,
          },
          {
            language: "typescript",
            code: `function countComponents(n: number, edges: number[][]): number {
  const parent: number[] = Array.from({ length: n }, (_, i) => i);
  function find(x: number): number { if (parent[x] !== x) parent[x] = find(parent[x]); return parent[x]; }
  let count = n;
  for (const [a, b] of edges) {
    const ra = find(a), rb = find(b);
    if (ra !== rb) { parent[ra] = rb; count--; }
  }
  return count;
}`,
          },
          {
            language: "php",
            code: `function countComponents(int $n, array $edges): int {
    $parent = range(0, $n - 1);
    function find(array &$parent, int $x): int {
        if ($parent[$x] !== $x) $parent[$x] = find($parent, $parent[$x]);
        return $parent[$x];
    }
    $count = $n;
    foreach ($edges as [$a, $b]) {
        $ra = find($parent, $a); $rb = find($parent, $b);
        if ($ra !== $rb) { $parent[$ra] = $rb; $count--; }
    }
    return $count;
}`,
          },
          {
            language: "java",
            code: `public int countComponents(int n, int[][] edges) {
    int[] parent = new int[n];
    for (int i = 0; i < n; i++) parent[i] = i;
    int count = n;
    for (int[] e : edges) {
        int ra = find(parent, e[0]), rb = find(parent, e[1]);
        if (ra != rb) { parent[ra] = rb; count--; }
    }
    return count;
}
private int find(int[] parent, int x) {
    if (parent[x] != x) parent[x] = find(parent, parent[x]);
    return parent[x];
}`,
          },
          {
            language: "python",
            code: `def countComponents(n: int, edges: list[list[int]]) -> int:
    parent = list(range(n))
    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]
    count = n
    for a, b in edges:
        ra, rb = find(a), find(b)
        if ra != rb:
            parent[ra] = rb
            count -= 1
    return count`,
          },
        ],
      },
    ],
  },
  {
    id: "interval",
    name: "Interval",
    problems: [
      {
        num: 35, title: "Insert Interval", leetcodeNum: 57, slug: "insert-interval",
        pattern: "Linear scan", visual: "Before / overlap merge / after",
        difficulty: "medium",
        tags: ["Array", "Intervals"],
        description: "Given an array of **non-overlapping sorted intervals** and a `newInterval`, insert it into the correct position (merging if necessary) so the result is still sorted and non-overlapping.\n\nThree phases: (1) add all intervals that end **before** newInterval starts; (2) merge all overlapping intervals into newInterval; (3) add all remaining intervals.",
        examples: [
          { input: "intervals = [[1,3],[6,9]], newInterval = [2,5]", output: "[[1,5],[6,9]]" },
          { input: "intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]", output: "[[1,2],[3,10],[12,16]]" },
        ],
        constraints: ["0 <= intervals.length <= 10^4", "intervals[i].length == 2", "intervals is sorted by start ascending"],
        approach: "Linear scan in three phases: add non-overlapping before, merge overlapping, add remaining.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
        solutions: [
          {
            language: "javascript",
            code: `function insert(intervals, newInterval) {
  const result = [];
  let i = 0, n = intervals.length;
  // Phase 1: before
  while (i < n && intervals[i][1] < newInterval[0]) result.push(intervals[i++]);
  // Phase 2: merge overlapping
  while (i < n && intervals[i][0] <= newInterval[1]) {
    newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
    newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
    i++;
  }
  result.push(newInterval);
  // Phase 3: after
  while (i < n) result.push(intervals[i++]);
  return result;
}`,
          },
          {
            language: "typescript",
            code: `function insert(intervals: number[][], newInterval: number[]): number[][] {
  const result: number[][] = [];
  let i = 0, n = intervals.length;
  while (i < n && intervals[i][1] < newInterval[0]) result.push(intervals[i++]);
  while (i < n && intervals[i][0] <= newInterval[1]) {
    newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
    newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
    i++;
  }
  result.push(newInterval);
  while (i < n) result.push(intervals[i++]);
  return result;
}`,
          },
          {
            language: "php",
            code: `function insert(array $intervals, array $newInterval): array {
    $result = []; $i = 0; $n = count($intervals);
    while ($i < $n && $intervals[$i][1] < $newInterval[0]) $result[] = $intervals[$i++];
    while ($i < $n && $intervals[$i][0] <= $newInterval[1]) {
        $newInterval[0] = min($newInterval[0], $intervals[$i][0]);
        $newInterval[1] = max($newInterval[1], $intervals[$i][1]);
        $i++;
    }
    $result[] = $newInterval;
    while ($i < $n) $result[] = $intervals[$i++];
    return $result;
}`,
          },
          {
            language: "java",
            code: `public int[][] insert(int[][] intervals, int[] newInterval) {
    List<int[]> result = new ArrayList<>();
    int i = 0, n = intervals.length;
    while (i < n && intervals[i][1] < newInterval[0]) result.add(intervals[i++]);
    while (i < n && intervals[i][0] <= newInterval[1]) {
        newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
        newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
        i++;
    }
    result.add(newInterval);
    while (i < n) result.add(intervals[i++]);
    return result.toArray(new int[0][]);
}`,
          },
          {
            language: "python",
            code: `def insert(intervals: list[list[int]], newInterval: list[int]) -> list[list[int]]:
    result = []
    i = 0
    while i < len(intervals) and intervals[i][1] < newInterval[0]:
        result.append(intervals[i])
        i += 1
    while i < len(intervals) and intervals[i][0] <= newInterval[1]:
        newInterval[0] = min(newInterval[0], intervals[i][0])
        newInterval[1] = max(newInterval[1], intervals[i][1])
        i += 1
    result.append(newInterval)
    result.extend(intervals[i:])
    return result`,
          },
        ],
      },
      {
        num: 36, title: "Merge Intervals", leetcodeNum: 56, slug: "merge-intervals",
        pattern: "Sort by start", visual: "Extend last end if overlap",
        difficulty: "medium",
        tags: ["Array", "Sorting", "Intervals"],
        description: "Given an array of `intervals`, merge all **overlapping intervals** and return the result.\n\nSort by start time. Then iterate: if current interval overlaps the last merged one (i.e., `curr[0] <= last[1]`), extend the end. Otherwise push a new interval.",
        examples: [
          { input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]", explanation: "[1,3] and [2,6] overlap → [1,6]." },
          { input: "intervals = [[1,4],[4,5]]", output: "[[1,5]]" },
        ],
        constraints: ["1 <= intervals.length <= 10^4", "intervals[i].length == 2", "0 <= start <= end <= 10^4"],
        approach: "Sort by start. Track last merged interval; if current starts <= last end, extend last end; else append.",
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(n)",
        solutions: [
          {
            language: "javascript",
            code: `function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const result = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = result[result.length - 1];
    if (intervals[i][0] <= last[1]) last[1] = Math.max(last[1], intervals[i][1]);
    else result.push(intervals[i]);
  }
  return result;
}`,
          },
          {
            language: "typescript",
            code: `function merge(intervals: number[][]): number[][] {
  intervals.sort((a, b) => a[0] - b[0]);
  const result: number[][] = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = result[result.length - 1];
    if (intervals[i][0] <= last[1]) last[1] = Math.max(last[1], intervals[i][1]);
    else result.push(intervals[i]);
  }
  return result;
}`,
          },
          {
            language: "php",
            code: `function merge(array $intervals): array {
    usort($intervals, fn($a, $b) => $a[0] - $b[0]);
    $result = [$intervals[0]];
    for ($i = 1; $i < count($intervals); $i++) {
        $last = &$result[count($result) - 1];
        if ($intervals[$i][0] <= $last[1]) $last[1] = max($last[1], $intervals[$i][1]);
        else $result[] = $intervals[$i];
    }
    return $result;
}`,
          },
          {
            language: "java",
            code: `public int[][] merge(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
    List<int[]> result = new ArrayList<>();
    result.add(intervals[0]);
    for (int i = 1; i < intervals.length; i++) {
        int[] last = result.get(result.size() - 1);
        if (intervals[i][0] <= last[1]) last[1] = Math.max(last[1], intervals[i][1]);
        else result.add(intervals[i]);
    }
    return result.toArray(new int[0][]);
}`,
          },
          {
            language: "python",
            code: `def merge(intervals: list[list[int]]) -> list[list[int]]:
    intervals.sort(key=lambda x: x[0])
    result = [intervals[0]]
    for start, end in intervals[1:]:
        if start <= result[-1][1]:
            result[-1][1] = max(result[-1][1], end)
        else:
            result.append([start, end])
    return result`,
          },
        ],
      },
      {
        num: 37, title: "Non-overlapping Intervals", leetcodeNum: 435, slug: "non-overlapping-intervals",
        pattern: "Greedy by end", visual: "Keep earliest-ending; remove conflicts",
        difficulty: "medium",
        tags: ["Array", "Greedy", "Intervals"],
        description: "Given an array of `intervals`, return the **minimum number of intervals to remove** so that the rest are non-overlapping.\n\n**Greedy:** Sort by **end time**. Greedily keep intervals that start at or after the last kept interval's end. Count how many we remove (= total - kept).",
        examples: [
          { input: "intervals = [[1,2],[2,3],[3,4],[1,3]]", output: "1", explanation: "Remove [1,3]." },
          { input: "intervals = [[1,2],[1,2],[1,2]]", output: "2" },
          { input: "intervals = [[1,2],[2,3]]", output: "0" },
        ],
        constraints: ["1 <= intervals.length <= 10^5", "-5 * 10^4 <= start < end <= 5 * 10^4"],
        approach: "Sort by end. Track lastEnd. If current.start >= lastEnd, keep it (update lastEnd); else remove it (increment count).",
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(1)",
        solutions: [
          {
            language: "javascript",
            code: `function eraseOverlapIntervals(intervals) {
  intervals.sort((a, b) => a[1] - b[1]);
  let remove = 0, lastEnd = -Infinity;
  for (const [start, end] of intervals) {
    if (start >= lastEnd) lastEnd = end;
    else remove++;
  }
  return remove;
}`,
          },
          {
            language: "typescript",
            code: `function eraseOverlapIntervals(intervals: number[][]): number {
  intervals.sort((a, b) => a[1] - b[1]);
  let remove = 0, lastEnd = -Infinity;
  for (const [start, end] of intervals) {
    if (start >= lastEnd) lastEnd = end;
    else remove++;
  }
  return remove;
}`,
          },
          {
            language: "php",
            code: `function eraseOverlapIntervals(array $intervals): int {
    usort($intervals, fn($a, $b) => $a[1] - $b[1]);
    $remove = 0; $lastEnd = PHP_INT_MIN;
    foreach ($intervals as [$start, $end]) {
        if ($start >= $lastEnd) $lastEnd = $end;
        else $remove++;
    }
    return $remove;
}`,
          },
          {
            language: "java",
            code: `public int eraseOverlapIntervals(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> a[1] - b[1]);
    int remove = 0, lastEnd = Integer.MIN_VALUE;
    for (int[] interval : intervals) {
        if (interval[0] >= lastEnd) lastEnd = interval[1];
        else remove++;
    }
    return remove;
}`,
          },
          {
            language: "python",
            code: `def eraseOverlapIntervals(intervals: list[list[int]]) -> int:
    intervals.sort(key=lambda x: x[1])
    remove = 0
    last_end = float('-inf')
    for start, end in intervals:
        if start >= last_end:
            last_end = end
        else:
            remove += 1
    return remove`,
          },
        ],
      },
      {
        num: 38, title: "Meeting Rooms", leetcodeNum: 252, slug: "meeting-rooms",
        pattern: "Sort + check", visual: "Any start[i] < end[i−1] → false",
        difficulty: "easy",
        tags: ["Array", "Sorting", "Intervals"],
        premium: true,
        description: "Given an array of meeting time intervals `[[start, end], ...]`, determine if a person could **attend all meetings** (i.e., no overlaps).\n\nSort by start time. Then check each pair of consecutive meetings: if the next meeting starts before the current one ends, there's an overlap.",
        examples: [
          { input: "intervals = [[0,30],[5,10],[15,20]]", output: "false", explanation: "[0,30] overlaps with [5,10]." },
          { input: "intervals = [[7,10],[2,4]]", output: "true" },
        ],
        constraints: ["0 <= intervals.length <= 10^4", "intervals[i].length == 2", "0 <= start < end <= 10^6"],
        approach: "Sort by start. Check consecutive pairs — if intervals[i][0] < intervals[i-1][1], return false.",
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(1)",
        solutions: [
          {
            language: "javascript",
            code: `function canAttendMeetings(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] < intervals[i - 1][1]) return false;
  }
  return true;
}`,
          },
          {
            language: "typescript",
            code: `function canAttendMeetings(intervals: number[][]): boolean {
  intervals.sort((a, b) => a[0] - b[0]);
  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] < intervals[i - 1][1]) return false;
  }
  return true;
}`,
          },
          {
            language: "php",
            code: `function canAttendMeetings(array $intervals): bool {
    usort($intervals, fn($a, $b) => $a[0] - $b[0]);
    for ($i = 1; $i < count($intervals); $i++) {
        if ($intervals[$i][0] < $intervals[$i - 1][1]) return false;
    }
    return true;
}`,
          },
          {
            language: "java",
            code: `public boolean canAttendMeetings(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
    for (int i = 1; i < intervals.length; i++) {
        if (intervals[i][0] < intervals[i - 1][1]) return false;
    }
    return true;
}`,
          },
          {
            language: "python",
            code: `def canAttendMeetings(intervals: list[list[int]]) -> bool:
    intervals.sort(key=lambda x: x[0])
    for i in range(1, len(intervals)):
        if intervals[i][0] < intervals[i-1][1]:
            return False
    return True`,
          },
        ],
      },
      {
        num: 39, title: "Meeting Rooms II", leetcodeNum: 253, slug: "meeting-rooms-ii",
        pattern: "Min-heap of ends", visual: "Reuse room if earliest end ≤ start",
        difficulty: "medium",
        tags: ["Array", "Sorting", "Heap", "Intervals"],
        premium: true,
        description: "Given an array of meeting time intervals, return the **minimum number of conference rooms** required.\n\n**Min-heap approach:** Sort by start time. Use a min-heap of end times. For each meeting, if the room with the earliest end time is free (end <= current start), reuse it (pop and push new end). Otherwise, allocate a new room (push new end). The heap size at the end is the answer.",
        examples: [
          { input: "intervals = [[0,30],[5,10],[15,20]]", output: "2" },
          { input: "intervals = [[7,10],[2,4]]", output: "1" },
        ],
        constraints: ["1 <= intervals.length <= 10^4", "0 <= start < end <= 10^6"],
        approach: "Sort by start. Min-heap of end times. Reuse room if heap.top <= start; otherwise push new room.",
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(n)",
        solutions: [
          {
            language: "javascript",
            code: `function minMeetingRooms(intervals) {
  // Use sorted ends + starts arrays (two-pointer approach)
  const starts = intervals.map(i => i[0]).sort((a, b) => a - b);
  const ends = intervals.map(i => i[1]).sort((a, b) => a - b);
  let rooms = 0, endPtr = 0;
  for (let i = 0; i < starts.length; i++) {
    if (starts[i] < ends[endPtr]) rooms++;
    else endPtr++;
  }
  return rooms;
}`,
          },
          {
            language: "typescript",
            code: `function minMeetingRooms(intervals: number[][]): number {
  const starts = intervals.map(i => i[0]).sort((a, b) => a - b);
  const ends = intervals.map(i => i[1]).sort((a, b) => a - b);
  let rooms = 0, endPtr = 0;
  for (let i = 0; i < starts.length; i++) {
    if (starts[i] < ends[endPtr]) rooms++;
    else endPtr++;
  }
  return rooms;
}`,
          },
          {
            language: "php",
            code: `function minMeetingRooms(array $intervals): int {
    $starts = array_column($intervals, 0); sort($starts);
    $ends   = array_column($intervals, 1); sort($ends);
    $rooms = 0; $endPtr = 0;
    for ($i = 0; $i < count($starts); $i++) {
        if ($starts[$i] < $ends[$endPtr]) $rooms++;
        else $endPtr++;
    }
    return $rooms;
}`,
          },
          {
            language: "java",
            code: `public int minMeetingRooms(int[][] intervals) {
    int n = intervals.length;
    int[] starts = new int[n], ends = new int[n];
    for (int i = 0; i < n; i++) { starts[i] = intervals[i][0]; ends[i] = intervals[i][1]; }
    Arrays.sort(starts); Arrays.sort(ends);
    int rooms = 0, endPtr = 0;
    for (int i = 0; i < n; i++) {
        if (starts[i] < ends[endPtr]) rooms++;
        else endPtr++;
    }
    return rooms;
}`,
          },
          {
            language: "python",
            code: `import heapq

def minMeetingRooms(intervals: list[list[int]]) -> int:
    intervals.sort(key=lambda x: x[0])
    heap = []  # min-heap of end times
    for start, end in intervals:
        if heap and heap[0] <= start:
            heapq.heapreplace(heap, end)
        else:
            heapq.heappush(heap, end)
    return len(heap)`,
          },
        ],
      },
    ],
  },
  {
    id: "linked-list",
    name: "Linked List",
    problems: [
      {
        num: 40, title: "Reverse Linked List", leetcodeNum: 206, slug: "reverse-linked-list",
        pattern: "Two pointers / iterative", visual: "prev → curr → next, advance both",
        difficulty: "easy",
        tags: ["Linked List"],
        description: "Given the head of a singly linked list, **reverse the list** and return the new head.\n\nIterative approach: maintain `prev` and `curr` pointers. On each step, save `curr.next`, point `curr.next` to `prev`, advance `prev` to `curr`, advance `curr` to saved next.",
        examples: [
          { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" },
          { input: "head = [1,2]", output: "[2,1]" },
        ],
        constraints: ["Number of nodes: [0, 5000]", "-5000 <= Node.val <= 5000"],
        approach: "Three-pointer iterative: prev=null, curr=head. Reverse one link at a time.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        solutions: [
          {
            language: "javascript",
            code: `function reverseList(head) {
  let prev = null, curr = head;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}`,
          },
          {
            language: "typescript",
            code: `function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null, curr = head;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}`,
          },
          {
            language: "php",
            code: `function reverseList(?ListNode $head): ?ListNode {
    $prev = null; $curr = $head;
    while ($curr) {
        $next = $curr->next;
        $curr->next = $prev;
        $prev = $curr;
        $curr = $next;
    }
    return $prev;
}`,
          },
          {
            language: "java",
            code: `public ListNode reverseList(ListNode head) {
    ListNode prev = null, curr = head;
    while (curr != null) {
        ListNode next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`,
          },
          {
            language: "python",
            code: `def reverseList(head: ListNode | None) -> ListNode | None:
    prev, curr = None, head
    while curr:
        curr.next, prev, curr = prev, curr, curr.next
    return prev`,
          },
        ],
      },
      {
        num: 41, title: "Linked List Cycle", leetcodeNum: 141, slug: "linked-list-cycle",
        pattern: "Fast & slow pointers", visual: "Meet = cycle; no meet = none",
        difficulty: "easy",
        tags: ["Linked List", "Two Pointers"],
        description: "Given the head of a linked list, determine if the linked list has a **cycle** in it.\n\nUse **Floyd's Tortoise and Hare**: slow pointer moves 1 step, fast pointer moves 2 steps. If they ever meet, there's a cycle. If fast reaches null, no cycle.",
        examples: [
          { input: "head = [3,2,0,-4], pos = 1", output: "true", explanation: "Tail connects to node at index 1." },
          { input: "head = [1,2], pos = 0", output: "true" },
          { input: "head = [1], pos = -1", output: "false" },
        ],
        constraints: ["Number of nodes: [0, 10^4]", "pos = -1 or valid index"],
        approach: "Slow moves 1 step, fast moves 2 steps. If fast or fast.next is null → no cycle. If slow === fast → cycle.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        solutions: [
          {
            language: "javascript",
            code: `function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
          },
          {
            language: "typescript",
            code: `function hasCycle(head: ListNode | null): boolean {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
          },
          {
            language: "php",
            code: `function hasCycle(?ListNode $head): bool {
    $slow = $head; $fast = $head;
    while ($fast && $fast->next) {
        $slow = $slow->next;
        $fast = $fast->next->next;
        if ($slow === $fast) return true;
    }
    return false;
}`,
          },
          {
            language: "java",
            code: `public boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}`,
          },
          {
            language: "python",
            code: `def hasCycle(head: ListNode | None) -> bool:
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False`,
          },
        ],
      },
      {
        num: 42, title: "Merge Two Sorted Lists", leetcodeNum: 21, slug: "merge-two-sorted-lists",
        pattern: "Dummy head iterative", visual: "Pick smaller node each step",
        difficulty: "easy",
        tags: ["Linked List", "Recursion"],
        description: "Merge two **sorted** linked lists and return the merged list in sorted order.\n\nUse a **dummy head node** to simplify edge cases. Maintain a `curr` pointer that appends the smaller of the two list heads each step. Attach the remaining list when one is exhausted.",
        examples: [
          { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]" },
          { input: "list1 = [], list2 = []", output: "[]" },
        ],
        constraints: ["Number of nodes: [0, 50]", "-100 <= Node.val <= 100"],
        approach: "Dummy head + curr pointer. While both lists have nodes, pick smaller. Append remaining.",
        timeComplexity: "O(m + n)",
        spaceComplexity: "O(1)",
        solutions: [
          {
            language: "javascript",
            code: `function mergeTwoLists(list1, list2) {
  const dummy = { next: null };
  let curr = dummy;
  while (list1 && list2) {
    if (list1.val <= list2.val) { curr.next = list1; list1 = list1.next; }
    else { curr.next = list2; list2 = list2.next; }
    curr = curr.next;
  }
  curr.next = list1 ?? list2;
  return dummy.next;
}`,
          },
          {
            language: "typescript",
            code: `function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {
  const dummy = new ListNode(0);
  let curr: ListNode = dummy;
  while (list1 && list2) {
    if (list1.val <= list2.val) { curr.next = list1; list1 = list1.next; }
    else { curr.next = list2; list2 = list2.next; }
    curr = curr.next!;
  }
  curr.next = list1 ?? list2;
  return dummy.next;
}`,
          },
          {
            language: "php",
            code: `function mergeTwoLists(?ListNode $list1, ?ListNode $list2): ?ListNode {
    $dummy = new ListNode(0); $curr = $dummy;
    while ($list1 && $list2) {
        if ($list1->val <= $list2->val) { $curr->next = $list1; $list1 = $list1->next; }
        else { $curr->next = $list2; $list2 = $list2->next; }
        $curr = $curr->next;
    }
    $curr->next = $list1 ?? $list2;
    return $dummy->next;
}`,
          },
          {
            language: "java",
            code: `public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
    ListNode dummy = new ListNode(0), curr = dummy;
    while (list1 != null && list2 != null) {
        if (list1.val <= list2.val) { curr.next = list1; list1 = list1.next; }
        else { curr.next = list2; list2 = list2.next; }
        curr = curr.next;
    }
    curr.next = list1 != null ? list1 : list2;
    return dummy.next;
}`,
          },
          {
            language: "python",
            code: `def mergeTwoLists(list1: ListNode | None, list2: ListNode | None) -> ListNode | None:
    dummy = curr = ListNode(0)
    while list1 and list2:
        if list1.val <= list2.val:
            curr.next, list1 = list1, list1.next
        else:
            curr.next, list2 = list2, list2.next
        curr = curr.next
    curr.next = list1 or list2
    return dummy.next`,
          },
        ],
      },
      {
        num: 43, title: "Merge k Sorted Lists", leetcodeNum: 23, slug: "merge-k-sorted-lists",
        pattern: "Min-heap of heads", visual: "Pop min, push next from same list",
        difficulty: "hard",
        tags: ["Linked List", "Heap", "Divide and Conquer"],
        description: "You are given `k` linked lists, each sorted in ascending order. Merge all of them into **one sorted linked list**.\n\n**Min-heap approach:** Push the head of every list into a min-heap. Repeatedly pop the minimum node, append it to the result, and push that node's `next` if it exists.",
        examples: [
          { input: "lists = [[1,4,5],[1,3,4],[2,6]]", output: "[1,1,2,3,4,4,5,6]" },
          { input: "lists = []", output: "[]" },
        ],
        constraints: ["k == lists.length", "0 <= k <= 10^4", "0 <= lists[i].length <= 500"],
        approach: "Min-heap (priority queue) of (value, node). Always extract minimum. O(N log k) time.",
        timeComplexity: "O(N log k) — N = total nodes, k = number of lists",
        spaceComplexity: "O(k)",
        solutions: [
          {
            language: "javascript",
            code: `function mergeKLists(lists) {
  // Divide and conquer approach (no built-in heap in JS)
  function mergeTwoLists(l1, l2) {
    const dummy = { next: null }; let curr = dummy;
    while (l1 && l2) {
      if (l1.val <= l2.val) { curr.next = l1; l1 = l1.next; }
      else { curr.next = l2; l2 = l2.next; }
      curr = curr.next;
    }
    curr.next = l1 ?? l2;
    return dummy.next;
  }
  if (!lists.length) return null;
  while (lists.length > 1) {
    const merged = [];
    for (let i = 0; i < lists.length; i += 2)
      merged.push(mergeTwoLists(lists[i], lists[i + 1] ?? null));
    lists = merged;
  }
  return lists[0];
}`,
          },
          {
            language: "typescript",
            code: `function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
  function merge(l1: ListNode | null, l2: ListNode | null): ListNode | null {
    const dummy = new ListNode(0); let curr: ListNode = dummy;
    while (l1 && l2) {
      if (l1.val <= l2.val) { curr.next = l1; l1 = l1.next; }
      else { curr.next = l2; l2 = l2.next; }
      curr = curr.next!;
    }
    curr.next = l1 ?? l2;
    return dummy.next;
  }
  if (!lists.length) return null;
  while (lists.length > 1) {
    const merged: Array<ListNode | null> = [];
    for (let i = 0; i < lists.length; i += 2)
      merged.push(merge(lists[i], lists[i + 1] ?? null));
    lists = merged;
  }
  return lists[0];
}`,
          },
          {
            language: "php",
            code: `function mergeKLists(array $lists): ?ListNode {
    function mergeTwoLists(?ListNode $l1, ?ListNode $l2): ?ListNode {
        $dummy = new ListNode(0); $curr = $dummy;
        while ($l1 && $l2) {
            if ($l1->val <= $l2->val) { $curr->next = $l1; $l1 = $l1->next; }
            else { $curr->next = $l2; $l2 = $l2->next; }
            $curr = $curr->next;
        }
        $curr->next = $l1 ?? $l2;
        return $dummy->next;
    }
    if (!$lists) return null;
    while (count($lists) > 1) {
        $merged = [];
        for ($i = 0; $i < count($lists); $i += 2)
            $merged[] = mergeTwoLists($lists[$i], $lists[$i + 1] ?? null);
        $lists = $merged;
    }
    return $lists[0];
}`,
          },
          {
            language: "java",
            code: `public ListNode mergeKLists(ListNode[] lists) {
    if (lists.length == 0) return null;
    PriorityQueue<ListNode> pq = new PriorityQueue<>((a, b) -> a.val - b.val);
    for (ListNode l : lists) if (l != null) pq.offer(l);
    ListNode dummy = new ListNode(0), curr = dummy;
    while (!pq.isEmpty()) {
        ListNode node = pq.poll();
        curr.next = node;
        curr = curr.next;
        if (node.next != null) pq.offer(node.next);
    }
    return dummy.next;
}`,
          },
          {
            language: "python",
            code: `import heapq

def mergeKLists(lists: list[ListNode | None]) -> ListNode | None:
    heap = []
    for i, node in enumerate(lists):
        if node:
            heapq.heappush(heap, (node.val, i, node))
    dummy = curr = ListNode(0)
    while heap:
        val, i, node = heapq.heappop(heap)
        curr.next = node
        curr = curr.next
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
    return dummy.next`,
          },
        ],
      },
      {
        num: 44, title: "Remove Nth Node From End of List", leetcodeNum: 19, slug: "remove-nth-node-from-end-of-list",
        pattern: "Two pointers gap", visual: "Advance fast n steps first",
        difficulty: "medium",
        tags: ["Linked List", "Two Pointers"],
        description: "Given the head of a linked list, remove the **nth node from the end** of the list and return its head.\n\nUse a **two-pointer gap**: advance `fast` pointer `n+1` steps ahead of `slow`. When `fast` reaches null, `slow` is right before the node to remove. Skip it with `slow.next = slow.next.next`.",
        examples: [
          { input: "head = [1,2,3,4,5], n = 2", output: "[1,2,3,5]" },
          { input: "head = [1], n = 1", output: "[]" },
        ],
        constraints: ["Number of nodes: [1, 30]", "1 <= n <= number of nodes"],
        approach: "Dummy head + gap of n+1 between fast and slow. When fast = null, slow.next is the target.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        solutions: [
          {
            language: "javascript",
            code: `function removeNthFromEnd(head, n) {
  const dummy = { next: head };
  let fast = dummy, slow = dummy;
  for (let i = 0; i <= n; i++) fast = fast.next;
  while (fast) { fast = fast.next; slow = slow.next; }
  slow.next = slow.next.next;
  return dummy.next;
}`,
          },
          {
            language: "typescript",
            code: `function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
  const dummy = new ListNode(0, head);
  let fast: ListNode | null = dummy, slow: ListNode | null = dummy;
  for (let i = 0; i <= n; i++) fast = fast!.next;
  while (fast) { fast = fast.next; slow = slow!.next; }
  slow!.next = slow!.next!.next;
  return dummy.next;
}`,
          },
          {
            language: "php",
            code: `function removeNthFromEnd(?ListNode $head, int $n): ?ListNode {
    $dummy = new ListNode(0); $dummy->next = $head;
    $fast = $dummy; $slow = $dummy;
    for ($i = 0; $i <= $n; $i++) $fast = $fast->next;
    while ($fast) { $fast = $fast->next; $slow = $slow->next; }
    $slow->next = $slow->next->next;
    return $dummy->next;
}`,
          },
          {
            language: "java",
            code: `public ListNode removeNthFromEnd(ListNode head, int n) {
    ListNode dummy = new ListNode(0, head);
    ListNode fast = dummy, slow = dummy;
    for (int i = 0; i <= n; i++) fast = fast.next;
    while (fast != null) { fast = fast.next; slow = slow.next; }
    slow.next = slow.next.next;
    return dummy.next;
}`,
          },
          {
            language: "python",
            code: `def removeNthFromEnd(head: ListNode | None, n: int) -> ListNode | None:
    dummy = ListNode(0, head)
    fast = slow = dummy
    for _ in range(n + 1):
        fast = fast.next
    while fast:
        fast = fast.next
        slow = slow.next
    slow.next = slow.next.next
    return dummy.next`,
          },
        ],
      },
      {
        num: 45, title: "Reorder List", leetcodeNum: 143, slug: "reorder-list",
        pattern: "Find mid + reverse + merge", visual: "Split, reverse second half, interleave",
        difficulty: "medium",
        tags: ["Linked List", "Two Pointers", "Stack"],
        description: "Given the head of a singly linked list L0→L1→…→Ln, reorder it to: L0→Ln→L1→Ln-1→L2→Ln-2→…\n\nThree steps:\n1. **Find the middle** (slow/fast pointers)\n2. **Reverse the second half**\n3. **Merge the two halves** by interleaving nodes",
        examples: [
          { input: "head = [1,2,3,4]", output: "[1,4,2,3]" },
          { input: "head = [1,2,3,4,5]", output: "[1,5,2,4,3]" },
        ],
        constraints: ["Number of nodes: [1, 5 * 10^4]", "1 <= Node.val <= 1000"],
        approach: "Find mid with slow/fast. Reverse second half in-place. Interleave from both ends.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        solutions: [
          {
            language: "javascript",
            code: `function reorderList(head) {
  // Find mid
  let slow = head, fast = head;
  while (fast.next && fast.next.next) { slow = slow.next; fast = fast.next.next; }
  // Reverse second half
  let prev = null, curr = slow.next; slow.next = null;
  while (curr) { const next = curr.next; curr.next = prev; prev = curr; curr = next; }
  // Merge
  let first = head, second = prev;
  while (second) {
    const tmp1 = first.next, tmp2 = second.next;
    first.next = second; second.next = tmp1;
    first = tmp1; second = tmp2;
  }
}`,
          },
          {
            language: "typescript",
            code: `function reorderList(head: ListNode | null): void {
  if (!head) return;
  let slow: ListNode = head, fast: ListNode | null = head;
  while (fast.next && fast.next.next) { slow = slow.next!; fast = fast.next.next; }
  let prev: ListNode | null = null, curr: ListNode | null = slow.next; slow.next = null;
  while (curr) { const next = curr.next; curr.next = prev; prev = curr; curr = next; }
  let first: ListNode | null = head, second: ListNode | null = prev;
  while (second) {
    const tmp1 = first!.next, tmp2 = second.next;
    first!.next = second; second.next = tmp1;
    first = tmp1; second = tmp2;
  }
}`,
          },
          {
            language: "php",
            code: `function reorderList(?ListNode $head): void {
    if (!$head) return;
    $slow = $head; $fast = $head;
    while ($fast->next && $fast->next->next) { $slow = $slow->next; $fast = $fast->next->next; }
    $prev = null; $curr = $slow->next; $slow->next = null;
    while ($curr) { $next = $curr->next; $curr->next = $prev; $prev = $curr; $curr = $next; }
    $first = $head; $second = $prev;
    while ($second) {
        $tmp1 = $first->next; $tmp2 = $second->next;
        $first->next = $second; $second->next = $tmp1;
        $first = $tmp1; $second = $tmp2;
    }
}`,
          },
          {
            language: "java",
            code: `public void reorderList(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast.next != null && fast.next.next != null) { slow = slow.next; fast = fast.next.next; }
    ListNode prev = null, curr = slow.next; slow.next = null;
    while (curr != null) { ListNode next = curr.next; curr.next = prev; prev = curr; curr = next; }
    ListNode first = head, second = prev;
    while (second != null) {
        ListNode tmp1 = first.next, tmp2 = second.next;
        first.next = second; second.next = tmp1;
        first = tmp1; second = tmp2;
    }
}`,
          },
          {
            language: "python",
            code: `def reorderList(head: ListNode | None) -> None:
    slow = fast = head
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next
    # Reverse second half
    prev, curr = None, slow.next
    slow.next = None
    while curr:
        curr.next, prev, curr = prev, curr, curr.next
    # Merge
    first, second = head, prev
    while second:
        tmp1, tmp2 = first.next, second.next
        first.next = second
        second.next = tmp1
        first, second = tmp1, tmp2`,
          },
        ],
      },
      {
        num: 46, title: "Find the Duplicate Number", leetcodeNum: 287, slug: "find-the-duplicate-number",
        pattern: "Floyd's cycle detection", visual: "Treat array as linked list",
        difficulty: "medium",
        tags: ["Array", "Two Pointers", "Linked List"],
        description: "Given an array `nums` of `n+1` integers where each is in `[1, n]`, there is **exactly one duplicate** number. Find it without modifying the array and using O(1) extra space.\n\n**Key insight:** treat `nums` as a linked list where `nums[i]` is the next pointer. The duplicate creates a cycle. Apply Floyd's cycle detection — the cycle entry point is the duplicate.",
        examples: [
          { input: "nums = [1,3,4,2,2]", output: "2" },
          { input: "nums = [3,1,3,4,2]", output: "3" },
        ],
        constraints: ["1 <= n <= 10^5", "nums.length == n + 1", "1 <= nums[i] <= n", "Only one duplicate (may appear multiple times)"],
        approach: "Phase 1: slow/fast meet inside cycle. Phase 2: reset slow to head; advance both by 1 until they meet — that's the duplicate.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        solutions: [
          {
            language: "javascript",
            code: `function findDuplicate(nums) {
  let slow = nums[0], fast = nums[0];
  do { slow = nums[slow]; fast = nums[nums[fast]]; } while (slow !== fast);
  slow = nums[0];
  while (slow !== fast) { slow = nums[slow]; fast = nums[fast]; }
  return slow;
}`,
          },
          {
            language: "typescript",
            code: `function findDuplicate(nums: number[]): number {
  let slow = nums[0], fast = nums[0];
  do { slow = nums[slow]; fast = nums[nums[fast]]; } while (slow !== fast);
  slow = nums[0];
  while (slow !== fast) { slow = nums[slow]; fast = nums[fast]; }
  return slow;
}`,
          },
          {
            language: "php",
            code: `function findDuplicate(array $nums): int {
    $slow = $nums[0]; $fast = $nums[0];
    do { $slow = $nums[$slow]; $fast = $nums[$nums[$fast]]; } while ($slow !== $fast);
    $slow = $nums[0];
    while ($slow !== $fast) { $slow = $nums[$slow]; $fast = $nums[$fast]; }
    return $slow;
}`,
          },
          {
            language: "java",
            code: `public int findDuplicate(int[] nums) {
    int slow = nums[0], fast = nums[0];
    do { slow = nums[slow]; fast = nums[nums[fast]]; } while (slow != fast);
    slow = nums[0];
    while (slow != fast) { slow = nums[slow]; fast = nums[fast]; }
    return slow;
}`,
          },
          {
            language: "python",
            code: `def findDuplicate(nums: list[int]) -> int:
    slow = fast = nums[0]
    while True:
        slow = nums[slow]
        fast = nums[nums[fast]]
        if slow == fast:
            break
    slow = nums[0]
    while slow != fast:
        slow = nums[slow]
        fast = nums[fast]
    return slow`,
          },
        ],
      },
    ],
  },
  {
    id: "matrix",
    name: "Matrix",
    problems: [
      {
        num: 47, title: "Set Matrix Zeroes", leetcodeNum: 73, slug: "set-matrix-zeroes",
        pattern: "In-place flags", visual: "Use row[0] & col[0] as markers",
        difficulty: "medium",
        tags: ["Array", "Matrix"],
        description: "Given an `m x n` matrix, if any cell is `0`, set its **entire row and column to 0** in-place.\n\n**O(1) space trick:** Use the first row and first column as markers. A separate boolean tracks whether the first row/column themselves should be zeroed.",
        examples: [
          { input: "matrix = [[1,1,1],[1,0,1],[1,1,1]]", output: "[[1,0,1],[0,0,0],[1,0,1]]" },
          { input: "matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]", output: "[[0,0,0,0],[0,4,5,0],[0,3,1,0]]" },
        ],
        constraints: ["m == matrix.length", "n == matrix[0].length", "1 <= m, n <= 200"],
        approach: "Use first row/col as flags. Scan interior cells, mark flags. Then zero rows/cols. Finally handle first row/col.",
        timeComplexity: "O(m × n)",
        spaceComplexity: "O(1)",
        solutions: [
          {
            language: "javascript",
            code: `function setZeroes(matrix) {
  const m = matrix.length, n = matrix[0].length;
  let firstRowZero = matrix[0].includes(0);
  let firstColZero = matrix.some(row => row[0] === 0);
  for (let r = 1; r < m; r++)
    for (let c = 1; c < n; c++)
      if (matrix[r][c] === 0) { matrix[r][0] = 0; matrix[0][c] = 0; }
  for (let r = 1; r < m; r++)
    for (let c = 1; c < n; c++)
      if (matrix[r][0] === 0 || matrix[0][c] === 0) matrix[r][c] = 0;
  if (firstRowZero) for (let c = 0; c < n; c++) matrix[0][c] = 0;
  if (firstColZero) for (let r = 0; r < m; r++) matrix[r][0] = 0;
}`,
          },
          {
            language: "typescript",
            code: `function setZeroes(matrix: number[][]): void {
  const m = matrix.length, n = matrix[0].length;
  let firstRowZero = matrix[0].includes(0);
  let firstColZero = matrix.some(row => row[0] === 0);
  for (let r = 1; r < m; r++)
    for (let c = 1; c < n; c++)
      if (matrix[r][c] === 0) { matrix[r][0] = 0; matrix[0][c] = 0; }
  for (let r = 1; r < m; r++)
    for (let c = 1; c < n; c++)
      if (matrix[r][0] === 0 || matrix[0][c] === 0) matrix[r][c] = 0;
  if (firstRowZero) for (let c = 0; c < n; c++) matrix[0][c] = 0;
  if (firstColZero) for (let r = 0; r < m; r++) matrix[r][0] = 0;
}`,
          },
          {
            language: "php",
            code: `function setZeroes(array &$matrix): void {
    $m = count($matrix); $n = count($matrix[0]);
    $firstRowZero = in_array(0, $matrix[0]);
    $firstColZero = array_reduce($matrix, fn($carry, $row) => $carry || $row[0] === 0, false);
    for ($r = 1; $r < $m; $r++)
        for ($c = 1; $c < $n; $c++)
            if ($matrix[$r][$c] === 0) { $matrix[$r][0] = 0; $matrix[0][$c] = 0; }
    for ($r = 1; $r < $m; $r++)
        for ($c = 1; $c < $n; $c++)
            if ($matrix[$r][0] === 0 || $matrix[0][$c] === 0) $matrix[$r][$c] = 0;
    if ($firstRowZero) for ($c = 0; $c < $n; $c++) $matrix[0][$c] = 0;
    if ($firstColZero) for ($r = 0; $r < $m; $r++) $matrix[$r][0] = 0;
}`,
          },
          {
            language: "java",
            code: `public void setZeroes(int[][] matrix) {
    int m = matrix.length, n = matrix[0].length;
    boolean firstRowZero = false, firstColZero = false;
    for (int c = 0; c < n; c++) if (matrix[0][c] == 0) firstRowZero = true;
    for (int r = 0; r < m; r++) if (matrix[r][0] == 0) firstColZero = true;
    for (int r = 1; r < m; r++) for (int c = 1; c < n; c++) if (matrix[r][c] == 0) { matrix[r][0] = 0; matrix[0][c] = 0; }
    for (int r = 1; r < m; r++) for (int c = 1; c < n; c++) if (matrix[r][0] == 0 || matrix[0][c] == 0) matrix[r][c] = 0;
    if (firstRowZero) for (int c = 0; c < n; c++) matrix[0][c] = 0;
    if (firstColZero) for (int r = 0; r < m; r++) matrix[r][0] = 0;
}`,
          },
          {
            language: "python",
            code: `def setZeroes(matrix: list[list[int]]) -> None:
    m, n = len(matrix), len(matrix[0])
    first_row_zero = 0 in matrix[0]
    first_col_zero = any(matrix[r][0] == 0 for r in range(m))
    for r in range(1, m):
        for c in range(1, n):
            if matrix[r][c] == 0:
                matrix[r][0] = matrix[0][c] = 0
    for r in range(1, m):
        for c in range(1, n):
            if matrix[r][0] == 0 or matrix[0][c] == 0:
                matrix[r][c] = 0
    if first_row_zero:
        for c in range(n): matrix[0][c] = 0
    if first_col_zero:
        for r in range(m): matrix[r][0] = 0`,
          },
        ],
      },
      {
        num: 48, title: "Spiral Matrix", leetcodeNum: 54, slug: "spiral-matrix",
        pattern: "Boundary shrink", visual: "Right, down, left, up; shrink bounds",
        difficulty: "medium",
        tags: ["Array", "Matrix", "Simulation"],
        description: "Given an `m x n` matrix, return all elements of the matrix in **spiral order**.\n\nMaintain four boundaries: `top`, `bottom`, `left`, `right`. Traverse right → down → left → up, shrinking the corresponding boundary after each pass.",
        examples: [
          { input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]", output: "[1,2,3,6,9,8,7,4,5]" },
          { input: "matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]", output: "[1,2,3,4,8,12,11,10,9,5,6,7]" },
        ],
        constraints: ["m == matrix.length", "n == matrix[i].length", "1 <= m, n <= 10"],
        approach: "Four pointers (top, bottom, left, right). Traverse each boundary, then shrink inward.",
        timeComplexity: "O(m × n)",
        spaceComplexity: "O(1) extra (output not counted)",
        solutions: [
          {
            language: "javascript",
            code: `function spiralOrder(matrix) {
  const result = [];
  let top = 0, bottom = matrix.length - 1, left = 0, right = matrix[0].length - 1;
  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) result.push(matrix[top][c]); top++;
    for (let r = top; r <= bottom; r++) result.push(matrix[r][right]); right--;
    if (top <= bottom) { for (let c = right; c >= left; c--) result.push(matrix[bottom][c]); bottom--; }
    if (left <= right) { for (let r = bottom; r >= top; r--) result.push(matrix[r][left]); left++; }
  }
  return result;
}`,
          },
          {
            language: "typescript",
            code: `function spiralOrder(matrix: number[][]): number[] {
  const result: number[] = [];
  let top = 0, bottom = matrix.length - 1, left = 0, right = matrix[0].length - 1;
  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) result.push(matrix[top][c]); top++;
    for (let r = top; r <= bottom; r++) result.push(matrix[r][right]); right--;
    if (top <= bottom) { for (let c = right; c >= left; c--) result.push(matrix[bottom][c]); bottom--; }
    if (left <= right) { for (let r = bottom; r >= top; r--) result.push(matrix[r][left]); left++; }
  }
  return result;
}`,
          },
          {
            language: "php",
            code: `function spiralOrder(array $matrix): array {
    $result = [];
    $top = 0; $bottom = count($matrix) - 1; $left = 0; $right = count($matrix[0]) - 1;
    while ($top <= $bottom && $left <= $right) {
        for ($c = $left; $c <= $right; $c++) $result[] = $matrix[$top][$c]; $top++;
        for ($r = $top; $r <= $bottom; $r++) $result[] = $matrix[$r][$right]; $right--;
        if ($top <= $bottom) { for ($c = $right; $c >= $left; $c--) $result[] = $matrix[$bottom][$c]; $bottom--; }
        if ($left <= $right) { for ($r = $bottom; $r >= $top; $r--) $result[] = $matrix[$r][$left]; $left++; }
    }
    return $result;
}`,
          },
          {
            language: "java",
            code: `public List<Integer> spiralOrder(int[][] matrix) {
    List<Integer> result = new ArrayList<>();
    int top = 0, bottom = matrix.length - 1, left = 0, right = matrix[0].length - 1;
    while (top <= bottom && left <= right) {
        for (int c = left; c <= right; c++) result.add(matrix[top][c]); top++;
        for (int r = top; r <= bottom; r++) result.add(matrix[r][right]); right--;
        if (top <= bottom) { for (int c = right; c >= left; c--) result.add(matrix[bottom][c]); bottom--; }
        if (left <= right) { for (int r = bottom; r >= top; r--) result.add(matrix[r][left]); left++; }
    }
    return result;
}`,
          },
          {
            language: "python",
            code: `def spiralOrder(matrix: list[list[int]]) -> list[int]:
    result = []
    top, bottom, left, right = 0, len(matrix)-1, 0, len(matrix[0])-1
    while top <= bottom and left <= right:
        for c in range(left, right+1): result.append(matrix[top][c])
        top += 1
        for r in range(top, bottom+1): result.append(matrix[r][right])
        right -= 1
        if top <= bottom:
            for c in range(right, left-1, -1): result.append(matrix[bottom][c])
            bottom -= 1
        if left <= right:
            for r in range(bottom, top-1, -1): result.append(matrix[r][left])
            left += 1
    return result`,
          },
        ],
      },
      {
        num: 49, title: "Rotate Image", leetcodeNum: 48, slug: "rotate-image",
        pattern: "Transpose + reflect", visual: "Transpose then reverse each row",
        difficulty: "medium",
        tags: ["Array", "Matrix", "Math"],
        description: "Given an `n x n` 2D matrix representing an image, **rotate it 90 degrees clockwise** in-place.\n\nTwo steps:\n1. **Transpose** the matrix (swap `matrix[i][j]` with `matrix[j][i]`)\n2. **Reverse** each row horizontally",
        examples: [
          { input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]", output: "[[7,4,1],[8,5,2],[9,6,3]]" },
          { input: "matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]", output: "[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]" },
        ],
        constraints: ["n == matrix.length == matrix[i].length", "1 <= n <= 20"],
        approach: "Transpose (swap across diagonal) then reverse each row — two O(n²) passes.",
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)",
        solutions: [
          {
            language: "javascript",
            code: `function rotate(matrix) {
  const n = matrix.length;
  // Transpose
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++)
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
  // Reverse each row
  for (let i = 0; i < n; i++) matrix[i].reverse();
}`,
          },
          {
            language: "typescript",
            code: `function rotate(matrix: number[][]): void {
  const n = matrix.length;
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++)
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
  for (let i = 0; i < n; i++) matrix[i].reverse();
}`,
          },
          {
            language: "php",
            code: `function rotate(array &$matrix): void {
    $n = count($matrix);
    for ($i = 0; $i < $n; $i++)
        for ($j = $i + 1; $j < $n; $j++)
            [$matrix[$i][$j], $matrix[$j][$i]] = [$matrix[$j][$i], $matrix[$i][$j]];
    foreach ($matrix as &$row) $row = array_reverse($row);
}`,
          },
          {
            language: "java",
            code: `public void rotate(int[][] matrix) {
    int n = matrix.length;
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++) { int t = matrix[i][j]; matrix[i][j] = matrix[j][i]; matrix[j][i] = t; }
    for (int i = 0; i < n; i++) {
        int lo = 0, hi = n - 1;
        while (lo < hi) { int t = matrix[i][lo]; matrix[i][lo++] = matrix[i][hi]; matrix[i][hi--] = t; }
    }
}`,
          },
          {
            language: "python",
            code: `def rotate(matrix: list[list[int]]) -> None:
    n = len(matrix)
    # Transpose
    for i in range(n):
        for j in range(i+1, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    # Reverse each row
    for row in matrix:
        row.reverse()`,
          },
        ],
      },
      {
        num: 50, title: "Word Search", leetcodeNum: 79, slug: "word-search",
        pattern: "DFS + backtrack", visual: "Mark visited, unmark on return",
        difficulty: "medium",
        tags: ["Array", "Matrix", "DFS", "Backtracking"],
        description: "Given an `m x n` grid of characters and a string `word`, return `true` if the word exists in the grid (formed by adjacent cells horizontally or vertically; cells may not be reused).\n\nDFS + backtracking: for each cell matching the first character, DFS outward. Mark cells as visited by temporarily changing the character; restore on backtrack.",
        examples: [
          { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"', output: "true" },
          { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"', output: "true" },
          { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB"', output: "false" },
        ],
        constraints: ["m == board.length", "n == board[i].length", "1 <= m, n <= 6", "1 <= word.length <= 15"],
        approach: "For each starting cell, DFS exploring 4 directions. Mark visited in-place; restore on backtrack.",
        timeComplexity: "O(m × n × 4^L) — L = word length",
        spaceComplexity: "O(L) — recursion stack",
        solutions: [
          {
            language: "javascript",
            code: `function exist(board, word) {
  const m = board.length, n = board[0].length;
  function dfs(r, c, idx) {
    if (idx === word.length) return true;
    if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] !== word[idx]) return false;
    const tmp = board[r][c]; board[r][c] = '#';
    const found = dfs(r+1,c,idx+1) || dfs(r-1,c,idx+1) || dfs(r,c+1,idx+1) || dfs(r,c-1,idx+1);
    board[r][c] = tmp;
    return found;
  }
  for (let r = 0; r < m; r++)
    for (let c = 0; c < n; c++)
      if (dfs(r, c, 0)) return true;
  return false;
}`,
          },
          {
            language: "typescript",
            code: `function exist(board: string[][], word: string): boolean {
  const m = board.length, n = board[0].length;
  function dfs(r: number, c: number, idx: number): boolean {
    if (idx === word.length) return true;
    if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] !== word[idx]) return false;
    const tmp = board[r][c]; board[r][c] = '#';
    const found = dfs(r+1,c,idx+1)||dfs(r-1,c,idx+1)||dfs(r,c+1,idx+1)||dfs(r,c-1,idx+1);
    board[r][c] = tmp;
    return found;
  }
  for (let r = 0; r < m; r++)
    for (let c = 0; c < n; c++)
      if (dfs(r, c, 0)) return true;
  return false;
}`,
          },
          {
            language: "php",
            code: `function exist(array $board, string $word): bool {
    $m = count($board); $n = count($board[0]);
    function dfs(array &$board, int $r, int $c, string $word, int $idx, int $m, int $n): bool {
        if ($idx === strlen($word)) return true;
        if ($r < 0 || $r >= $m || $c < 0 || $c >= $n || $board[$r][$c] !== $word[$idx]) return false;
        $tmp = $board[$r][$c]; $board[$r][$c] = '#';
        $found = dfs($board,$r+1,$c,$word,$idx+1,$m,$n)||dfs($board,$r-1,$c,$word,$idx+1,$m,$n)||
                 dfs($board,$r,$c+1,$word,$idx+1,$m,$n)||dfs($board,$r,$c-1,$word,$idx+1,$m,$n);
        $board[$r][$c] = $tmp;
        return $found;
    }
    for ($r = 0; $r < $m; $r++)
        for ($c = 0; $c < $n; $c++)
            if (dfs($board, $r, $c, $word, 0, $m, $n)) return true;
    return false;
}`,
          },
          {
            language: "java",
            code: `public boolean exist(char[][] board, String word) {
    int m = board.length, n = board[0].length;
    for (int r = 0; r < m; r++)
        for (int c = 0; c < n; c++)
            if (dfs(board, word, r, c, 0, m, n)) return true;
    return false;
}
private boolean dfs(char[][] board, String word, int r, int c, int idx, int m, int n) {
    if (idx == word.length()) return true;
    if (r < 0||r >= m||c < 0||c >= n||board[r][c] != word.charAt(idx)) return false;
    char tmp = board[r][c]; board[r][c] = '#';
    boolean found = dfs(board,word,r+1,c,idx+1,m,n)||dfs(board,word,r-1,c,idx+1,m,n)||
                    dfs(board,word,r,c+1,idx+1,m,n)||dfs(board,word,r,c-1,idx+1,m,n);
    board[r][c] = tmp;
    return found;
}`,
          },
          {
            language: "python",
            code: `def exist(board: list[list[str]], word: str) -> bool:
    m, n = len(board), len(board[0])
    def dfs(r, c, idx):
        if idx == len(word): return True
        if r < 0 or r >= m or c < 0 or c >= n or board[r][c] != word[idx]: return False
        tmp, board[r][c] = board[r][c], '#'
        found = dfs(r+1,c,idx+1) or dfs(r-1,c,idx+1) or dfs(r,c+1,idx+1) or dfs(r,c-1,idx+1)
        board[r][c] = tmp
        return found
    return any(dfs(r, c, 0) for r in range(m) for c in range(n))`,
          },
        ],
      },
      {
        num: 51, title: "Search a 2D Matrix", leetcodeNum: 74, slug: "search-a-2d-matrix",
        pattern: "Binary search", visual: "Treat 2D as flat sorted array",
        difficulty: "medium",
        tags: ["Array", "Matrix", "Binary Search"],
        description: "Given an `m x n` matrix where each row is sorted left-to-right and the first element of each row is greater than the last of the previous row, search for an integer `target`. Return `true` if found.\n\nTreat the entire matrix as a **flat sorted array** of `m*n` elements and apply binary search. Convert mid index to `(mid/n, mid%n)` to access the matrix cell.",
        examples: [
          { input: "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3", output: "true" },
          { input: "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13", output: "false" },
        ],
        constraints: ["m == matrix.length", "n == matrix[i].length", "1 <= m, n <= 100"],
        approach: "Binary search on [0, m*n-1]. Access matrix[mid/n][mid%n]. O(log(m*n)) = O(log m + log n).",
        timeComplexity: "O(log(m × n))",
        spaceComplexity: "O(1)",
        solutions: [
          {
            language: "javascript",
            code: `function searchMatrix(matrix, target) {
  const m = matrix.length, n = matrix[0].length;
  let lo = 0, hi = m * n - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const val = matrix[Math.floor(mid / n)][mid % n];
    if (val === target) return true;
    else if (val < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return false;
}`,
          },
          {
            language: "typescript",
            code: `function searchMatrix(matrix: number[][], target: number): boolean {
  const m = matrix.length, n = matrix[0].length;
  let lo = 0, hi = m * n - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const val = matrix[Math.floor(mid / n)][mid % n];
    if (val === target) return true;
    else if (val < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return false;
}`,
          },
          {
            language: "php",
            code: `function searchMatrix(array $matrix, int $target): bool {
    $m = count($matrix); $n = count($matrix[0]);
    $lo = 0; $hi = $m * $n - 1;
    while ($lo <= $hi) {
        $mid = ($lo + $hi) >> 1;
        $val = $matrix[intdiv($mid, $n)][$mid % $n];
        if ($val === $target) return true;
        elseif ($val < $target) $lo = $mid + 1;
        else $hi = $mid - 1;
    }
    return false;
}`,
          },
          {
            language: "java",
            code: `public boolean searchMatrix(int[][] matrix, int target) {
    int m = matrix.length, n = matrix[0].length;
    int lo = 0, hi = m * n - 1;
    while (lo <= hi) {
        int mid = (lo + hi) / 2;
        int val = matrix[mid / n][mid % n];
        if (val == target) return true;
        else if (val < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return false;
}`,
          },
          {
            language: "python",
            code: `def searchMatrix(matrix: list[list[int]], target: int) -> bool:
    m, n = len(matrix), len(matrix[0])
    lo, hi = 0, m * n - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        val = matrix[mid // n][mid % n]
        if val == target: return True
        elif val < target: lo = mid + 1
        else: hi = mid - 1
    return False`,
          },
        ],
      },
    ],
  },
  {
    id: "string",
    name: "String",
    problems: [
      {
        num: 52, title: "Minimum Window Substring", leetcodeNum: 76, slug: "minimum-window-substring",
        pattern: "Variable window + counts", visual: "Expand right, shrink left when valid",
        difficulty: "hard",
        tags: ["String", "Sliding Window", "Hash Table"],
        description: "Given strings `s` and `t`, return the **minimum window substring** of `s` that contains all characters of `t`. If no such window exists, return `\"\"`.\n\nUse a **sliding window** with two frequency maps. Expand the right pointer to include characters; once all of `t` is covered, shrink the left pointer to minimize the window.",
        examples: [
          { input: 's = "ADOBECODEBANC", t = "ABC"', output: '"BANC"' },
          { input: 's = "a", t = "a"', output: '"a"' },
          { input: 's = "a", t = "aa"', output: '""' },
        ],
        constraints: ["m == s.length", "n == t.length", "1 <= m, n <= 10^5"],
        approach: "Two-pointer window. Track need/have counts. Shrink left when window is valid; track minimum.",
        timeComplexity: "O(m + n)",
        spaceComplexity: "O(m + n)",
        solutions: [
          {
            language: "javascript",
            code: `function minWindow(s, t) {
  if (!t) return "";
  const need = {}, window = {};
  for (const c of t) need[c] = (need[c] || 0) + 1;
  let have = 0, required = Object.keys(need).length;
  let left = 0, minLen = Infinity, minLeft = 0;
  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    window[c] = (window[c] || 0) + 1;
    if (need[c] && window[c] === need[c]) have++;
    while (have === required) {
      if (right - left + 1 < minLen) { minLen = right - left + 1; minLeft = left; }
      window[s[left]]--;
      if (need[s[left]] && window[s[left]] < need[s[left]]) have--;
      left++;
    }
  }
  return minLen === Infinity ? "" : s.slice(minLeft, minLeft + minLen);
}`,
          },
          {
            language: "typescript",
            code: `function minWindow(s: string, t: string): string {
  const need: Record<string, number> = {}, window: Record<string, number> = {};
  for (const c of t) need[c] = (need[c] || 0) + 1;
  let have = 0, required = Object.keys(need).length;
  let left = 0, minLen = Infinity, minLeft = 0;
  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    window[c] = (window[c] || 0) + 1;
    if (need[c] && window[c] === need[c]) have++;
    while (have === required) {
      if (right - left + 1 < minLen) { minLen = right - left + 1; minLeft = left; }
      window[s[left]]--;
      if (need[s[left]] && window[s[left]] < need[s[left]]) have--;
      left++;
    }
  }
  return minLen === Infinity ? "" : s.slice(minLeft, minLeft + minLen);
}`,
          },
          {
            language: "php",
            code: `function minWindow(string $s, string $t): string {
    $need = []; foreach (str_split($t) as $c) $need[$c] = ($need[$c] ?? 0) + 1;
    $window = []; $have = 0; $required = count($need);
    $left = 0; $minLen = PHP_INT_MAX; $minLeft = 0;
    for ($right = 0; $right < strlen($s); $right++) {
        $c = $s[$right]; $window[$c] = ($window[$c] ?? 0) + 1;
        if (isset($need[$c]) && $window[$c] === $need[$c]) $have++;
        while ($have === $required) {
            if ($right - $left + 1 < $minLen) { $minLen = $right - $left + 1; $minLeft = $left; }
            $window[$s[$left]]--;
            if (isset($need[$s[$left]]) && $window[$s[$left]] < $need[$s[$left]]) $have--;
            $left++;
        }
    }
    return $minLen === PHP_INT_MAX ? "" : substr($s, $minLeft, $minLen);
}`,
          },
          {
            language: "java",
            code: `public String minWindow(String s, String t) {
    Map<Character, Integer> need = new HashMap<>(), window = new HashMap<>();
    for (char c : t.toCharArray()) need.merge(c, 1, Integer::sum);
    int have = 0, required = need.size(), left = 0, minLen = Integer.MAX_VALUE, minLeft = 0;
    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        window.merge(c, 1, Integer::sum);
        if (need.containsKey(c) && window.get(c).equals(need.get(c))) have++;
        while (have == required) {
            if (right - left + 1 < minLen) { minLen = right - left + 1; minLeft = left; }
            char lc = s.charAt(left);
            window.merge(lc, -1, Integer::sum);
            if (need.containsKey(lc) && window.get(lc) < need.get(lc)) have--;
            left++;
        }
    }
    return minLen == Integer.MAX_VALUE ? "" : s.substring(minLeft, minLeft + minLen);
}`,
          },
          {
            language: "python",
            code: `from collections import Counter

def minWindow(s: str, t: str) -> str:
    need = Counter(t)
    window = {}
    have, required = 0, len(need)
    left = 0
    min_len, min_left = float('inf'), 0
    for right, c in enumerate(s):
        window[c] = window.get(c, 0) + 1
        if c in need and window[c] == need[c]:
            have += 1
        while have == required:
            if right - left + 1 < min_len:
                min_len, min_left = right - left + 1, left
            window[s[left]] -= 1
            if s[left] in need and window[s[left]] < need[s[left]]:
                have -= 1
            left += 1
    return "" if min_len == float('inf') else s[min_left:min_left + min_len]`,
          },
        ],
      },
      {
        num: 53, title: "Valid Anagram", leetcodeNum: 242, slug: "valid-anagram",
        pattern: "Count compare", visual: "26-length array",
        difficulty: "easy",
        tags: ["String", "Hash Table", "Sorting"],
        description: "Given two strings `s` and `t`, return `true` if `t` is an **anagram** of `s` (same characters, same frequencies).\n\nCount character frequencies in both strings and compare. A single 26-element array works: increment for `s`, decrement for `t`, then check all zeros.",
        examples: [
          { input: 's = "anagram", t = "nagaram"', output: "true" },
          { input: 's = "rat", t = "car"', output: "false" },
        ],
        constraints: ["1 <= s.length, t.length <= 5 * 10^4", "s and t consist of lowercase English letters"],
        approach: "Use a 26-element count array. +1 for s chars, -1 for t chars. Return true if all zeros.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        solutions: [
          {
            language: "javascript",
            code: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const count = new Array(26).fill(0);
  for (let i = 0; i < s.length; i++) {
    count[s.charCodeAt(i) - 97]++;
    count[t.charCodeAt(i) - 97]--;
  }
  return count.every(c => c === 0);
}`,
          },
          {
            language: "typescript",
            code: `function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;
  const count = new Array(26).fill(0);
  for (let i = 0; i < s.length; i++) {
    count[s.charCodeAt(i) - 97]++;
    count[t.charCodeAt(i) - 97]--;
  }
  return count.every(c => c === 0);
}`,
          },
          {
            language: "php",
            code: `function isAnagram(string $s, string $t): bool {
    if (strlen($s) !== strlen($t)) return false;
    $count = array_fill(0, 26, 0);
    for ($i = 0; $i < strlen($s); $i++) {
        $count[ord($s[$i]) - 97]++;
        $count[ord($t[$i]) - 97]--;
    }
    return array_sum(array_map('abs', $count)) === 0;
}`,
          },
          {
            language: "java",
            code: `public boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) return false;
    int[] count = new int[26];
    for (int i = 0; i < s.length(); i++) {
        count[s.charAt(i) - 'a']++;
        count[t.charAt(i) - 'a']--;
    }
    for (int c : count) if (c != 0) return false;
    return true;
}`,
          },
          {
            language: "python",
            code: `from collections import Counter

def isAnagram(s: str, t: str) -> bool:
    return Counter(s) == Counter(t)`,
          },
        ],
      },
      {
        num: 54, title: "Group Anagrams", leetcodeNum: 49, slug: "group-anagrams",
        pattern: "Sorted-key hash", visual: "Group by sorted string / count tuple",
        difficulty: "medium",
        tags: ["String", "Hash Table", "Sorting"],
        description: "Given an array of strings `strs`, group the **anagrams** together and return them in any order.\n\nAnagrams share the same sorted character string. Use that as a hash map key — all anagrams map to the same key and get grouped together.",
        examples: [
          { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' },
          { input: 'strs = [""]', output: '[[""]]' },
        ],
        constraints: ["1 <= strs.length <= 10^4", "0 <= strs[i].length <= 100", "strs[i] consists of lowercase English letters"],
        approach: "Sort each string to get the canonical key. Group strings by their key in a hash map.",
        timeComplexity: "O(n × k log k) — k = max string length",
        spaceComplexity: "O(n × k)",
        solutions: [
          {
            language: "javascript",
            code: `function groupAnagrams(strs) {
  const map = new Map();
  for (const s of strs) {
    const key = s.split('').sort().join('');
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(s);
  }
  return [...map.values()];
}`,
          },
          {
            language: "typescript",
            code: `function groupAnagrams(strs: string[]): string[][] {
  const map = new Map<string, string[]>();
  for (const s of strs) {
    const key = s.split('').sort().join('');
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(s);
  }
  return [...map.values()];
}`,
          },
          {
            language: "php",
            code: `function groupAnagrams(array $strs): array {
    $map = [];
    foreach ($strs as $s) {
        $key = str_split($s); sort($key); $key = implode('', $key);
        $map[$key][] = $s;
    }
    return array_values($map);
}`,
          },
          {
            language: "java",
            code: `public List<List<String>> groupAnagrams(String[] strs) {
    Map<String, List<String>> map = new HashMap<>();
    for (String s : strs) {
        char[] chars = s.toCharArray(); Arrays.sort(chars);
        String key = new String(chars);
        map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
    }
    return new ArrayList<>(map.values());
}`,
          },
          {
            language: "python",
            code: `from collections import defaultdict

def groupAnagrams(strs: list[str]) -> list[list[str]]:
    groups = defaultdict(list)
    for s in strs:
        groups[tuple(sorted(s))].append(s)
    return list(groups.values())`,
          },
        ],
      },
      {
        num: 55, title: "Valid Parentheses", leetcodeNum: 20, slug: "valid-parentheses",
        pattern: "Stack", visual: "Push opens, match on close",
        difficulty: "easy",
        tags: ["String", "Stack"],
        description: "Given a string `s` containing only `'('`, `')'`, `'{'`, `'}'`, `'['`, `']'`, determine if the input string is **valid**. A valid string has every open bracket closed by the same type of bracket in the correct order.\n\nPush open brackets onto a stack. For each closing bracket, check if the top of stack is the matching open bracket.",
        examples: [
          { input: 's = "()"', output: "true" },
          { input: 's = "()[]{}"', output: "true" },
          { input: 's = "(]"', output: "false" },
        ],
        constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only '()[]{}'"],
        approach: "Stack of open brackets. On close bracket, pop and verify match. Return true if stack empty at end.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
        solutions: [
          {
            language: "javascript",
            code: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const c of s) {
    if ('({['.includes(c)) stack.push(c);
    else if (stack.pop() !== map[c]) return false;
  }
  return stack.length === 0;
}`,
          },
          {
            language: "typescript",
            code: `function isValid(s: string): boolean {
  const stack: string[] = [];
  const map: Record<string, string> = { ')': '(', '}': '{', ']': '[' };
  for (const c of s) {
    if ('({['.includes(c)) stack.push(c);
    else if (stack.pop() !== map[c]) return false;
  }
  return stack.length === 0;
}`,
          },
          {
            language: "php",
            code: `function isValid(string $s): bool {
    $stack = [];
    $map = [')' => '(', '}' => '{', ']' => '['];
    foreach (str_split($s) as $c) {
        if (in_array($c, ['(', '{', '['])) $stack[] = $c;
        elseif (array_pop($stack) !== ($map[$c] ?? null)) return false;
    }
    return empty($stack);
}`,
          },
          {
            language: "java",
            code: `public boolean isValid(String s) {
    Deque<Character> stack = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        if (c == '(' || c == '{' || c == '[') stack.push(c);
        else {
            if (stack.isEmpty()) return false;
            char top = stack.pop();
            if ((c == ')' && top != '(') || (c == '}' && top != '{') || (c == ']' && top != '[')) return false;
        }
    }
    return stack.isEmpty();
}`,
          },
          {
            language: "python",
            code: `def isValid(s: str) -> bool:
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for c in s:
        if c in '({[':
            stack.append(c)
        elif not stack or stack.pop() != mapping[c]:
            return False
    return not stack`,
          },
        ],
      },
      {
        num: 56, title: "Valid Palindrome", leetcodeNum: 125, slug: "valid-palindrome",
        pattern: "Two pointers", visual: "Skip non-alnum, compare lower",
        difficulty: "easy",
        tags: ["String", "Two Pointers"],
        description: "A phrase is a palindrome if, after converting all uppercase letters to lowercase and removing all non-alphanumeric characters, it reads the same forward and backward. Given a string `s`, return `true` if it is a palindrome.\n\nUse two pointers from both ends. Skip non-alphanumeric characters; compare lowercased characters at each step.",
        examples: [
          { input: 's = "A man, a plan, a canal: Panama"', output: "true" },
          { input: 's = "race a car"', output: "false" },
        ],
        constraints: ["1 <= s.length <= 2 * 10^5", "s consists of printable ASCII characters"],
        approach: "Two pointers (left, right). Skip non-alphanumeric. Compare lowercased; if mismatch return false.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        solutions: [
          {
            language: "javascript",
            code: `function isPalindrome(s) {
  let left = 0, right = s.length - 1;
  while (left < right) {
    while (left < right && !/[a-zA-Z0-9]/.test(s[left])) left++;
    while (left < right && !/[a-zA-Z0-9]/.test(s[right])) right--;
    if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;
    left++; right--;
  }
  return true;
}`,
          },
          {
            language: "typescript",
            code: `function isPalindrome(s: string): boolean {
  let left = 0, right = s.length - 1;
  while (left < right) {
    while (left < right && !/[a-zA-Z0-9]/.test(s[left])) left++;
    while (left < right && !/[a-zA-Z0-9]/.test(s[right])) right--;
    if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;
    left++; right--;
  }
  return true;
}`,
          },
          {
            language: "php",
            code: `function isPalindrome(string $s): bool {
    $left = 0; $right = strlen($s) - 1;
    while ($left < $right) {
        while ($left < $right && !ctype_alnum($s[$left])) $left++;
        while ($left < $right && !ctype_alnum($s[$right])) $right--;
        if (strtolower($s[$left]) !== strtolower($s[$right])) return false;
        $left++; $right--;
    }
    return true;
}`,
          },
          {
            language: "java",
            code: `public boolean isPalindrome(String s) {
    int left = 0, right = s.length() - 1;
    while (left < right) {
        while (left < right && !Character.isLetterOrDigit(s.charAt(left))) left++;
        while (left < right && !Character.isLetterOrDigit(s.charAt(right))) right--;
        if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) return false;
        left++; right--;
    }
    return true;
}`,
          },
          {
            language: "python",
            code: `def isPalindrome(s: str) -> bool:
    left, right = 0, len(s) - 1
    while left < right:
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        if s[left].lower() != s[right].lower():
            return False
        left += 1
        right -= 1
    return True`,
          },
        ],
      },
      {
        num: 57, title: "Longest Palindromic Substring", leetcodeNum: 5, slug: "longest-palindromic-substring",
        pattern: "Expand around center", visual: "2n−1 centers (odd & even)",
        difficulty: "medium",
        tags: ["String", "Dynamic Programming", "Two Pointers"],
        description: "Given a string `s`, return the **longest palindromic substring**.\n\nFor each of the `2n-1` centers (each character and between each pair of characters), expand outward as long as the characters match. Track the longest palindrome found.",
        examples: [
          { input: 's = "babad"', output: '"bab"', explanation: '"aba" is also valid.' },
          { input: 's = "cbbd"', output: '"bb"' },
        ],
        constraints: ["1 <= s.length <= 1000", "s consists of only digits and English letters"],
        approach: "For each center (odd and even length), expand while s[l]==s[r]. Track best start and length.",
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)",
        solutions: [
          {
            language: "javascript",
            code: `function longestPalindrome(s) {
  let start = 0, maxLen = 1;
  function expand(l, r) {
    while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++; }
    if (r - l - 1 > maxLen) { maxLen = r - l - 1; start = l + 1; }
  }
  for (let i = 0; i < s.length; i++) { expand(i, i); expand(i, i + 1); }
  return s.slice(start, start + maxLen);
}`,
          },
          {
            language: "typescript",
            code: `function longestPalindrome(s: string): string {
  let start = 0, maxLen = 1;
  function expand(l: number, r: number): void {
    while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++; }
    if (r - l - 1 > maxLen) { maxLen = r - l - 1; start = l + 1; }
  }
  for (let i = 0; i < s.length; i++) { expand(i, i); expand(i, i + 1); }
  return s.slice(start, start + maxLen);
}`,
          },
          {
            language: "php",
            code: `function longestPalindrome(string $s): string {
    $start = 0; $maxLen = 1; $n = strlen($s);
    for ($i = 0; $i < $n; $i++) {
        foreach ([$i, $i + 1] as $r) {
            $l = $i;
            while ($l >= 0 && $r < $n && $s[$l] === $s[$r]) { $l--; $r++; }
            if ($r - $l - 1 > $maxLen) { $maxLen = $r - $l - 1; $start = $l + 1; }
        }
    }
    return substr($s, $start, $maxLen);
}`,
          },
          {
            language: "java",
            code: `public String longestPalindrome(String s) {
    int start = 0, maxLen = 1;
    for (int i = 0; i < s.length(); i++) {
        for (int[] lr : new int[][]{{i, i}, {i, i + 1}}) {
            int l = lr[0], r = lr[1];
            while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) { l--; r++; }
            if (r - l - 1 > maxLen) { maxLen = r - l - 1; start = l + 1; }
        }
    }
    return s.substring(start, start + maxLen);
}`,
          },
          {
            language: "python",
            code: `def longestPalindrome(s: str) -> str:
    start, max_len = 0, 1
    def expand(l, r):
        nonlocal start, max_len
        while l >= 0 and r < len(s) and s[l] == s[r]:
            l -= 1; r += 1
        if r - l - 1 > max_len:
            max_len = r - l - 1
            start = l + 1
    for i in range(len(s)):
        expand(i, i)
        expand(i, i + 1)
    return s[start:start + max_len]`,
          },
        ],
      },
      {
        num: 58, title: "Palindromic Substrings", leetcodeNum: 647, slug: "palindromic-substrings",
        pattern: "Expand around center", visual: "Count expansions",
        difficulty: "medium",
        tags: ["String", "Dynamic Programming", "Two Pointers"],
        description: "Given a string `s`, return the **number of palindromic substrings** in it.\n\nFor each of the `2n-1` centers, expand outward while characters match, counting each valid palindrome found.",
        examples: [
          { input: 's = "abc"', output: "3", explanation: '"a", "b", "c".' },
          { input: 's = "aaa"', output: "6", explanation: '"a", "a", "a", "aa", "aa", "aaa".' },
        ],
        constraints: ["1 <= s.length <= 1000", "s consists of lowercase English letters"],
        approach: "For each center expand outward; increment count for every valid expansion.",
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)",
        solutions: [
          {
            language: "javascript",
            code: `function countSubstrings(s) {
  let count = 0;
  function expand(l, r) {
    while (l >= 0 && r < s.length && s[l] === s[r]) { count++; l--; r++; }
  }
  for (let i = 0; i < s.length; i++) { expand(i, i); expand(i, i + 1); }
  return count;
}`,
          },
          {
            language: "typescript",
            code: `function countSubstrings(s: string): number {
  let count = 0;
  function expand(l: number, r: number): void {
    while (l >= 0 && r < s.length && s[l] === s[r]) { count++; l--; r++; }
  }
  for (let i = 0; i < s.length; i++) { expand(i, i); expand(i, i + 1); }
  return count;
}`,
          },
          {
            language: "php",
            code: `function countSubstrings(string $s): int {
    $count = 0; $n = strlen($s);
    for ($i = 0; $i < $n; $i++) {
        foreach ([$i, $i + 1] as $r) {
            $l = $i;
            while ($l >= 0 && $r < $n && $s[$l] === $s[$r]) { $count++; $l--; $r++; }
        }
    }
    return $count;
}`,
          },
          {
            language: "java",
            code: `public int countSubstrings(String s) {
    int count = 0;
    for (int i = 0; i < s.length(); i++) {
        count += expand(s, i, i);
        count += expand(s, i, i + 1);
    }
    return count;
}
private int expand(String s, int l, int r) {
    int count = 0;
    while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) { count++; l--; r++; }
    return count;
}`,
          },
          {
            language: "python",
            code: `def countSubstrings(s: str) -> int:
    count = 0
    def expand(l, r):
        nonlocal count
        while l >= 0 and r < len(s) and s[l] == s[r]:
            count += 1
            l -= 1; r += 1
    for i in range(len(s)):
        expand(i, i)
        expand(i, i + 1)
    return count`,
          },
        ],
      },
      {
        num: 59, title: "Encode and Decode Strings", leetcodeNum: 271, slug: "encode-and-decode-strings",
        pattern: "Length-prefix framing", visual: '"len#payload"',
        difficulty: "medium",
        tags: ["String", "Design"],
        premium: true,
        description: "Design an algorithm to **encode** a list of strings to a single string and **decode** it back to the original list.\n\nUse **length-prefix framing**: encode each string as `\"len#payload\"`. During decode, read the length, skip the `#`, then read exactly that many characters as the payload.",
        examples: [
          { input: '["Hello","World"]', output: '["Hello","World"]', explanation: 'Encode → "5#Hello5#World", decode back.' },
          { input: '[""]', output: '[""]' },
        ],
        constraints: ["0 <= strs.length <= 200", "0 <= strs[i].length <= 200", "strs[i] contains any possible characters"],
        approach: 'Encode: join as "len#s" per string. Decode: read length until "#", then read length chars.',
        timeComplexity: "O(n) encode and decode",
        spaceComplexity: "O(n)",
        solutions: [
          {
            language: "javascript",
            code: `function encode(strs) {
  return strs.map(s => \`\${s.length}#\${s}\`).join('');
}
function decode(s) {
  const result = [];
  let i = 0;
  while (i < s.length) {
    const j = s.indexOf('#', i);
    const len = parseInt(s.slice(i, j));
    result.push(s.slice(j + 1, j + 1 + len));
    i = j + 1 + len;
  }
  return result;
}`,
          },
          {
            language: "typescript",
            code: `function encode(strs: string[]): string {
  return strs.map(s => \`\${s.length}#\${s}\`).join('');
}
function decode(s: string): string[] {
  const result: string[] = [];
  let i = 0;
  while (i < s.length) {
    const j = s.indexOf('#', i);
    const len = parseInt(s.slice(i, j));
    result.push(s.slice(j + 1, j + 1 + len));
    i = j + 1 + len;
  }
  return result;
}`,
          },
          {
            language: "php",
            code: `function encode(array $strs): string {
    return implode('', array_map(fn($s) => strlen($s) . '#' . $s, $strs));
}
function decode(string $s): array {
    $result = []; $i = 0; $n = strlen($s);
    while ($i < $n) {
        $j = strpos($s, '#', $i);
        $len = intval(substr($s, $i, $j - $i));
        $result[] = substr($s, $j + 1, $len);
        $i = $j + 1 + $len;
    }
    return $result;
}`,
          },
          {
            language: "java",
            code: `public String encode(List<String> strs) {
    StringBuilder sb = new StringBuilder();
    for (String s : strs) sb.append(s.length()).append('#').append(s);
    return sb.toString();
}
public List<String> decode(String s) {
    List<String> result = new ArrayList<>();
    int i = 0;
    while (i < s.length()) {
        int j = s.indexOf('#', i);
        int len = Integer.parseInt(s.substring(i, j));
        result.add(s.substring(j + 1, j + 1 + len));
        i = j + 1 + len;
    }
    return result;
}`,
          },
          {
            language: "python",
            code: `def encode(strs: list[str]) -> str:
    return ''.join(f'{len(s)}#{s}' for s in strs)

def decode(s: str) -> list[str]:
    result = []
    i = 0
    while i < len(s):
        j = s.index('#', i)
        length = int(s[i:j])
        result.append(s[j+1:j+1+length])
        i = j + 1 + length
    return result`,
          },
        ],
      },
    ],
  },
  {
    id: "tree",
    name: "Tree",
    problems: [
      {
        num: 60, title: "Maximum Depth of Binary Tree", leetcodeNum: 104, slug: "maximum-depth-of-binary-tree",
        pattern: "DFS recursion", visual: "1 + max(L, R)",
        difficulty: "easy",
        tags: ["Tree", "DFS", "BFS"],
        description: "Given the root of a binary tree, return its **maximum depth** — the number of nodes along the longest path from the root node down to the farthest leaf node.\n\nDFS recursion: the depth of a node is `1 + max(depth(left), depth(right))`. Base case: null node has depth 0.",
        examples: [
          { input: "root = [3,9,20,null,null,15,7]", output: "3" },
          { input: "root = [1,null,2]", output: "2" },
        ],
        constraints: ["Number of nodes: [0, 10^4]", "-100 <= Node.val <= 100"],
        approach: "Recursive DFS: return 0 for null, else 1 + max(left, right) depth.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(h) — h = tree height",
        solutions: [
          {
            language: "javascript",
            code: `function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
          },
          {
            language: "typescript",
            code: `function maxDepth(root: TreeNode | null): number {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
          },
          {
            language: "php",
            code: `function maxDepth(?TreeNode $root): int {
    if (!$root) return 0;
    return 1 + max(maxDepth($root->left), maxDepth($root->right));
}`,
          },
          {
            language: "java",
            code: `public int maxDepth(TreeNode root) {
    if (root == null) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
          },
          {
            language: "python",
            code: `def maxDepth(root: TreeNode | None) -> int:
    if not root:
        return 0
    return 1 + max(maxDepth(root.left), maxDepth(root.right))`,
          },
        ],
      },
      {
        num: 61, title: "Same Tree", leetcodeNum: 100, slug: "same-tree",
        pattern: "Parallel DFS", visual: "Compare nodes & recurse",
        difficulty: "easy",
        tags: ["Tree", "DFS", "BFS"],
        description: "Given the roots of two binary trees `p` and `q`, write a function to check if they are **the same tree** (structurally identical with the same values).\n\nRecursively check: both null → true; one null → false; values differ → false; else recurse both subtrees.",
        examples: [
          { input: "p = [1,2,3], q = [1,2,3]", output: "true" },
          { input: "p = [1,2], q = [1,null,2]", output: "false" },
        ],
        constraints: ["Number of nodes: [0, 100]", "-10^4 <= Node.val <= 10^4"],
        approach: "If both null → true. If one null or values differ → false. Recurse left and right.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(h)",
        solutions: [
          {
            language: "javascript",
            code: `function isSameTree(p, q) {
  if (!p && !q) return true;
  if (!p || !q || p.val !== q.val) return false;
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}`,
          },
          {
            language: "typescript",
            code: `function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
  if (!p && !q) return true;
  if (!p || !q || p.val !== q.val) return false;
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}`,
          },
          {
            language: "php",
            code: `function isSameTree(?TreeNode $p, ?TreeNode $q): bool {
    if (!$p && !$q) return true;
    if (!$p || !$q || $p->val !== $q->val) return false;
    return isSameTree($p->left, $q->left) && isSameTree($p->right, $q->right);
}`,
          },
          {
            language: "java",
            code: `public boolean isSameTree(TreeNode p, TreeNode q) {
    if (p == null && q == null) return true;
    if (p == null || q == null || p.val != q.val) return false;
    return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}`,
          },
          {
            language: "python",
            code: `def isSameTree(p: TreeNode | None, q: TreeNode | None) -> bool:
    if not p and not q: return True
    if not p or not q or p.val != q.val: return False
    return isSameTree(p.left, q.left) and isSameTree(p.right, q.right)`,
          },
        ],
      },
      {
        num: 62, title: "Invert Binary Tree", leetcodeNum: 226, slug: "invert-binary-tree",
        pattern: "DFS swap", visual: "Swap L/R, recurse",
        difficulty: "easy",
        tags: ["Tree", "DFS", "BFS"],
        description: "Given the root of a binary tree, **invert the tree** (mirror it) and return its root.\n\nFor every node, swap its left and right children, then recursively invert both subtrees.",
        examples: [
          { input: "root = [4,2,7,1,3,6,9]", output: "[4,7,2,9,6,3,1]" },
          { input: "root = [2,1,3]", output: "[2,3,1]" },
        ],
        constraints: ["Number of nodes: [0, 100]", "-100 <= Node.val <= 100"],
        approach: "Swap root.left and root.right, then recursively invert both.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(h)",
        solutions: [
          {
            language: "javascript",
            code: `function invertTree(root) {
  if (!root) return null;
  [root.left, root.right] = [invertTree(root.right), invertTree(root.left)];
  return root;
}`,
          },
          {
            language: "typescript",
            code: `function invertTree(root: TreeNode | null): TreeNode | null {
  if (!root) return null;
  [root.left, root.right] = [invertTree(root.right), invertTree(root.left)];
  return root;
}`,
          },
          {
            language: "php",
            code: `function invertTree(?TreeNode $root): ?TreeNode {
    if (!$root) return null;
    [$root->left, $root->right] = [invertTree($root->right), invertTree($root->left)];
    return $root;
}`,
          },
          {
            language: "java",
            code: `public TreeNode invertTree(TreeNode root) {
    if (root == null) return null;
    TreeNode tmp = root.left;
    root.left = invertTree(root.right);
    root.right = invertTree(tmp);
    return root;
}`,
          },
          {
            language: "python",
            code: `def invertTree(root: TreeNode | None) -> TreeNode | None:
    if not root:
        return None
    root.left, root.right = invertTree(root.right), invertTree(root.left)
    return root`,
          },
        ],
      },
      {
        num: 63, title: "Binary Tree Maximum Path Sum", leetcodeNum: 124, slug: "binary-tree-maximum-path-sum",
        pattern: "Post-order DFS", visual: "gain = node + max(L, R, 0); update global",
        difficulty: "hard",
        tags: ["Tree", "DFS", "Dynamic Programming"],
        description: "Given the root of a binary tree, return the **maximum path sum** of any non-empty path. A path is a sequence of nodes where each pair is connected, and each node appears at most once.\n\nFor each node, compute `leftGain = max(0, dfs(left))` and `rightGain = max(0, dfs(right))`. The path through this node = `node.val + leftGain + rightGain` (update global max). Return `node.val + max(leftGain, rightGain)` to the parent.",
        examples: [
          { input: "root = [1,2,3]", output: "6", explanation: "1 + 2 + 3." },
          { input: "root = [-10,9,20,null,null,15,7]", output: "42", explanation: "15 + 20 + 7." },
        ],
        constraints: ["Number of nodes: [1, 3 * 10^4]", "-1000 <= Node.val <= 1000"],
        approach: "Post-order DFS. Each node contributes its value plus the best of its two subtrees (or 0 if negative).",
        timeComplexity: "O(n)",
        spaceComplexity: "O(h)",
        solutions: [
          {
            language: "javascript",
            code: `function maxPathSum(root) {
  let max = -Infinity;
  function dfs(node) {
    if (!node) return 0;
    const left = Math.max(0, dfs(node.left));
    const right = Math.max(0, dfs(node.right));
    max = Math.max(max, node.val + left + right);
    return node.val + Math.max(left, right);
  }
  dfs(root);
  return max;
}`,
          },
          {
            language: "typescript",
            code: `function maxPathSum(root: TreeNode | null): number {
  let max = -Infinity;
  function dfs(node: TreeNode | null): number {
    if (!node) return 0;
    const left = Math.max(0, dfs(node.left));
    const right = Math.max(0, dfs(node.right));
    max = Math.max(max, node.val + left + right);
    return node.val + Math.max(left, right);
  }
  dfs(root);
  return max;
}`,
          },
          {
            language: "php",
            code: `function maxPathSum(?TreeNode $root): int {
    $max = PHP_INT_MIN;
    function dfs(?TreeNode $node, int &$max): int {
        if (!$node) return 0;
        $left = max(0, dfs($node->left, $max));
        $right = max(0, dfs($node->right, $max));
        $max = max($max, $node->val + $left + $right);
        return $node->val + max($left, $right);
    }
    dfs($root, $max);
    return $max;
}`,
          },
          {
            language: "java",
            code: `int max = Integer.MIN_VALUE;
public int maxPathSum(TreeNode root) {
    dfs(root);
    return max;
}
private int dfs(TreeNode node) {
    if (node == null) return 0;
    int left = Math.max(0, dfs(node.left));
    int right = Math.max(0, dfs(node.right));
    max = Math.max(max, node.val + left + right);
    return node.val + Math.max(left, right);
}`,
          },
          {
            language: "python",
            code: `def maxPathSum(root: TreeNode | None) -> int:
    max_sum = [float('-inf')]
    def dfs(node):
        if not node: return 0
        left = max(0, dfs(node.left))
        right = max(0, dfs(node.right))
        max_sum[0] = max(max_sum[0], node.val + left + right)
        return node.val + max(left, right)
    dfs(root)
    return max_sum[0]`,
          },
        ],
      },
      {
        num: 64, title: "Binary Tree Level Order Traversal", leetcodeNum: 102, slug: "binary-tree-level-order-traversal",
        pattern: "BFS by level", visual: "Queue size = level width",
        difficulty: "medium",
        tags: ["Tree", "BFS"],
        description: "Given the root of a binary tree, return the **level order traversal** of its nodes' values (i.e., from left to right, level by level).\n\nUse a **BFS queue**. At the start of each iteration, the queue contains exactly the nodes of the current level. Process all of them and enqueue their children for the next level.",
        examples: [
          { input: "root = [3,9,20,null,null,15,7]", output: "[[3],[9,20],[15,7]]" },
          { input: "root = [1]", output: "[[1]]" },
        ],
        constraints: ["Number of nodes: [0, 2000]", "-1000 <= Node.val <= 1000"],
        approach: "BFS queue. Each loop iteration processes one full level (current queue size). Append level array to result.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
        solutions: [
          {
            language: "javascript",
            code: `function levelOrder(root) {
  if (!root) return [];
  const result = [], queue = [root];
  while (queue.length) {
    const level = [];
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}`,
          },
          {
            language: "typescript",
            code: `function levelOrder(root: TreeNode | null): number[][] {
  if (!root) return [];
  const result: number[][] = [], queue: TreeNode[] = [root];
  while (queue.length) {
    const level: number[] = [];
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const node = queue.shift()!;
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}`,
          },
          {
            language: "php",
            code: `function levelOrder(?TreeNode $root): array {
    if (!$root) return [];
    $result = []; $queue = [$root];
    while (!empty($queue)) {
        $level = []; $size = count($queue);
        for ($i = 0; $i < $size; $i++) {
            $node = array_shift($queue);
            $level[] = $node->val;
            if ($node->left) $queue[] = $node->left;
            if ($node->right) $queue[] = $node->right;
        }
        $result[] = $level;
    }
    return $result;
}`,
          },
          {
            language: "java",
            code: `public List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    if (root == null) return result;
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);
    while (!queue.isEmpty()) {
        List<Integer> level = new ArrayList<>();
        int size = queue.size();
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.poll();
            level.add(node.val);
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
        result.add(level);
    }
    return result;
}`,
          },
          {
            language: "python",
            code: `from collections import deque

def levelOrder(root: TreeNode | None) -> list[list[int]]:
    if not root: return []
    result, queue = [], deque([root])
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        result.append(level)
    return result`,
          },
        ],
      },
      {
        num: 65, title: "Serialize and Deserialize Binary Tree", leetcodeNum: 297, slug: "serialize-and-deserialize-binary-tree",
        pattern: "Pre-order + null markers", visual: "Queue of tokens",
        difficulty: "hard",
        tags: ["Tree", "DFS", "BFS", "Design"],
        description: "Design an algorithm to **serialize** a binary tree to a string and **deserialize** that string back to the original tree structure.\n\nUse **pre-order DFS**: encode each node's value, use `'N'` for null. Split the serialized string on commas and use a queue of tokens to reconstruct the tree during deserialization.",
        examples: [
          { input: "root = [1,2,3,null,null,4,5]", output: "[1,2,3,null,null,4,5]", explanation: "Serialize then deserialize returns the same tree." },
        ],
        constraints: ["Number of nodes: [0, 10^4]", "-1000 <= Node.val <= 1000"],
        approach: "Serialize: pre-order DFS with 'N' for null. Deserialize: consume tokens from a queue recursively.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
        solutions: [
          {
            language: "javascript",
            code: `function serialize(root) {
  const vals = [];
  function dfs(node) { if (!node) { vals.push('N'); return; } vals.push(node.val); dfs(node.left); dfs(node.right); }
  dfs(root);
  return vals.join(',');
}
function deserialize(data) {
  const vals = data.split(',');
  let i = 0;
  function dfs() {
    if (vals[i] === 'N') { i++; return null; }
    const node = { val: parseInt(vals[i++]), left: null, right: null };
    node.left = dfs(); node.right = dfs();
    return node;
  }
  return dfs();
}`,
          },
          {
            language: "typescript",
            code: `function serialize(root: TreeNode | null): string {
  const vals: string[] = [];
  function dfs(node: TreeNode | null) { if (!node) { vals.push('N'); return; } vals.push(String(node.val)); dfs(node.left); dfs(node.right); }
  dfs(root);
  return vals.join(',');
}
function deserialize(data: string): TreeNode | null {
  const vals = data.split(','); let i = 0;
  function dfs(): TreeNode | null {
    if (vals[i] === 'N') { i++; return null; }
    const node = new TreeNode(parseInt(vals[i++]));
    node.left = dfs(); node.right = dfs();
    return node;
  }
  return dfs();
}`,
          },
          {
            language: "php",
            code: `function serialize(?TreeNode $root): string {
    $vals = [];
    function dfs(?TreeNode $node, array &$vals): void {
        if (!$node) { $vals[] = 'N'; return; }
        $vals[] = $node->val; dfs($node->left, $vals); dfs($node->right, $vals);
    }
    dfs($root, $vals);
    return implode(',', $vals);
}
function deserialize(string $data): ?TreeNode {
    $vals = explode(',', $data); $i = 0;
    function build(array &$vals, int &$i): ?TreeNode {
        if ($vals[$i] === 'N') { $i++; return null; }
        $node = new TreeNode(intval($vals[$i++]));
        $node->left = build($vals, $i); $node->right = build($vals, $i);
        return $node;
    }
    return build($vals, $i);
}`,
          },
          {
            language: "java",
            code: `public String serialize(TreeNode root) {
    StringBuilder sb = new StringBuilder();
    serDfs(root, sb);
    return sb.toString();
}
private void serDfs(TreeNode node, StringBuilder sb) {
    if (node == null) { sb.append("N,"); return; }
    sb.append(node.val).append(',');
    serDfs(node.left, sb); serDfs(node.right, sb);
}
public TreeNode deserialize(String data) {
    Queue<String> q = new LinkedList<>(Arrays.asList(data.split(",")));
    return desDfs(q);
}
private TreeNode desDfs(Queue<String> q) {
    String val = q.poll();
    if ("N".equals(val)) return null;
    TreeNode node = new TreeNode(Integer.parseInt(val));
    node.left = desDfs(q); node.right = desDfs(q);
    return node;
}`,
          },
          {
            language: "python",
            code: `from collections import deque

def serialize(root) -> str:
    vals = []
    def dfs(node):
        if not node: vals.append('N'); return
        vals.append(str(node.val))
        dfs(node.left); dfs(node.right)
    dfs(root)
    return ','.join(vals)

def deserialize(data: str):
    vals = deque(data.split(','))
    def dfs():
        v = vals.popleft()
        if v == 'N': return None
        node = TreeNode(int(v))
        node.left = dfs(); node.right = dfs()
        return node
    return dfs()`,
          },
        ],
      },
      {
        num: 66, title: "Subtree of Another Tree", leetcodeNum: 572, slug: "subtree-of-another-tree",
        pattern: "DFS + sameTree", visual: "At each node, try match",
        difficulty: "easy",
        tags: ["Tree", "DFS", "String Matching"],
        description: "Given the roots of two binary trees `root` and `subRoot`, return `true` if there is a subtree of `root` with the same structure and node values as `subRoot`.\n\nAt each node of `root`, check if the subtree rooted there is identical to `subRoot` (using the Same Tree logic). Recurse left and right if not.",
        examples: [
          { input: "root = [3,4,5,1,2], subRoot = [4,1,2]", output: "true" },
          { input: "root = [3,4,5,1,2,null,null,null,null,0], subRoot = [4,1,2]", output: "false" },
        ],
        constraints: ["Number of nodes in root: [1, 2000]", "Number of nodes in subRoot: [1, 1000]"],
        approach: "isSameTree check at every node in root. Recurse left/right if current match fails.",
        timeComplexity: "O(m × n) — m = root nodes, n = subRoot nodes",
        spaceComplexity: "O(h)",
        solutions: [
          {
            language: "javascript",
            code: `function isSubtree(root, subRoot) {
  if (!root) return false;
  if (isSame(root, subRoot)) return true;
  return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
}
function isSame(p, q) {
  if (!p && !q) return true;
  if (!p || !q || p.val !== q.val) return false;
  return isSame(p.left, q.left) && isSame(p.right, q.right);
}`,
          },
          {
            language: "typescript",
            code: `function isSubtree(root: TreeNode | null, subRoot: TreeNode | null): boolean {
  if (!root) return false;
  if (isSame(root, subRoot)) return true;
  return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
}
function isSame(p: TreeNode | null, q: TreeNode | null): boolean {
  if (!p && !q) return true;
  if (!p || !q || p.val !== q.val) return false;
  return isSame(p.left, q.left) && isSame(p.right, q.right);
}`,
          },
          {
            language: "php",
            code: `function isSubtree(?TreeNode $root, ?TreeNode $subRoot): bool {
    if (!$root) return false;
    if (isSame($root, $subRoot)) return true;
    return isSubtree($root->left, $subRoot) || isSubtree($root->right, $subRoot);
}
function isSame(?TreeNode $p, ?TreeNode $q): bool {
    if (!$p && !$q) return true;
    if (!$p || !$q || $p->val !== $q->val) return false;
    return isSame($p->left, $q->left) && isSame($p->right, $q->right);
}`,
          },
          {
            language: "java",
            code: `public boolean isSubtree(TreeNode root, TreeNode subRoot) {
    if (root == null) return false;
    if (isSame(root, subRoot)) return true;
    return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
}
private boolean isSame(TreeNode p, TreeNode q) {
    if (p == null && q == null) return true;
    if (p == null || q == null || p.val != q.val) return false;
    return isSame(p.left, q.left) && isSame(p.right, q.right);
}`,
          },
          {
            language: "python",
            code: `def isSubtree(root: TreeNode | None, subRoot: TreeNode | None) -> bool:
    def is_same(p, q):
        if not p and not q: return True
        if not p or not q or p.val != q.val: return False
        return is_same(p.left, q.left) and is_same(p.right, q.right)
    if not root: return False
    if is_same(root, subRoot): return True
    return isSubtree(root.left, subRoot) or isSubtree(root.right, subRoot)`,
          },
        ],
      },
      {
        num: 67, title: "Construct Binary Tree from Preorder and Inorder", leetcodeNum: 105, slug: "construct-binary-tree-from-preorder-and-inorder-traversal",
        pattern: "Recursion + index map", visual: "First preorder = root; split inorder",
        difficulty: "medium",
        tags: ["Tree", "DFS", "Hash Table"],
        description: "Given two integer arrays `preorder` and `inorder` where `preorder[0]` is always the root, construct and return the binary tree.\n\nThe first element of `preorder` is the root. Find it in `inorder` — elements to its left are the left subtree, elements to its right are the right subtree. Recurse with the appropriate slices. Use a hash map for O(1) index lookups.",
        examples: [
          { input: "preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]", output: "[3,9,20,null,null,15,7]" },
          { input: "preorder = [-1], inorder = [-1]", output: "[-1]" },
        ],
        constraints: ["1 <= preorder.length <= 3000", "All values are unique"],
        approach: "Use preorder index + inorder map. Root = preorder[i]. Left size = inorderIdx - inStart. Recurse.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
        solutions: [
          {
            language: "javascript",
            code: `function buildTree(preorder, inorder) {
  const inMap = new Map(inorder.map((v, i) => [v, i]));
  let preIdx = 0;
  function build(inLeft, inRight) {
    if (inLeft > inRight) return null;
    const rootVal = preorder[preIdx++];
    const node = { val: rootVal, left: null, right: null };
    const inIdx = inMap.get(rootVal);
    node.left = build(inLeft, inIdx - 1);
    node.right = build(inIdx + 1, inRight);
    return node;
  }
  return build(0, inorder.length - 1);
}`,
          },
          {
            language: "typescript",
            code: `function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
  const inMap = new Map(inorder.map((v, i) => [v, i]));
  let preIdx = 0;
  function build(inLeft: number, inRight: number): TreeNode | null {
    if (inLeft > inRight) return null;
    const rootVal = preorder[preIdx++];
    const node = new TreeNode(rootVal);
    const inIdx = inMap.get(rootVal)!;
    node.left = build(inLeft, inIdx - 1);
    node.right = build(inIdx + 1, inRight);
    return node;
  }
  return build(0, inorder.length - 1);
}`,
          },
          {
            language: "php",
            code: `function buildTree(array $preorder, array $inorder): ?TreeNode {
    $inMap = array_flip($inorder); $preIdx = 0;
    function build(array $preorder, array $inMap, int &$preIdx, int $inLeft, int $inRight): ?TreeNode {
        if ($inLeft > $inRight) return null;
        $rootVal = $preorder[$preIdx++];
        $node = new TreeNode($rootVal);
        $inIdx = $inMap[$rootVal];
        $node->left = build($preorder, $inMap, $preIdx, $inLeft, $inIdx - 1);
        $node->right = build($preorder, $inMap, $preIdx, $inIdx + 1, $inRight);
        return $node;
    }
    return build($preorder, $inMap, $preIdx, 0, count($inorder) - 1);
}`,
          },
          {
            language: "java",
            code: `Map<Integer, Integer> inMap = new HashMap<>();
int preIdx = 0;
public TreeNode buildTree(int[] preorder, int[] inorder) {
    for (int i = 0; i < inorder.length; i++) inMap.put(inorder[i], i);
    return build(preorder, 0, inorder.length - 1);
}
private TreeNode build(int[] pre, int inL, int inR) {
    if (inL > inR) return null;
    TreeNode node = new TreeNode(pre[preIdx++]);
    int inIdx = inMap.get(node.val);
    node.left = build(pre, inL, inIdx - 1);
    node.right = build(pre, inIdx + 1, inR);
    return node;
}`,
          },
          {
            language: "python",
            code: `def buildTree(preorder: list[int], inorder: list[int]) -> TreeNode | None:
    in_map = {v: i for i, v in enumerate(inorder)}
    pre_idx = [0]
    def build(in_left, in_right):
        if in_left > in_right: return None
        root_val = preorder[pre_idx[0]]
        pre_idx[0] += 1
        node = TreeNode(root_val)
        idx = in_map[root_val]
        node.left = build(in_left, idx - 1)
        node.right = build(idx + 1, in_right)
        return node
    return build(0, len(inorder) - 1)`,
          },
        ],
      },
      {
        num: 68, title: "Validate Binary Search Tree", leetcodeNum: 98, slug: "validate-binary-search-tree",
        pattern: "DFS with bounds", visual: "Pass (low, high) down",
        difficulty: "medium",
        tags: ["Tree", "DFS", "BST"],
        description: "Given the root of a binary tree, determine if it is a **valid BST** (every node's value is strictly greater than all values in its left subtree and strictly less than all values in its right subtree).\n\nPass `low` and `high` bounds down: for the left child, the high bound is the current node's value; for the right child, the low bound is the current node's value.",
        examples: [
          { input: "root = [2,1,3]", output: "true" },
          { input: "root = [5,1,4,null,null,3,6]", output: "false", explanation: "4 is in right subtree of 5 but 4 < 5." },
        ],
        constraints: ["Number of nodes: [1, 10^4]", "-2^31 <= Node.val <= 2^31 - 1"],
        approach: "DFS with (low, high) bounds. Node valid if low < node.val < high. Recurse with tightened bounds.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(h)",
        solutions: [
          {
            language: "javascript",
            code: `function isValidBST(root, low = -Infinity, high = Infinity) {
  if (!root) return true;
  if (root.val <= low || root.val >= high) return false;
  return isValidBST(root.left, low, root.val) && isValidBST(root.right, root.val, high);
}`,
          },
          {
            language: "typescript",
            code: `function isValidBST(root: TreeNode | null, low = -Infinity, high = Infinity): boolean {
  if (!root) return true;
  if (root.val <= low || root.val >= high) return false;
  return isValidBST(root.left, low, root.val) && isValidBST(root.right, root.val, high);
}`,
          },
          {
            language: "php",
            code: `function isValidBST(?TreeNode $root, int $low = PHP_INT_MIN, int $high = PHP_INT_MAX): bool {
    if (!$root) return true;
    if ($root->val <= $low || $root->val >= $high) return false;
    return isValidBST($root->left, $low, $root->val) && isValidBST($root->right, $root->val, $high);
}`,
          },
          {
            language: "java",
            code: `public boolean isValidBST(TreeNode root) {
    return validate(root, Long.MIN_VALUE, Long.MAX_VALUE);
}
private boolean validate(TreeNode node, long low, long high) {
    if (node == null) return true;
    if (node.val <= low || node.val >= high) return false;
    return validate(node.left, low, node.val) && validate(node.right, node.val, high);
}`,
          },
          {
            language: "python",
            code: `def isValidBST(root: TreeNode | None, low=float('-inf'), high=float('inf')) -> bool:
    if not root: return True
    if root.val <= low or root.val >= high: return False
    return isValidBST(root.left, low, root.val) and isValidBST(root.right, root.val, high)`,
          },
        ],
      },
      {
        num: 69, title: "Kth Smallest Element in a BST", leetcodeNum: 230, slug: "kth-smallest-element-in-a-bst",
        pattern: "Inorder traversal", visual: "Stop at k-th visit",
        difficulty: "medium",
        tags: ["Tree", "DFS", "BST"],
        description: "Given the root of a BST and an integer `k`, return the **k-th smallest element** (1-indexed) among all node values.\n\nInorder traversal of a BST visits nodes in **ascending order**. Stop at the k-th node visited.",
        examples: [
          { input: "root = [3,1,4,null,2], k = 1", output: "1" },
          { input: "root = [5,3,6,2,4,null,null,1], k = 3", output: "3" },
        ],
        constraints: ["Number of nodes: [1, 10^4]", "1 <= k <= n"],
        approach: "Iterative inorder with a stack. Decrement k each time we visit a node. When k=0, return current value.",
        timeComplexity: "O(h + k) — h = tree height",
        spaceComplexity: "O(h)",
        solutions: [
          {
            language: "javascript",
            code: `function kthSmallest(root, k) {
  const stack = [];
  let curr = root;
  while (curr || stack.length) {
    while (curr) { stack.push(curr); curr = curr.left; }
    curr = stack.pop();
    if (--k === 0) return curr.val;
    curr = curr.right;
  }
}`,
          },
          {
            language: "typescript",
            code: `function kthSmallest(root: TreeNode | null, k: number): number {
  const stack: TreeNode[] = [];
  let curr: TreeNode | null = root;
  while (curr || stack.length) {
    while (curr) { stack.push(curr); curr = curr.left; }
    curr = stack.pop()!;
    if (--k === 0) return curr.val;
    curr = curr.right;
  }
  return -1;
}`,
          },
          {
            language: "php",
            code: `function kthSmallest(?TreeNode $root, int $k): int {
    $stack = []; $curr = $root;
    while ($curr || !empty($stack)) {
        while ($curr) { $stack[] = $curr; $curr = $curr->left; }
        $curr = array_pop($stack);
        if (--$k === 0) return $curr->val;
        $curr = $curr->right;
    }
    return -1;
}`,
          },
          {
            language: "java",
            code: `public int kthSmallest(TreeNode root, int k) {
    Deque<TreeNode> stack = new ArrayDeque<>();
    TreeNode curr = root;
    while (curr != null || !stack.isEmpty()) {
        while (curr != null) { stack.push(curr); curr = curr.left; }
        curr = stack.pop();
        if (--k == 0) return curr.val;
        curr = curr.right;
    }
    return -1;
}`,
          },
          {
            language: "python",
            code: `def kthSmallest(root: TreeNode | None, k: int) -> int:
    stack, curr = [], root
    while curr or stack:
        while curr:
            stack.append(curr)
            curr = curr.left
        curr = stack.pop()
        k -= 1
        if k == 0:
            return curr.val
        curr = curr.right`,
          },
        ],
      },
      {
        num: 70, title: "Lowest Common Ancestor of a BST", leetcodeNum: 235, slug: "lowest-common-ancestor-of-a-binary-search-tree",
        pattern: "Walk by value", visual: "Split point = LCA",
        difficulty: "medium",
        tags: ["Tree", "DFS", "BST"],
        description: "Given a BST and two nodes `p` and `q`, find their **Lowest Common Ancestor (LCA)**.\n\nIn a BST, the LCA is the node where the two paths to `p` and `q` diverge: if both values are less than the current node → go left; if both greater → go right; otherwise the current node is the LCA.",
        examples: [
          { input: "root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8", output: "6" },
          { input: "root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4", output: "2" },
        ],
        constraints: ["Number of nodes: [2, 10^5]", "All values are unique", "p != q, both exist in the BST"],
        approach: "If both p and q are smaller than root, go left. If both larger, go right. Otherwise root is LCA.",
        timeComplexity: "O(h)",
        spaceComplexity: "O(1) iterative",
        solutions: [
          {
            language: "javascript",
            code: `function lowestCommonAncestor(root, p, q) {
  while (root) {
    if (p.val < root.val && q.val < root.val) root = root.left;
    else if (p.val > root.val && q.val > root.val) root = root.right;
    else return root;
  }
}`,
          },
          {
            language: "typescript",
            code: `function lowestCommonAncestor(root: TreeNode | null, p: TreeNode, q: TreeNode): TreeNode | null {
  while (root) {
    if (p.val < root.val && q.val < root.val) root = root.left;
    else if (p.val > root.val && q.val > root.val) root = root.right;
    else return root;
  }
  return null;
}`,
          },
          {
            language: "php",
            code: `function lowestCommonAncestor(?TreeNode $root, TreeNode $p, TreeNode $q): ?TreeNode {
    while ($root) {
        if ($p->val < $root->val && $q->val < $root->val) $root = $root->left;
        elseif ($p->val > $root->val && $q->val > $root->val) $root = $root->right;
        else return $root;
    }
    return null;
}`,
          },
          {
            language: "java",
            code: `public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    while (root != null) {
        if (p.val < root.val && q.val < root.val) root = root.left;
        else if (p.val > root.val && q.val > root.val) root = root.right;
        else return root;
    }
    return null;
}`,
          },
          {
            language: "python",
            code: `def lowestCommonAncestor(root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:
    while root:
        if p.val < root.val and q.val < root.val:
            root = root.left
        elif p.val > root.val and q.val > root.val:
            root = root.right
        else:
            return root`,
          },
        ],
      },
      {
        num: 71, title: "Implement Trie (Prefix Tree)", leetcodeNum: 208, slug: "implement-trie-prefix-tree",
        pattern: "Trie nodes", visual: "26 children + isEnd",
        difficulty: "medium",
        tags: ["Trie", "Design", "Hash Table"],
        description: "Implement a **Trie** with `insert`, `search`, and `startsWith` operations.\n\nEach trie node holds an array of 26 child pointers (one per letter) and an `isEnd` flag. Insert characters one by one, creating nodes as needed. Search traverses and checks `isEnd`. `startsWith` traverses without checking `isEnd`.",
        examples: [
          { input: 'trie.insert("apple"); trie.search("apple"); trie.search("app"); trie.startsWith("app"); trie.insert("app"); trie.search("app")', output: "true, false, true, true" },
        ],
        constraints: ["1 <= word.length, prefix.length <= 2000", "word and prefix consist of lowercase English letters"],
        approach: "26-child array per node + isEnd boolean. Insert/search/startsWith all traverse character by character.",
        timeComplexity: "O(L) per operation — L = word length",
        spaceComplexity: "O(N × 26) — N = total characters inserted",
        solutions: [
          {
            language: "javascript",
            code: `class TrieNode { constructor() { this.children = {}; this.isEnd = false; } }
class Trie {
  constructor() { this.root = new TrieNode(); }
  insert(word) { let node = this.root; for (const c of word) { if (!node.children[c]) node.children[c] = new TrieNode(); node = node.children[c]; } node.isEnd = true; }
  search(word) { let node = this.root; for (const c of word) { if (!node.children[c]) return false; node = node.children[c]; } return node.isEnd; }
  startsWith(prefix) { let node = this.root; for (const c of prefix) { if (!node.children[c]) return false; node = node.children[c]; } return true; }
}`,
          },
          {
            language: "typescript",
            code: `class TrieNode { children: Map<string, TrieNode> = new Map(); isEnd = false; }
class Trie {
  private root = new TrieNode();
  insert(word: string): void { let node = this.root; for (const c of word) { if (!node.children.has(c)) node.children.set(c, new TrieNode()); node = node.children.get(c)!; } node.isEnd = true; }
  search(word: string): boolean { let node = this.root; for (const c of word) { if (!node.children.has(c)) return false; node = node.children.get(c)!; } return node.isEnd; }
  startsWith(prefix: string): boolean { let node = this.root; for (const c of prefix) { if (!node.children.has(c)) return false; node = node.children.get(c)!; } return true; }
}`,
          },
          {
            language: "php",
            code: `class TrieNode { public array $children = []; public bool $isEnd = false; }
class Trie {
    private TrieNode $root;
    public function __construct() { $this->root = new TrieNode(); }
    public function insert(string $word): void { $node = $this->root; foreach (str_split($word) as $c) { if (!isset($node->children[$c])) $node->children[$c] = new TrieNode(); $node = $node->children[$c]; } $node->isEnd = true; }
    public function search(string $word): bool { $node = $this->root; foreach (str_split($word) as $c) { if (!isset($node->children[$c])) return false; $node = $node->children[$c]; } return $node->isEnd; }
    public function startsWith(string $prefix): bool { $node = $this->root; foreach (str_split($prefix) as $c) { if (!isset($node->children[$c])) return false; $node = $node->children[$c]; } return true; }
}`,
          },
          {
            language: "java",
            code: `class Trie {
    private static class Node { Map<Character, Node> children = new HashMap<>(); boolean isEnd; }
    private final Node root = new Node();
    public void insert(String word) { Node n = root; for (char c : word.toCharArray()) { n.children.putIfAbsent(c, new Node()); n = n.children.get(c); } n.isEnd = true; }
    public boolean search(String word) { Node n = root; for (char c : word.toCharArray()) { if (!n.children.containsKey(c)) return false; n = n.children.get(c); } return n.isEnd; }
    public boolean startsWith(String prefix) { Node n = root; for (char c : prefix.toCharArray()) { if (!n.children.containsKey(c)) return false; n = n.children.get(c); } return true; }
}`,
          },
          {
            language: "python",
            code: `class TrieNode:
    def __init__(self): self.children = {}; self.is_end = False

class Trie:
    def __init__(self): self.root = TrieNode()
    def insert(self, word: str) -> None:
        node = self.root
        for c in word:
            if c not in node.children: node.children[c] = TrieNode()
            node = node.children[c]
        node.is_end = True
    def search(self, word: str) -> bool:
        node = self.root
        for c in word:
            if c not in node.children: return False
            node = node.children[c]
        return node.is_end
    def startsWith(self, prefix: str) -> bool:
        node = self.root
        for c in prefix:
            if c not in node.children: return False
            node = node.children[c]
        return True`,
          },
        ],
      },
      {
        num: 72, title: "Design Add and Search Words Data Structure", leetcodeNum: 211, slug: "design-add-and-search-words-data-structure",
        pattern: "Trie + DFS for '.'", visual: "Wildcard branches all children",
        difficulty: "medium",
        tags: ["Trie", "Design", "DFS", "String"],
        description: "Design a data structure that supports `addWord(word)` and `search(word)`, where `search` can use the wildcard `.` which matches any single character.\n\nBuild on a Trie. For `addWord`, insert normally. For `search`, when a `'.'` is encountered, recursively try **all children** at that position.",
        examples: [
          { input: 'addWord("bad"), addWord("dad"), addWord("mad"), search("pad"), search("bad"), search(".ad"), search("b..")', output: "false, true, true, true" },
        ],
        constraints: ["1 <= word.length <= 25", "word consists of lowercase English letters or '.'"],
        approach: "Trie with DFS. On '.', recurse into all non-null children. On letter, follow that child if it exists.",
        timeComplexity: "O(L) addWord, O(26^L) worst case search with wildcards",
        spaceComplexity: "O(N × 26)",
        solutions: [
          {
            language: "javascript",
            code: `class WordDictionary {
  constructor() { this.root = {}; }
  addWord(word) { let node = this.root; for (const c of word) { if (!node[c]) node[c] = {}; node = node[c]; } node['#'] = true; }
  search(word) {
    function dfs(node, i) {
      if (i === word.length) return !!node['#'];
      const c = word[i];
      if (c === '.') return Object.keys(node).filter(k => k !== '#').some(k => dfs(node[k], i + 1));
      if (!node[c]) return false;
      return dfs(node[c], i + 1);
    }
    return dfs(this.root, 0);
  }
}`,
          },
          {
            language: "typescript",
            code: `class WordDictionary {
  private root: Record<string, any> = {};
  addWord(word: string): void { let n = this.root; for (const c of word) { if (!n[c]) n[c] = {}; n = n[c]; } n['#'] = true; }
  search(word: string): boolean {
    const dfs = (node: Record<string, any>, i: number): boolean => {
      if (i === word.length) return !!node['#'];
      const c = word[i];
      if (c === '.') return Object.keys(node).filter(k => k !== '#').some(k => dfs(node[k], i + 1));
      return !!node[c] && dfs(node[c], i + 1);
    };
    return dfs(this.root, 0);
  }
}`,
          },
          {
            language: "php",
            code: `class WordDictionary {
    private array $root = [];
    public function addWord(string $word): void { $node = &$this->root; foreach (str_split($word) as $c) { $node[$c] ??= []; $node = &$node[$c]; } $node['#'] = true; }
    public function search(string $word): bool {
        return $this->dfs($this->root, $word, 0);
    }
    private function dfs(array $node, string $word, int $i): bool {
        if ($i === strlen($word)) return isset($node['#']);
        $c = $word[$i];
        if ($c === '.') { foreach ($node as $k => $child) { if ($k !== '#' && $this->dfs($child, $word, $i + 1)) return true; } return false; }
        return isset($node[$c]) && $this->dfs($node[$c], $word, $i + 1);
    }
}`,
          },
          {
            language: "java",
            code: `class WordDictionary {
    private static class Node { Map<Character, Node> ch = new HashMap<>(); boolean end; }
    private final Node root = new Node();
    public void addWord(String word) { Node n = root; for (char c : word.toCharArray()) { n.ch.putIfAbsent(c, new Node()); n = n.ch.get(c); } n.end = true; }
    public boolean search(String word) { return dfs(root, word, 0); }
    private boolean dfs(Node node, String word, int i) {
        if (i == word.length()) return node.end;
        char c = word.charAt(i);
        if (c == '.') { for (Node child : node.ch.values()) if (dfs(child, word, i + 1)) return true; return false; }
        return node.ch.containsKey(c) && dfs(node.ch.get(c), word, i + 1);
    }
}`,
          },
          {
            language: "python",
            code: `class WordDictionary:
    def __init__(self): self.root = {}
    def addWord(self, word: str) -> None:
        node = self.root
        for c in word: node = node.setdefault(c, {})
        node['#'] = True
    def search(self, word: str) -> bool:
        def dfs(node, i):
            if i == len(word): return '#' in node
            c = word[i]
            if c == '.': return any(dfs(child, i+1) for k, child in node.items() if k != '#')
            return c in node and dfs(node[c], i+1)
        return dfs(self.root, 0)`,
          },
        ],
      },
      {
        num: 73, title: "Word Search II", leetcodeNum: 212, slug: "word-search-ii",
        pattern: "Trie + grid DFS", visual: "Prune trie branches as found",
        difficulty: "hard",
        tags: ["Array", "Matrix", "Trie", "DFS", "Backtracking"],
        description: "Given an `m x n` board and a list of words, return all words on the board. Words are formed by sequentially adjacent cells (horizontally or vertically); the same cell may not be used more than once in a word.\n\nBuild a **Trie** from all words. Then DFS from each cell on the board, traversing the Trie simultaneously. When a word ending is found, add it to results. Prune Trie branches that are fully found (optimization).",
        examples: [
          { input: 'board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]', output: '["eat","oath"]' },
        ],
        constraints: ["m == board.length", "n == board[i].length", "1 <= m, n <= 12", "1 <= words.length <= 3 * 10^4"],
        approach: "Insert all words into Trie. DFS each cell, traverse Trie simultaneously. Collect results at word-end nodes.",
        timeComplexity: "O(M × N × 4^L) — L = max word length",
        spaceComplexity: "O(W × L) — W = number of words",
        solutions: [
          {
            language: "javascript",
            code: `function findWords(board, words) {
  const trie = {};
  for (const w of words) { let node = trie; for (const c of w) { node[c] ??= {}; node = node[c]; } node['$'] = w; }
  const m = board.length, n = board[0].length, result = new Set();
  function dfs(node, r, c) {
    if (r < 0 || r >= m || c < 0 || c >= n || !node[board[r][c]]) return;
    const ch = board[r][c]; node = node[ch];
    if (node['$']) result.add(node['$']);
    board[r][c] = '#';
    dfs(node, r+1, c); dfs(node, r-1, c); dfs(node, r, c+1); dfs(node, r, c-1);
    board[r][c] = ch;
  }
  for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) dfs(trie, r, c);
  return [...result];
}`,
          },
          {
            language: "typescript",
            code: `function findWords(board: string[][], words: string[]): string[] {
  const trie: Record<string, any> = {};
  for (const w of words) { let n = trie; for (const c of w) { n[c] ??= {}; n = n[c]; } n['$'] = w; }
  const m = board.length, n = board[0].length, result = new Set<string>();
  function dfs(node: Record<string, any>, r: number, c: number): void {
    if (r < 0||r >= m||c < 0||c >= n||!node[board[r][c]]) return;
    const ch = board[r][c]; node = node[ch];
    if (node['$']) result.add(node['$']);
    board[r][c] = '#';
    dfs(node,r+1,c); dfs(node,r-1,c); dfs(node,r,c+1); dfs(node,r,c-1);
    board[r][c] = ch;
  }
  for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) dfs(trie, r, c);
  return [...result];
}`,
          },
          {
            language: "php",
            code: `function findWords(array $board, array $words): array {
    $trie = [];
    foreach ($words as $w) { $node = &$trie; foreach (str_split($w) as $c) { $node[$c] ??= []; $node = &$node[$c]; } $node['$'] = $w; unset($node); }
    $m = count($board); $n = count($board[0]); $result = [];
    function dfs(array &$node, array &$board, int $r, int $c, int $m, int $n, array &$result): void {
        if ($r < 0||$r >= $m||$c < 0||$c >= $n||!isset($node[$board[$r][$c]])) return;
        $ch = $board[$r][$c]; $next = &$node[$ch];
        if (isset($next['$'])) { $result[] = $next['$']; unset($next['$']); }
        $board[$r][$c] = '#';
        dfs($next,$board,$r+1,$c,$m,$n,$result); dfs($next,$board,$r-1,$c,$m,$n,$result);
        dfs($next,$board,$r,$c+1,$m,$n,$result); dfs($next,$board,$r,$c-1,$m,$n,$result);
        $board[$r][$c] = $ch;
    }
    for ($r = 0; $r < $m; $r++) for ($c = 0; $c < $n; $c++) dfs($trie, $board, $r, $c, $m, $n, $result);
    return array_unique($result);
}`,
          },
          {
            language: "java",
            code: `public List<String> findWords(char[][] board, String[] words) {
    Map<Character, Object> trie = new HashMap<>();
    for (String w : words) {
        Map<Character, Object> node = trie;
        for (char c : w.toCharArray()) { node.computeIfAbsent(c, k -> new HashMap<Character, Object>()); node = (Map<Character, Object>) node.get(c); }
        node.put('$', w);
    }
    Set<String> result = new HashSet<>();
    int m = board.length, n = board[0].length;
    for (int r = 0; r < m; r++) for (int c = 0; c < n; c++) dfs(board, trie, r, c, m, n, result);
    return new ArrayList<>(result);
}
private void dfs(char[][] board, Map<Character, Object> node, int r, int c, int m, int n, Set<String> result) {
    if (r < 0||r >= m||c < 0||c >= n||!node.containsKey(board[r][c])) return;
    char ch = board[r][c];
    Map<Character, Object> next = (Map<Character, Object>) node.get(ch);
    if (next.containsKey('$')) result.add((String) next.get('$'));
    board[r][c] = '#';
    dfs(board,next,r+1,c,m,n,result); dfs(board,next,r-1,c,m,n,result);
    dfs(board,next,r,c+1,m,n,result); dfs(board,next,r,c-1,m,n,result);
    board[r][c] = ch;
}`,
          },
          {
            language: "python",
            code: `def findWords(board: list[list[str]], words: list[str]) -> list[str]:
    trie = {}
    for w in words:
        node = trie
        for c in w: node = node.setdefault(c, {})
        node['$'] = w
    m, n = len(board), len(board[0])
    result = set()
    def dfs(node, r, c):
        if r < 0 or r >= m or c < 0 or c >= n or board[r][c] not in node: return
        ch = board[r][c]
        node = node[ch]
        if '$' in node: result.add(node['$'])
        board[r][c] = '#'
        dfs(node,r+1,c); dfs(node,r-1,c); dfs(node,r,c+1); dfs(node,r,c-1)
        board[r][c] = ch
    for r in range(m):
        for c in range(n):
            dfs(trie, r, c)
    return list(result)`,
          },
        ],
      },
    ],
  },
  {
    id: "heap",
    name: "Heap",
    problems: [
      {
        num: 74, title: "Top K Frequent Elements", leetcodeNum: 347, slug: "top-k-frequent-elements",
        pattern: "Bucket sort / heap", visual: "Buckets indexed by frequency",
        difficulty: "medium",
        tags: ["Array", "Hash Table", "Sorting", "Heap"],
        description: "Given an integer array `nums` and an integer `k`, return the **k most frequent elements** in any order.\n\n**Bucket sort approach (O(n)):** Count frequencies with a hash map, then create buckets where `bucket[freq]` holds all numbers with that frequency. Iterate buckets from high to low frequency, collecting elements until k are gathered.",
        examples: [
          { input: "nums = [1,1,1,2,2,3], k = 2", output: "[1,2]" },
          { input: "nums = [1], k = 1", output: "[1]" },
        ],
        constraints: ["1 <= nums.length <= 10^5", "k is in the range [1, number of unique elements]"],
        approach: "Frequency map + bucket sort by frequency. Collect from highest-frequency bucket down to k elements.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
        solutions: [
          {
            language: "javascript",
            code: `function topKFrequent(nums, k) {
  const freq = new Map();
  for (const n of nums) freq.set(n, (freq.get(n) || 0) + 1);
  const buckets = Array.from({ length: nums.length + 1 }, () => []);
  for (const [num, count] of freq) buckets[count].push(num);
  const result = [];
  for (let i = buckets.length - 1; i >= 0 && result.length < k; i--)
    result.push(...buckets[i]);
  return result.slice(0, k);
}`,
          },
          {
            language: "typescript",
            code: `function topKFrequent(nums: number[], k: number): number[] {
  const freq = new Map<number, number>();
  for (const n of nums) freq.set(n, (freq.get(n) ?? 0) + 1);
  const buckets: number[][] = Array.from({ length: nums.length + 1 }, () => []);
  for (const [num, count] of freq) buckets[count].push(num);
  const result: number[] = [];
  for (let i = buckets.length - 1; i >= 0 && result.length < k; i--)
    result.push(...buckets[i]);
  return result.slice(0, k);
}`,
          },
          {
            language: "php",
            code: `function topKFrequent(array $nums, int $k): array {
    $freq = [];
    foreach ($nums as $n) $freq[$n] = ($freq[$n] ?? 0) + 1;
    $buckets = array_fill(0, count($nums) + 1, []);
    foreach ($freq as $num => $count) $buckets[$count][] = $num;
    $result = [];
    for ($i = count($buckets) - 1; $i >= 0 && count($result) < $k; $i--)
        $result = array_merge($result, $buckets[$i]);
    return array_slice($result, 0, $k);
}`,
          },
          {
            language: "java",
            code: `public int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int n : nums) freq.merge(n, 1, Integer::sum);
    List<Integer>[] buckets = new List[nums.length + 1];
    for (int i = 0; i < buckets.length; i++) buckets[i] = new ArrayList<>();
    for (Map.Entry<Integer, Integer> e : freq.entrySet()) buckets[e.getValue()].add(e.getKey());
    int[] result = new int[k]; int idx = 0;
    for (int i = buckets.length - 1; i >= 0 && idx < k; i--)
        for (int num : buckets[i]) { if (idx == k) break; result[idx++] = num; }
    return result;
}`,
          },
          {
            language: "python",
            code: `from collections import Counter

def topKFrequent(nums: list[int], k: int) -> list[int]:
    freq = Counter(nums)
    buckets = [[] for _ in range(len(nums) + 1)]
    for num, count in freq.items():
        buckets[count].append(num)
    result = []
    for i in range(len(buckets) - 1, 0, -1):
        result.extend(buckets[i])
        if len(result) >= k:
            break
    return result[:k]`,
          },
        ],
      },
      {
        num: 75, title: "Find Median from Data Stream", leetcodeNum: 295, slug: "find-median-from-data-stream",
        pattern: "Two heaps", visual: "Max-heap (low) + min-heap (high)",
        difficulty: "hard",
        tags: ["Heap", "Design", "Sorting", "Two Pointers"],
        description: "Implement a class `MedianFinder` that supports:\n- `addNum(int num)`: add a number from the data stream\n- `findMedian()`: return the median of all numbers so far\n\n**Two heaps:** a **max-heap** (lower half) and a **min-heap** (upper half). Balance them so they differ in size by at most 1. The median is either the top of the larger heap or the average of both tops.",
        examples: [
          { input: 'MedianFinder mf; mf.addNum(1); mf.addNum(2); mf.findMedian(); mf.addNum(3); mf.findMedian()', output: "1.5, 2.0" },
        ],
        constraints: ["-10^5 <= num <= 10^5", "At least one element before findMedian is called"],
        approach: "Max-heap for lower half, min-heap for upper half. Balance after each insert. Median = top of larger or average.",
        timeComplexity: "O(log n) addNum, O(1) findMedian",
        spaceComplexity: "O(n)",
        solutions: [
          {
            language: "javascript",
            code: `// JS has no built-in heap; using sorted array for clarity
class MedianFinder {
  constructor() { this.data = []; }
  addNum(num) {
    let lo = 0, hi = this.data.length;
    while (lo < hi) { const mid = (lo + hi) >> 1; if (this.data[mid] < num) lo = mid + 1; else hi = mid; }
    this.data.splice(lo, 0, num);
  }
  findMedian() {
    const n = this.data.length;
    return n % 2 === 1 ? this.data[n >> 1] : (this.data[n/2 - 1] + this.data[n/2]) / 2;
  }
}`,
          },
          {
            language: "typescript",
            code: `class MedianFinder {
  private data: number[] = [];
  addNum(num: number): void {
    let lo = 0, hi = this.data.length;
    while (lo < hi) { const mid = (lo + hi) >> 1; if (this.data[mid] < num) lo = mid + 1; else hi = mid; }
    this.data.splice(lo, 0, num);
  }
  findMedian(): number {
    const n = this.data.length;
    return n % 2 === 1 ? this.data[n >> 1] : (this.data[n/2 - 1] + this.data[n/2]) / 2;
  }
}`,
          },
          {
            language: "php",
            code: `class MedianFinder {
    private array $data = [];
    public function addNum(int $num): void {
        $lo = 0; $hi = count($this->data);
        while ($lo < $hi) { $mid = ($lo + $hi) >> 1; if ($this->data[$mid] < $num) $lo = $mid + 1; else $hi = $mid; }
        array_splice($this->data, $lo, 0, [$num]);
    }
    public function findMedian(): float {
        $n = count($this->data);
        return $n % 2 === 1 ? $this->data[$n >> 1] : ($this->data[$n/2 - 1] + $this->data[$n/2]) / 2;
    }
}`,
          },
          {
            language: "java",
            code: `class MedianFinder {
    // max-heap for lower half
    private PriorityQueue<Integer> lo = new PriorityQueue<>(Collections.reverseOrder());
    // min-heap for upper half
    private PriorityQueue<Integer> hi = new PriorityQueue<>();
    public void addNum(int num) {
        lo.offer(num);
        hi.offer(lo.poll());
        if (lo.size() < hi.size()) lo.offer(hi.poll());
    }
    public double findMedian() {
        return lo.size() > hi.size() ? lo.peek() : (lo.peek() + hi.peek()) / 2.0;
    }
}`,
          },
          {
            language: "python",
            code: `import heapq

class MedianFinder:
    def __init__(self):
        self.lo = []  # max-heap (negate values)
        self.hi = []  # min-heap

    def addNum(self, num: int) -> None:
        heapq.heappush(self.lo, -num)
        heapq.heappush(self.hi, -heapq.heappop(self.lo))
        if len(self.lo) < len(self.hi):
            heapq.heappush(self.lo, -heapq.heappop(self.hi))

    def findMedian(self) -> float:
        if len(self.lo) > len(self.hi):
            return -self.lo[0]
        return (-self.lo[0] + self.hi[0]) / 2`,
          },
        ],
      },
    ],
  },
];

export const BLIND75_TOTAL = BLIND75_CATEGORIES.reduce((sum, c) => sum + c.problems.length, 0);
