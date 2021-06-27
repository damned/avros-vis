/* global chai aframeTestScene */
const expect = chai.expect

import aframeAssertions from './chai-aframe-assertions.js'

// chai.use(aframeAssertions);

describe('chai aframe assertions', () => {
  it('should run a test at all', () => {
    expect(true).to.be.true
  })
})
