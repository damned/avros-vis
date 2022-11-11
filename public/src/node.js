/* globals AFRAME */
AFRAME.registerSystem('node', {
  init: function () {
    const self = this
    self.DEFAULT_TYPE = '_default'
    self.typesToAttributes = {
      db: {
        material: {
          color: '#495'
        },
        geometry: {
          primitive: 'cylinder',
          height: 0.1,
          radius: 0.05
        }
      }
    }
    self.typesToAttributes[self.DEFAULT_TYPE] = {
      material: {
        color: '#666'
      },
      geometry: {
        primitive: 'box',
        width: 0.1,
        height: 0.1,
        depth: 0.1
      }
    }

    self.attributesOfType = type => {
      console.log('getting node attributes of type ' + type)
      if (self.typesToAttributes.hasOwnProperty(type)) {
        console.log('returning specific type attributes')
        return self.typesToAttributes[type]
      }
      console.log('returning default attributes')
      return self.typesToAttributes[self.DEFAULT_TYPE]
    }
  },
});