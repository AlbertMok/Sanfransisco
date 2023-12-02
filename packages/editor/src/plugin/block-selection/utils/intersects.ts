/**
 * @center : 这种模式检查第二个元素（b）的边界矩形的中心是否在第一个元素（a）的边界矩形内。它通过将 b 的宽度和高度的一半分别加到其左边和顶部的位置来计算 b 的中心。然后检查这个中心点是否在 a 的左、右、上、下边界内。如果在这些边界内，函数返回 `true`，表示有相交。
 *
 * @cover : 这种模式下，函数检查第二个元素（b）是否完全位于第一个元素（a）内部。这是通过确保 b 的左边缘在 a 的左边缘的右边，b 的右边缘在 a 的右边缘的左边，b 的上边缘在 a 的上边缘的下边，以及 b 的下边缘在 a 的下边缘的上边来判断的。如果所有这些条件都满足，意味着 b 完全被 a 包围，函数返回 `true`
 *
 * @touch : 这是默认模式。它检查元素是否以任何方式接触对方。这是通过检查 a 的右边缘是否在 b 的左边缘的右边，a 的左边缘是否在 b 的右边缘的左边，a 的下边缘是否在 b 的上边缘的下边，以及 a 的上边缘是否在 b 的下边缘的上边来确定的。如果这些条件中的任何一个成立，意味着存在重叠，函数返回 true
 */
export type Intersection = 'center' | 'cover' | 'touch'

/**
 * Check if two DOM-Elements intersects each other.
 * @param a BoundingClientRect of the first element.
 * @param b BoundingClientRect of the second element.
 * @param mode Options are center, cover or touch.
 * @returns {boolean} If both elements intersects each other.
 */
export function intersects(a: DOMRect, b: DOMRect, mode: Intersection = 'touch'): boolean {
  switch (mode) {
    case 'center': {
      // b x axis center
      const b_x_center = b.left + b.width / 2
      // b y axis center
      const b_y_center = b.top + b.height / 2

      return b_x_center >= a.left && b_x_center <= a.right && b_y_center >= a.top && b_y_center <= a.bottom
    }
    case 'cover': {
      return b.left >= a.left && b.top >= a.top && b.right <= a.right && b.bottom <= a.bottom
    }
    case 'touch': {
      return a.right >= b.left && a.left <= b.right && a.bottom >= b.top && a.top <= b.bottom
    }
  }
}
