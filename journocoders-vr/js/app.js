(function(){

  var WINDOW_WIDTH = window.innerWidth;
  var WINDOW_HEIGHT = window.innerHeight;
  var WORLD_WIDTH = 2000;
  var WORLD_HEIGHT = 1900;

  var scene = new THREE.Scene();

  var clock = new THREE.Clock();

  var camera = new THREE.PerspectiveCamera(75, WINDOW_WIDTH / WINDOW_HEIGHT, 1, 5000);
  camera.position.set(0, -199, 75);
  camera.up = new THREE.Vector3(0,0,1);
  camera.lookAt(scene.position);

  var renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0xFFFFFF);

  renderer.setSize(WINDOW_WIDTH, WINDOW_HEIGHT);

  document.body.appendChild( renderer.domElement );

  var effect = new THREE.VREffect(renderer);
  effect.setSize(WINDOW_WIDTH, WINDOW_HEIGHT);

  var manager = new WebVRManager(renderer, effect);

  var terrainURL = "data/Gale_HRSC_DEM_50m_300x285.bin";
  var terrainLoader = new THREE.TerrainLoader();
  var surface;

  var geometry = new THREE.PlaneGeometry(WORLD_WIDTH, WORLD_HEIGHT, 299, 284);

  terrainLoader.load(terrainURL, function(data){
    for (var i = 0, l = geometry.vertices.length; i < l; i++) {
      geometry.vertices[i].z = data[i] / 65535 * 100;
    }
    var textureLoader = new THREE.TextureLoader();
    var textureURL = "data/hill.jpg";
    textureLoader.load(textureURL, function(texture) {
      renderer.setClearColor(0xDAB760);
      document.getElementsByClassName('loading')[0].style.display = 'none';
      var material = new THREE.MeshLambertMaterial({
        map: texture
      });
      surface = new THREE.Mesh(geometry, material);
      scene.add(surface);
    });
  });

  // Lights!
  var dirLight = new THREE.DirectionalLight( 0xffffff, 0.75);
  dirLight.position.set( -1, 1, 1).normalize();

  var ambiLight = new THREE.AmbientLight(0x999999);

  scene.add(ambiLight);
  scene.add(dirLight);

  var controls = new THREE.FlyControls(camera);

  controls.autoForward = false;
  controls.dragToLook = true;
  controls.movementSpeed = 20;
  controls.rollSpeed = Math.PI / 12;

  if (is_mobile) {
    var controls = new THREE.VRControls(camera);
  } else {
    var controls = new THREE.FlyControls(camera);
    controls.autoForward = false;
    controls.dragToLook = true;
    controls.movementSpeed = 50;
    controls.rollSpeed = Math.PI / 12;
  }

  // Render loop
  function render() {
    var delta = clock.getDelta();
    controls.update(delta);
    requestAnimationFrame( render );
    manager.render(scene, camera);
  }
  
  render();
}());
