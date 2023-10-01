AFRAME.registerComponent("waters", {
  init: function () {
    this.shootwater();
  },
  shootwater: function () {
    window.addEventListener("keydown", (e) => {
      if (e.key === "z") {
        var water = document.createElement("a-entity");

        water.setAttribute("geometry", {
          primitive: "sphere",
          radius: 0.1,
        });

        water.setAttribute("material", "color", "black");

        var cam = document.querySelector("#camera");

        pos = cam.getAttribute("position");

        water.setAttribute("position", {
          x: pos.x,
          y: pos.y,
          z: pos.z,
        });

        var camera = document.querySelector("#camera").object3D;

        //get the camera direction as Three.js Vector
        var direction = new THREE.Vector3();
        camera.getWorldDirection(direction);

        //set the velocity and it's direction
        water.setAttribute("velocity", direction.multiplyScalar(-10));

        var scene = document.querySelector("#scene");

        //set the water as the dynamic entity
        water.setAttribute("dynamic-body", {
          shape: "sphere",
          mass: "0",
        });

        //add the collide event listener to the water
        water.addEventListener("collide", this.removewater);

        scene.appendChild(water);
      }
    });
  },
  removewater: function (e) {

    var element = e.detail.target.el;

    var elementHit = e.detail.body.el;

    if (elementHit.id.includes("box")) {
      elementHit.setAttribute("material", {
        opacity: 0.6,
        transparent: true,
      });

      var impulse = new CANNON.Vec3(-2, 2, 1);
      var worldPoint = new CANNON.Vec3().copy(
        elementHit.getAttribute("position")
      );

      elementHit.body.applyImpulse(impulse, worldPoint);

      element.removeEventListener("collide", this.shoot);

      var scene = document.querySelector("#scene");
      scene.removeChild(element);
    }
  },
});