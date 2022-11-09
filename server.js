const http = require('http')
const fs = require('fs')
const express = require('express')

function doSomeMagicToMakeExpressParseJsonBodyAsYoudExpectItDidOutOfTheBox() {
  var bodyParser = require('body-parser');
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
}

process.title = "tilt-viz-server";

const port = process.env.PORT || 3000;

const app = express();
app.use(express.static('public'))

const webServer = http.createServer(app)

const graphJsonFilepath = (graphId) => `.data/graphs/${graphId}`

app.get('/graph/:graphId', function (req, res) {
  let graphId = req.params.graphId
  console.log('giving graph ' + graphId)
  let path = graphId === 'default' ? 'public/default-graph.json' : graphJsonFilepath(graphId)
  let graphJson = fs.readFileSync(path)
  res.send(graphJson)
})

doSomeMagicToMakeExpressParseJsonBodyAsYoudExpectItDidOutOfTheBox()

app.put('/graph/:graphId', function (req, res) {
  let graphId = req.params.graphId
  console.log('updating graph ' + graphId)
  if (req.body.nodes && req.body.nodes.length >= 0) {
    console.log('saving graph:', graphId)
    fs.mkdirSync(graphJsonFilepath(''), { recursive: true })
    fs.writeFileSync(graphJsonFilepath(graphId), JSON.stringify(req.body))
    res.json({success:true})
  }
  else {
    res.status(400).json({success: false, message: 'graph did not contain any nodes'})
  }
})

webServer.listen(port, () => {
  console.log("listening on http://localhost:" + port);
});