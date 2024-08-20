const arr = [1, 2, 3, [4, 5, 6], [7, 8, [9, 10, 11], 12], [13, 14, 15]];
const n = 2;
const item = [7, 8, [9, 10, 11], 12];

console.log(...item.map((subItem) => [subItem, n - 1]));
