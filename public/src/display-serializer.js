/* global AFRAME */
var tiltviz = tiltviz || {}

tiltviz.DisplaySerializer = function() {
  const api = {}

  function extractNodeData(entity) {
    let id = entity.getAttribute('id');
    let position = entity.getAttribute('position');
    const nodeData = {
      id: id,
      position: au.xyzTriplet(position)
    };
    if (entity.dataset.nodeType) {
      nodeData.type = entity.dataset.nodeType
    }
    if (entity.dataset.custom) {
      Object.assign(nodeData, JSON.parse(entity.dataset.custom))
    }
    return nodeData;
  }

  function extractEdgeData(component, id) {
    const edgeData = component.data;
    const edgeProperties = {
      from: id,
      to: edgeData.to.getAttribute('id')
    };
    if (edgeData.type) {
      edgeProperties.type = edgeData.type
    }
    if (edgeData.label) {
      edgeProperties.id = edgeData.label
    }
    return edgeProperties;
  }

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

    let mainEntityFilter = el => el.classList.contains('node')

    Array.from(rootEl.children).filter(mainEntityFilter).forEach(entity => {
      const nodeData = extractNodeData(entity);
      nodes.push(nodeData)
      forEachEdgeComponent(entity, component => {
        edges.push(extractEdgeData(component, nodeData.id))
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
