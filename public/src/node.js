/* globals AFRAME */
AFRAME.registerSystem('node', {
  init: function () {
    const self = this
    self.DEFAULT_TYPE = '_default'

    const box = {
      primitive: 'box',
      width: 0.1,
      height: 0.1,
      depth: 0.1
    }

    self.typesToAttributes = {
      nhs: {
        material: {
          color: '#005EB8'
        },
        geometry: box
      },
      s3: {
        material: {
          color: 'orange'
        },
        geometry: {
          primitive: 'cone',
          height: 0.1,
          radiusBottom: 0.04,
          radiusTop: 0.05
        }
      }
    }
    self.typesToAttributes[self.DEFAULT_TYPE] = {
      material: {
        color: '#666'
      },
      geometry: box
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