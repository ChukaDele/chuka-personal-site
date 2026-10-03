export function boundedPoint(x, y, boardWidth, boardHeight, itemWidth, itemHeight, inset = 14) {
  const halfWidth = itemWidth / 2 + inset;
  const halfHeight = itemHeight / 2 + inset;
  return {
    x: Math.min(Math.max(x, halfWidth), Math.max(halfWidth, boardWidth - halfWidth)),
    y: Math.min(Math.max(y, halfHeight), Math.max(halfHeight, boardHeight - halfHeight))
  };
}
