/* global DisplaySerializer */
describe('DisplaySerializer', () => {
  
  describe('serialize to graph data', () => {

    let scene, root

    before(function() {
      scene = aframeTestScene({ context: this })
      scene.setActionDelay(50)
    })

    let display, serializer

    beforeEach(function() {
      scene.reset()
      root = scene.addRoot()
      serializer = tiltviz.DisplaySerializer();
    })

    afterEach(() => root.makeViewable())

    it('should persist id of graph from graph-id data attribute of root element', function(done) {
      root.testing(this)

      display = root.addHtml('<a-entity data-graph-id="cheese"></a-entity>')

      scene.actions(() => {
          let graph = serializer.toGraph(display)
          expect(graph.id).to.eql('cheese')
        }, done)
    })

    it('should write an entity as a node with position values', function(done) {
      root.testing(this)

      display = root.addHtml('<a-entity><a-box id="bob" position="1 1 1"></a-box></a-entity>')

      scene.actions(() => {
          let graph = serializer.toGraph(display)
          expect(graph).to.shallowDeepEqual({
            nodes: [{ id: 'bob', position: '1 1 1'}],
            edges: []
          })
        }, done)
    })

    it('should write multiple entities as nodes with position values', function(done) {
      root.testing(this)

      display = root.addHtml('<a-entity>' +
          '<a-box id="foo" position="0 1 0"></a-box>' +
          '<a-box id="bar" position="0 2 0"></a-box>' +
        '</a-entity>')

      scene.actions(() => {
        let graph = serializer.toGraph(display)

        expect(graph).to.shallowDeepEqual({
          nodes: [{
            id: 'foo',
            position: '0 1 0'
          }, {
            id: 'bar',
            position: '0 2 0'
          }],
          edges: []
        })
      }, done)

    })

    it('should write graph with an edge between two entities', function(done) {
      root.testing(this)

      display = root.addHtml('<a-entity>' +
          '<a-box id="from" edge="to: #tog" position="0 1 0"></a-box>' +
          '<a-box id="tog" position="0 2 0"></a-box>' +
        '</a-entity>')

      scene.actions(() => {
        let graph = serializer.toGraph(display)
        expect(graph.nodes.map(node => node.id)).to.eql(['from', 'tog'])
        expect(graph.edges).to.not.be.empty
        expect(graph.edges).to.eql([{
          from: 'from',
          to: 'tog'
        }])
      }, done)
    })

    it('should write graph with multiple edges from an entity', function(done) {
      root.testing(this)

      display = root.addHtml('<a-entity>' +
          '<a-box id="start" edge="to: #one" edge__1="to: #two" edge__2="to: #three" position="0 1 0"></a-box>' +
          '<a-box id="one" position="0 2 -1"></a-box>' +
          '<a-box id="two" position="0 3 -1"></a-box>' +
          '<a-box id="three" position="0 4 -1"></a-box>' +
        '</a-entity>')

      scene.actions(() => {
        let graph = serializer.toGraph(display)
        expect(graph.nodes.map(node => node.id)).to.eql(['start', 'one', 'two', 'three'])
        expect(graph.edges.length).to.eql(3)
        expect(graph.edges).to.eql([{
          from: 'start',
          to: 'one'
        }, {
          from: 'start',
          to: 'two'
        }, {
          from: 'start',
          to: 'three'
        }])
      }, done)
    })

    describe('writing types', () => {
      it('should write node type', function(done) {
        root.testing(this)

        display = root.addHtml('<a-entity>' +
          '<a-box data-node-type="bob"></a-box>' +
          '</a-entity>')

        scene.actions(() => {
          let graph = serializer.toGraph(display)
          expect(graph.nodes[0].type).to.eql('bob')
        }, done)
      })

      it('should write edge type', function(done) {
        root.testing(this)

        display = root.addHtml('<a-entity>' +
          '<a-box id="from" edge="to: #toq; type: queue" position="0 1 0"></a-box>' +
          '<a-box id="toq"></a-box>' +
          '</a-entity>')

        scene.actions(() => {
          let graph = serializer.toGraph(display)
          expect(graph.edges[0].type).to.eql('queue')
        }, done)
      })
    })

  })
})