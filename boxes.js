var boxes = {
  startScene: (sceneContainerSpec) => {
    let scene = document.createElement('a-scene')
    document.querySelector(sceneContainerSpec).appendChild(scene)
    let box = document.createElement('a-box')
    scene.appendChild(box)
  }
}