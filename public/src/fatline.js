/* global AFRAME THREE */
function isEqualVec3 (a, b) {
  if (!a || !b) { return false; }
  return (a.x === b.x && a.y === b.y && a.z === b.z);
}

/**
 * Ported from a-frame line component to use https://github.com/spite/THREE.MeshLine
 */
AFRAME.registerComponent('fatline', {
  schema: {
    start: {type: 'vec3', default: {x: 0, y: 0, z: 0}},
    end: {type: 'vec3', default: {x: 0, y: 0, z: 0}},
    color: {type: 'color', default: '#74BEC1'},
    width: {type: 'number', default: 0.01},
    opacity: {type: 'number', default: 1},
    visible: {default: true}
  },

  multiple: true,

  init: function () {
    var data = this.data;
    var geometry;
    var lineGeometry;
    var material;
    this.rendererSystem = this.el.sceneEl.systems.renderer;

    material = this.material = new MeshLineMaterial({
      color: data.color,
      lineWidth: data.width,
      opacity: data.opacity,
      visible: data.visible
    })

    geometry = this.geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(2 * 3), 3));

    lineGeometry = this.lineGeometry = new MeshLine();
    lineGeometry.setGeometry(geometry);

    this.rendererSystem.applyColorCorrection(material.color);
    this.line = new THREE.Mesh(lineGeometry, material);
    this.el.setObject3D(this.attrName, this.line);
  },

  update: function (oldData) {
    var data = this.data;
    var geometry = this.geometry;
    var lineGeometry = this.lineGeometry;
    var geoNeedsUpdate = false;
    var material = this.material;
    var positionArray = geometry.attributes.position.array;

    if (!isEqualVec3(data.start, oldData.start)) {
      positionArray[0] = data.start.x;
      positionArray[1] = data.start.y;
      positionArray[2] = data.start.z;
      geoNeedsUpdate = true;
    }

    if (!isEqualVec3(data.end, oldData.end)) {
      positionArray[3] = data.end.x;
      positionArray[4] = data.end.y;
      positionArray[5] = data.end.z;
      geoNeedsUpdate = true;
    }

    if (geoNeedsUpdate) {
      geometry.attributes.position.needsUpdate = true;
      geometry.computeBoundingSphere();
      lineGeometry.setGeometry(geometry);
    }

    material.color.setStyle(data.color);
    this.rendererSystem.applyColorCorrection(material.color);
    material.opacity = data.opacity;
    material.transparent = data.opacity < 1;
    material.visible = data.visible;
    material.lineWidth = data.width;
  },

  remove: function () {
    this.el.removeObject3D(this.attrName, this.line);
  }
})