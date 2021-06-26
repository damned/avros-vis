/* global calcAreaXZSplit */

describe('calcAreaXZSplit', () => {
  
  const splitInfo = split => 'split: ' + JSON.stringify(split)
  
  describe('splitting squares', () => {
    
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
      }, splitInfo(split))
    })

    it('should split a square in half (in x and z) when split in 3 just like 4', () => {
      let split = calcAreaXZSplit({ x: 2, z: 2 }, 3)
      expect(split).to.eql({
        counts: {x: 2, z: 2},
        sizes: {x: 1, z: 1}
      }, splitInfo(split))
    })

    it('should split a square 3 by 2 (more x splits) when split in 6', () => {
      let split = calcAreaXZSplit({ x: 3, z: 3 }, 6)
      expect(split).to.eql({
        counts: {x: 3, z: 2},
        sizes: {x: 1, z: 1.5}
      }, splitInfo(split))
    })
    
  })
 
  describe('splitting rectangles', () => {
    it('should split a 2x3 rectangle on the longer axis first, to give a squarer sub-areas', () => {
      let split = calcAreaXZSplit({ x: 2, z: 3 }, 2)      
      expect(split).to.eql({
        counts: {x: 1, z: 2},
        sizes: {x: 2, z: 1.5}
      }, splitInfo(split))
    })
  })
})