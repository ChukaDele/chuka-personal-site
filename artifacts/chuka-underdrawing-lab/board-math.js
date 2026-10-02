/* Keep the entire rotated paper within the board, including its drag handle. */
function boundPaper(x, y, width, height, boardWidth, boardHeight, angle = 0) {
  const radians = angle * Math.PI / 180;
  const padX = Math.max(0, (Math.abs(width * Math.cos(radians)) + Math.abs(height * Math.sin(radians)) - width) / 2) + 8;
  const padY = Math.max(0, (Math.abs(height * Math.cos(radians)) + Math.abs(width * Math.sin(radians)) - height) / 2) + 8;
  const minX = Math.min(padX, Math.max(0, (boardWidth - width) / 2));
  const minY = Math.min(padY, Math.max(0, (boardHeight - height) / 2));
  return {
    x: Math.min(Math.max(x, minX), Math.max(minX, boardWidth - width - padX)),
    y: Math.min(Math.max(y, minY), Math.max(minY, boardHeight - height - padY))
  };
}
