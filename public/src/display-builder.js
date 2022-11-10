/* global AFRAME */
var tiltviz = tiltviz || {}

tiltviz.DisplayBuilder = function(loader) {
  const api = {}
  const entityMoveHandlers = [];

  function createNode(rootEl, node, defaultPlacementCount, edgeAttributes) {
    const length = 0.1
    let nodeId = node.id
    let position = node.position;
    if (node.position === undefined) {
      position = `0 0 -${defaultPlacementCount++ * 2 * length}`;
    }
    rootEl.insertAdjacentHTML('beforeend',
      `<a-box id="${nodeId}" balloon-label="label: ${nodeId}; y-offset: -0.35; scale: 0.2"`
      + edgeAttributes
      + ' class="touchable" follower-constraint="lock: rotation; snap-to-grid: 0.1"'
      + ' color="#666"'
      + ` position="${position}"`
      + ` width="${length}" height="${length}" depth="${length}" ></a-box>`)

    entityMoveHandlers.forEach(handler => rootEl.lastChild.addEventListener('moveend', handler))

    return defaultPlacementCount
  }

  function createEdgeAttributes(edges) {
    let concatenated = ''
    edges.forEach((edge, i) => {
      let suffix = (i === 0 ? '' : '__' + i);
      concatenated += ` edge${suffix}="to: #${edge.to}"`
    })
    return concatenated
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