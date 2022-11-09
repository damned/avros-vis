/* global AFRAME */
var tiltviz = tiltviz || {}

tiltviz.DisplayBuilder = function(loader) {
  const self = this
  const api = {}

  function createNode(rootEl, nodeId, i, edgeAttribute) {
    const length = 0.1
    rootEl.insertAdjacentHTML('beforeend',
      `<a-box id="${nodeId}" balloon-label="label: ${nodeId}; y-offset: -0.35; scale: 0.3"`
      + edgeAttribute
      + ' class="touchable" follower-constraint="lock: rotation; snap-to-grid: 0.1"'
      + ' color="#666"'
      + ` position="0 0 -${i * 2 * length}"`
      + ` width="${length}" height="${length}" depth="${length}" ></a-box>`)
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
    graph.nodes.forEach((nodeId, i) => {
      let edges = extractEdgesFromNode(graph, nodeId);
      createNode(rootEl, nodeId, i, createEdgeAttributes(edges));
    });
  }

  return api
}