/* global chai*/
const expect = chai.expect

import aframeAssertions from './chai-aframe-assertions.js'

// chai.use(aframeAssertions);

describe('chai aframe assertions', () => {
  it('should pass', () => {
    expect(false).to.be.false
  })
})