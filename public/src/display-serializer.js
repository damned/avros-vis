/* global AFRAME */
var tiltviz = tiltviz || {}

tiltviz.DisplaySerializer = function() {
  const api = {}

  function forEachEdgeComponent(entity, edgeHandler) {
    let edgeCount = 0
    Object.entries(entity.components).forEach(entry => {
      let [name, component] = entry
      const otherEdgesPrefix = 'edge__'
      console.log('component name, component: ', name, component)
      if (name === 'edge' || name.startsWith(otherEdgesPrefix)) {
        edgeHandler(component, edgeCount++)
      }
    })
  }

  api.toGraph = rootEl => {
    const nodes = []
    const edges = []

    let mainEntityFilter = el => el.components.geometry !== undefined;

    Array.from(rootEl.children).filter(mainEntityFilter).forEach(entity => {
      let position = entity.getAttribute('position');
      let id = entity.getAttribute('id');
      nodes.push({
        id: id,
        position: au.xyzTriplet(position)
      })
      forEachEdgeComponent(entity, (component, index) => {
        console.log('got edge component, index: ' + index)
        const edgeData = component.data;
        const edgeProperties = {
          from: id,
          to: edgeData.to.getAttribute('id')
        };
        if (edgeData.type) {
          edgeProperties.type = edgeData.type
        }
        edges.push(edgeProperties)
      })
    })

    return {
      id: rootEl.dataset.graphId,
      nodes: nodes,
      edges: edges
    }
  }

  return api
}