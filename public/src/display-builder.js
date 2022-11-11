/* global AFRAME */
var tiltviz = tiltviz || {}

tiltviz.DisplayBuilder = function(loader) {
  const api = {}
  const entityMoveHandlers = [];
  const attrs = au.attributeValue

  function createNode(rootEl, node, defaultPlacementCount, edgeAttributes) {
    const length = 0.1
    let nodeId = node.id
    let position = node.position;
    if (node.position === undefined) {
      const offset = defaultPlacementCount++ * 2 * length;
      position = `${offset} 0 -${offset}`;
    }

    const typeSpec = {
      material: {
        color: '#666'
      },
      geometry: {
        primitive: 'box',
        width: length,
        height: length,
        depth: length
      }
    }

    const typeAttributes = {
      material: attrs(typeSpec.material),
      geometry: attrs(typeSpec.geometry)
    };

    const attributes = Object.assign({
      id: nodeId,
      class: 'touchable',
      'balloon-label': attrs({label: nodeId, yOffset: -0.35, scale: 0.2}),
      'follower-constraint': attrs({lock: 'rotation', 'snap-to-grid': 0.1}),
      position: position
    }, edgeAttributes, typeAttributes)

    const nodeHtml = au.entityHtml('a-entity', attributes)

    rootEl.insertAdjacentHTML('beforeend', nodeHtml)

    entityMoveHandlers.forEach(handler => rootEl.lastChild.addEventListener('moveend', handler))

    return defaultPlacementCount
  }

  function createEdgeAttributes(edges) {
    const all = {}
    edges.forEach((edge, i) => {
      let suffix = (i === 0 ? '' : '__' + i);
      let attributes = {
        to: '#' + edge.to,
        type: edge.type
      }
      all[`edge${suffix}`] = attrs(attributes)
    })
    return all
  }

  function extractEdgesFromNode(graph, nodeId) {
    if (graph.edges) {
      return graph.edges.filter(e => e.from === nodeId)
    }
    return []
  }

  api.build = rootEl => {
    const graph = loader()
    let defaultPlacementCount = 0
    if (graph.id) {
      rootEl.dataset.graphId = graph.id
    }
    graph.nodes.forEach((node, i) => {
      let edges = extractEdgesFromNode(graph, node.id);
      defaultPlacementCount = createNode(rootEl, node, defaultPlacementCount, createEdgeAttributes(edges));
    });
  }

  api.withEntityMoveHandler = handler => {
    entityMoveHandlers.push(handler)
    return api
  }

  return api
}