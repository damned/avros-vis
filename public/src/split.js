const calcAreaXZSplit = (size, totalSplits) => {
  let nx = 1, nz = 1, product = 1
  while (product < totalSplits) {
    if (nx * size.z > nz * size.x) {
      nz += 1      
    }
    else {
      nx += 1
    }
    product = nx * nz
  }
  return {
    counts: {
      x: nx,
      z: nz
    },
    sizes: {
      x: size.x / nx,
      z: size.z / nz
    }
  }
}

