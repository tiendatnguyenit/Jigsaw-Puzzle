export interface JigsawShape {
  path: string;
  width: number;
  height: number;
}

export const generateJigsawShape = (
  row: number,
  col: number,
  totalRows: number,
  totalCols: number,
  pieceSize: number
): JigsawShape => {
  const width = pieceSize;
  const height = pieceSize;
  const tabSize = pieceSize * 0.3; // Size of the jigsaw tabs

  // Calculate positions for tabs and blanks
  const hasTopTab = row > 0;
  const hasBottomTab = row < totalRows - 1;
  const hasLeftTab = col > 0;
  const hasRightTab = col < totalCols - 1;

  // Alternate tab direction for variety
  const topTabOut = (row + col) % 2 === 0;
  const bottomTabOut = (row + col) % 2 === 1;
  const leftTabOut = (row + col) % 2 === 0;
  const rightTabOut = (row + col) % 2 === 1;

  let path = `M 0 ${height / 2}`;

  // Top edge
  if (hasTopTab) {
    if (topTabOut) {
      path += ` L ${width / 2 - tabSize / 2} 0`;
      path += ` Q ${width / 2 - tabSize / 4} ${-tabSize / 2} ${width / 2} ${
        -tabSize / 2
      }`;
      path += ` Q ${width / 2 + tabSize / 4} ${-tabSize / 2} ${
        width / 2 + tabSize / 2
      } 0`;
    } else {
      path += ` L ${width / 2 - tabSize / 2} 0`;
      path += ` Q ${width / 2 - tabSize / 4} ${tabSize / 2} ${width / 2} ${
        tabSize / 2
      }`;
      path += ` Q ${width / 2 + tabSize / 4} ${tabSize / 2} ${
        width / 2 + tabSize / 2
      } 0`;
    }
  }
  path += ` L ${width} 0`;

  // Right edge
  if (hasRightTab) {
    if (rightTabOut) {
      path += ` L ${width} ${height / 2 - tabSize / 2}`;
      path += ` Q ${width + tabSize / 2} ${height / 2 - tabSize / 4} ${
        width + tabSize / 2
      } ${height / 2}`;
      path += ` Q ${width + tabSize / 2} ${height / 2 + tabSize / 4} ${width} ${
        height / 2 + tabSize / 2
      }`;
    } else {
      path += ` L ${width} ${height / 2 - tabSize / 2}`;
      path += ` Q ${width - tabSize / 2} ${height / 2 - tabSize / 4} ${
        width - tabSize / 2
      } ${height / 2}`;
      path += ` Q ${width - tabSize / 2} ${height / 2 + tabSize / 4} ${width} ${
        height / 2 + tabSize / 2
      }`;
    }
  }
  path += ` L ${width} ${height}`;

  // Bottom edge
  if (hasBottomTab) {
    if (bottomTabOut) {
      path += ` L ${width / 2 + tabSize / 2} ${height}`;
      path += ` Q ${width / 2 + tabSize / 4} ${height + tabSize / 2} ${
        width / 2
      } ${height + tabSize / 2}`;
      path += ` Q ${width / 2 - tabSize / 4} ${height + tabSize / 2} ${
        width / 2 - tabSize / 2
      } ${height}`;
    } else {
      path += ` L ${width / 2 + tabSize / 2} ${height}`;
      path += ` Q ${width / 2 + tabSize / 4} ${height - tabSize / 2} ${
        width / 2
      } ${height - tabSize / 2}`;
      path += ` Q ${width / 2 - tabSize / 4} ${height - tabSize / 2} ${
        width / 2 - tabSize / 2
      } ${height}`;
    }
  }
  path += ` L 0 ${height}`;

  // Left edge
  if (hasLeftTab) {
    if (leftTabOut) {
      path += ` L 0 ${height / 2 + tabSize / 2}`;
      path += ` Q ${-tabSize / 2} ${height / 2 + tabSize / 4} ${-tabSize / 2} ${
        height / 2
      }`;
      path += ` Q ${-tabSize / 2} ${height / 2 - tabSize / 4} 0 ${
        height / 2 - tabSize / 2
      }`;
    } else {
      path += ` L 0 ${height / 2 + tabSize / 2}`;
      path += ` Q ${tabSize / 2} ${height / 2 + tabSize / 4} ${tabSize / 2} ${
        height / 2
      }`;
      path += ` Q ${tabSize / 2} ${height / 2 - tabSize / 4} 0 ${
        height / 2 - tabSize / 2
      }`;
    }
  }
  path += ` Z`;

  return {
    path,
    width:
      width +
      (hasRightTab && rightTabOut ? tabSize : 0) +
      (hasLeftTab && leftTabOut ? tabSize : 0),
    height:
      height +
      (hasTopTab && topTabOut ? tabSize : 0) +
      (hasBottomTab && bottomTabOut ? tabSize : 0),
  };
};

export const generateAllJigsawShapes = (
  rows: number,
  cols: number,
  pieceSize: number
): JigsawShape[][] => {
  const shapes: JigsawShape[][] = [];

  for (let row = 0; row < rows; row++) {
    const rowShapes: JigsawShape[] = [];
    for (let col = 0; col < cols; col++) {
      rowShapes.push(generateJigsawShape(row, col, rows, cols, pieceSize));
    }
    shapes.push(rowShapes);
  }

  return shapes;
};
