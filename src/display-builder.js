/* global AFRAME */
var tiltviz = tiltviz || {}

tiltviz.DisplayBuilder = function(loader) {
  const self = this
  const api = {}

  function createNode(rootEl, nodeId, i, edgeAttribute) {
    const length = 0.1
    rootEl.insertAdjacentHTML('beforeend',
      `<a-box id="${nodeId}" balloon-label="label: ${nodeId}"`
      + edgeAttribute
      + ` position="0 0 -${i * 2 * length}"`
      + ` width="${length}" height="${length}" depth="${length}" ></a-box>`)
  }

  function createEdgeAttribute(edge) {
    if (edge === null || edge === undefined) {
      return ''
    }
    return ` edge="to: #${edge.to}" `
  }

  function extractEdgeFromNode(graph, nodeId) {
    if (graph.edges) {
      return graph.edges.find(e => e.from === nodeId)
    }
    return null
  }

  api.build = rootEl => {
    const graph = loader()
    graph.nodes.forEach((nodeId, i) => {
      let edge = extractEdgeFromNode(graph, nodeId);
      createNode(rootEl, nodeId, i, createEdgeAttribute(edge));
    });
  }

  return api
}