const calcAreaXZSplit = (size, totalSplits) => {
  return {
    counts: {
      x: totalSplits,
      z: 1
    },
    sizes: {
      x: size.x / totalSplits,
      z: size.z
    }
  }
}

