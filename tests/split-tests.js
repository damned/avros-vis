/* global calcAreaXZSplit */

describe('calcAreaXZSplit', () => {
  
  it('should not really split a unit square', () => {
    let split = calcAreaXZSplit({ x: 1, z: 1 }, 1)
    expect(split).to.eql({
      counts: {x: 1, z: 1},
      sizes: {x: 1, z: 1}
    })
  })
  
  it('should not really split a unit square', () => {
    let split = calcAreaXZSplit({ x: 1, z: 1 }, 1)
    expect(split).to.eql({
      counts: {x: 1, z: 1},
      sizes: {x: 1, z: 1}
    })
  })
})