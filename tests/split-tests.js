/* global calcAreaXZSplit */

describe('calcAreaXZSplit', () => {
  
  it('should not split a unit square for only 1 split', () => {
    let split = calcAreaXZSplit({ x: 1, z: 1 }, 1)
    expect(split).to.eql({
      counts: {x: 1, z: 1},
      sizes: {x: 1, z: 1}
    })
  })
  
  it('should split a unit square in half (in x) when split in 2', () => {
    let split = calcAreaXZSplit({ x: 1, z: 1 }, 2)
    expect(split).to.eql({
      counts: {x: 2, z: 1},
      sizes: {x: 0.5, z: 1}
    })
  })

  it('should split a non-unit square in half (in x) when split in 2', () => {
    let split = calcAreaXZSplit({ x: 2, z: 2 }, 2)
    expect(split).to.eql({
      counts: {x: 2, z: 1},
      sizes: {x: 1, z: 2}
    })
  })

  it('should split a square in half (in x and z) when split in 4', () => {
    let split = calcAreaXZSplit({ x: 2, z: 2 }, 4)
    expect(split).to.eql({
      counts: {x: 2, z: 2},
      sizes: {x: 1, z: 1}
    }, 'actual split: ' + JSON.stringify(split))
  })
})