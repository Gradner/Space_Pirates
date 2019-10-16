var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let cube;
let ground;
let directions = {
  forward: false,
  back: false,
  left: false,
  right: false
}

let maxSpeed = 0.05
let maxTurn = 0.05
let maxFall = 1

let currentSpeed = 0
let currentTurn = 0
let currentFall = 0

function onWindowResize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function onKeyDown(e){
  console.log(e)
  switch(e.keyCode){
    case 87:
      directions.forward = true;
      break
    case 83:
      directions.back = true;
      break
    case 65:
      directions.left = true;
      break
    case 68:
      directions.right = true;
      break
  }
}

function onKeyUp(e){
  switch(e.keyCode){
    case 87:
      directions.forward = false;
      break
    case 83:
      directions.back = false;
      break
    case 65:
      directions.left = false;
      break
    case 68:
      directions.right = false;
      break
  }
}

let setupScene = () => {
  var cubeGeo = new THREE.BoxGeometry( 1, 1, 1 );
  var cubeMat = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  cube = new THREE.Mesh( cubeGeo, cubeMat );
  scene.add( cube );
  cube.position.y = 2

  let groundGeo = new THREE.PlaneGeometry(10, 10, 10)
  let groundMat = new THREE.MeshBasicMaterial( { color: 0x00ffcc } );
  ground = new THREE.Mesh( groundGeo, groundMat)
  ground.rotateX(- Math.PI / 2)
  scene.add(ground)
  

  camera.position.z = 20;
  camera.position.y = 1
  window.addEventListener( 'resize', onWindowResize, false );
  window.addEventListener( 'keydown', onKeyDown);
  window.addEventListener( 'keyup', onKeyUp);
  animate();
}

checkGround = () => {
  let ray = new THREE.Raycaster (new THREE.Vector3(cube.position.x, cube.position.y, cube.position.z), new THREE.Vector3(0, -1, 0))
  let intersects = ray.intersectObjects(scene.children)
  if(intersects.length > 0){
    console.log(intersects[0].distance)
    if(intersects[0].distance.toFixed(3) > 0.500){
      if(intersects[0].distance.toFixed(3) < currentFall){
        cube.position.y = (intersects[0].distance + 0.5)
      } else {
        if(currentFall < maxFall){
          currentFall += 0.1
        }
      }
    } else {
      cube.position.y += (0.5 - intersects[0].distance)
      currentFall = 0
    }
  } else {
    currentFall += 0.1
  }
  cube.position.y -= currentFall
}

processMovement = () => {
  if(directions.forward && currentSpeed < maxSpeed){
    currentSpeed += 0.002
  }
  if(directions.back && currentSpeed > -maxSpeed){
    currentSpeed -= 0.002
  }
  if(directions.left && currentTurn < maxTurn){
    currentTurn += 0.002
  }
  if(directions.right && currentTurn > -maxTurn){
    currentTurn -= 0.002
  }
  if(!directions.right && !directions.left){
    if(Math.abs(currentTurn) > 0.03){
      currentTurn -= (0.002 * (currentTurn/Math.abs(currentTurn))) 
    } else {
      currentTurn = 0
    }
  } 
  if(!directions.forward && !directions.back){
    if(Math.abs(currentSpeed) > 0.003){
      currentSpeed -= (0.002 * (currentSpeed/Math.abs(currentSpeed))) 
    } else {
      currentSpeed = 0
    }
  } 
  cube.translateZ(currentSpeed)
  cube.rotateY(currentTurn)
}

var animate = function () {
  requestAnimationFrame( animate );
  processMovement()
  checkGround()
  renderer.render( scene, camera );
};

setupScene();