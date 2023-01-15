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

    const bucket = {
      primitive: 'cone',
      height: 0.1,
      radiusBottom: 0.04,
      radiusTop: 0.05
    }

    const cylinder = {
      primitive: 'cylinder',
      height: 0.1,
      radius: 0.05
    }

    const tetrahedron = {
      primitive: 'tetrahedron',
      radius: 0.08
    }

    self.typesToAttributes = {
      nhs: {
        material: {
          color: '#005EB8'
        },
        geometry: box
      },
      aws: {
        material: {
          color: 'orange'
        },
        geometry: box
      },
      db: {
        material: {
          color: '#6a7'
        },
        geometry: cylinder
      },
      'ecs-java': {
        material: {
          color: '#9b9'
        },
        geometry: box
      },
      'ecs-nodejs': {
        material: {
          color: '#b9b'
        },
        geometry: box
      },
      'ecs-python': {
        material: {
          color: '#bb5'
        },
        geometry: box
      },
      'lambda': {
        material: {
          color: 'orange'
        },
        geometry: tetrahedron,
        rotation: '-30 0 60'
      },
      s3: {
        material: {
          color: 'orange'
        },
        geometry: bucket
      },
      scenario: {}
    }

    self.typesToAttributes[self.DEFAULT_TYPE] = {
      material: {
        color: '#666'
      },
      geometry: box
    }

    self.withDynamicAttributes = (baseAttributes, node) => {
      const type = node.type
      if (type == 'scenario') {
        return Object.assign({}, baseAttributes, {
          customAttributes: {
            tablet: {
              text: node.description
            }
          },
          customData: {
            description: node.description
          }
        })
      }
      else {
        return baseAttributes
      }
    }

    self.attributesFor = node => {
      const type = node.type
      console.log('getting node attributes of type ' + type)
      let baseAttributes
      if (self.typesToAttributes.hasOwnProperty(type)) {
        console.log('basing on specific type attributes')
        baseAttributes = self.typesToAttributes[type]
      }
      else {
        console.log('basing on default attributes')
        baseAttributes = self.typesToAttributes[self.DEFAULT_TYPE]
      }
      return self.withDynamicAttributes(baseAttributes, node)
    }
  },
})