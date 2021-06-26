const calcAreaXZSplit = (size, totalSplits) => {
  let nx = 1, nz = 1, product = 1
  while (product < totalSplits) {
    nx += 1
    product = nx * nz
  }
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

