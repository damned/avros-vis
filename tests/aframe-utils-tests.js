/* global AFRAME THREE boxes au aframeTestScene */
var chai = chai || {}
var expect = chai.expect

var TOLERANCE = 0.001

describe('aframe utils', () => {
  let select = selector => document.querySelector(selector)    
  
  describe('general utils', () => {
    describe('addEntityTo', () => {
      let parent = document.querySelector('body')
      it('returns a new tag added to the parent', () => {
        let created = au.addEntityTo(parent, 'footer')
        
        expect(created.parentNode).to.equal(parent)
        expect(created.outerHTML).to.equal('<footer></footer>')
      })

      it('adds the added element as last child of the parent', () => {
        let created = au.addEntityTo(parent, 'p')
        
        let lastChild = parent.children[parent.children.length - 1]
        expect(lastChild).to.equal(created)
      })

      it('adds an attribute if passed', () => {
        let created = au.addEntityTo(parent, 'p', {bob: 'foobar'})
        
        expect(created.outerHTML).to.equal('<p bob="foobar"></p>')
      })

      it('adds multiple attributes if passed', () => {
        let created = au.addEntityTo(parent, 'p', {bob: 'foobar', sue: 'blue'})
        
        expect(created.outerHTML).to.equal('<p bob="foobar" sue="blue"></p>')
      })

      it('adds attributes with object values with css-style formatting', () => {
        let created = au.addEntityTo(parent, 'p', {bob: {a: 'a-value', 'bee-key': 'bee-value'}})
        
        expect(created.outerHTML).to.equal('<p bob="a: a-value; bee-key: bee-value"></p>')
      })
    })
  })
  
  describe('aframe scene related', () => {
    const scene = aframeTestScene({ sceneName: 'aframe utils'})

    beforeEach(scene.reset)
    
    describe('earliestAncestor()', () => {
      
      it('should return itself if no scene parent', done => {
        scene.within(() => {
          let target = scene.addHtml('<a-box id="target">', '#target')
          expect(au.earliestAncestor(target)).to.equal(target)
          done()
        })
      })
      it('should return parent if one ancestor', done => {
        scene.within(() => {
          scene.addHtml('<a-box id="parent">'
                          +   '<a-box id="target"></a-box>'
                          + '</a-box>')
          expect(au.earliestAncestor(select('#target'))).to.equal(select('#parent'))
          done()
        })
      })
    })
  })
})