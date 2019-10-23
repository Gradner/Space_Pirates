var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.1, 1000 );
let loader = new THREE.OBJLoader();
let cameraBall = new THREE.Object3D();
scene.add(cameraBall)

let up = new THREE.Vector3(0, 1, 0)
let down = new THREE.Vector3(0, -1, 0)
let forward = new THREE.Vector3(0, 0, 1)
let back = new THREE.Vector3(0, 0, -1)
let left = new THREE.Vector3(1, 0, 0)
let right = new THREE.Vector3(-1, 0, 0)

const Color = {
  GROUND: new THREE.Color( 0x606060 ).convertGammaToLinear( 2.2 ).getHex(),
  NAVMESH: new THREE.Color( 0xFFFFFF ).convertGammaToLinear( 2.2 ).getHex(),
};

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let arrow;
let cube;
let ground;
let directions = {
  forward: false,
  back: false,
  left: false,
  right: false
}
let rc = new THREE.Raycaster()
let collisions = {
  forward: false,
  back: false,
  left: false,
  right: false
}
let canJump = false;
let jumping = false;

let maxSpeed = 0.05
let maxTurn = 0.05
let maxFall = 1
let maxJump = -0.12

let currentSpeed = 0
let currentTurn = 0
let currentFall = 0
let latTranslate = 0

let onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

let onKeyDown = (e) => {
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
    case 32:
      if(canJump && currentFall === 0){
        jumping = true;
      }
  }
}

let onKeyUp = (e) => {
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
  var cubeGeo = new THREE.CylinderGeometry( 0.5, 0.5, 1, 8 );
  var cubeMat = new THREE.MeshBasicMaterial( { color: 0x00ff00, side: THREE.FrontSide } );
  cube = new THREE.Mesh( cubeGeo, cubeMat );
  scene.add( cube );
  cube.position.y = 20

  arrow = new THREE.ArrowHelper(cube.rotation, cube.position, 3, 0x00ff00)
  scene.add(arrow)

  const ambient = new THREE.AmbientLight( 0x101030 );
  scene.add( ambient );

  let sun = new THREE.PointLight(0xff0000, 1, 100)
  sun.position.set(0, 50, 0)
  scene.add(sun)

  camera.position.z = -3;
  camera.position.y = 2;
  cameraBall.add(camera)

  window.addEventListener( 'resize', onWindowResize, false );
  window.addEventListener( 'keydown', onKeyDown);
  window.addEventListener( 'keyup', onKeyUp);
  loader.load('./js/level.obj', (obj)=>{
    let groundMat = new THREE.MeshBasicMaterial( { color: Color.GROUND, side: THREE.FrontSide } )
    ground = obj
    ground.material = groundMat
    ground.name = "SceneMesh"
    scene.add(ground)
    animate();
  }, (xhr)=>{
    console.log(`${xhr.loaded/xhr.total * 100}% loading...`)
  }, (err)=>{
    console.log(err)
  })
  
}

checkGround = () => {
  rc.set(cube.position, down)
  let intersects = rc.intersectObject(ground, true)
  if(intersects.length > 0){
    if(jumping){
      if(currentFall > maxJump){
        currentFall -= 0.02
      } else {
        jumping = false;
      }
    } else {
      if(intersects[0].distance.toFixed(3) > 0.500){
        if(intersects[0].distance.toFixed(3) < currentFall){
          cube.position.y = (intersects[0].distance + 0.5)
        } else {
          if(currentFall < maxFall){
            currentFall += 0.01
          }
        }
      } else {
        cube.position.y += (0.5 - intersects[0].distance)
        currentFall = 0
        canJump = true;
      }
    } 
  } else {
    if(jumping){
      if(currentFall > maxJump){
        currentFall -= 0.02
      } else {
        jumping = false;
      }
    } else if(currentFall < maxFall){
      currentFall += 0.01
    }
  }
  
}

checkRoof = () => {
  rc.set(cube.position, up)
  let intersects = rc.intersectObject(ground, true)
  if(intersects.length > 0){
    if(intersects[0].distance.toFixed(3) > 0.500){
      if(intersects[0].distance.toFixed(3) < -currentFall){
        cube.position.y = (intersects[0].distance - 0.5)
        currentFall = 0
        jumping = false;
      }
    } else {
      if(currentFall <= 0){
        cube.position.y -= (0.5 - intersects[0].distance)
        currentFall = 0
        jumping = false;
      }
    }
  }  
}

checkLat = () => {
  forward.set(0, 0, 1)
  back.set(0, 0, -1)
  left.set(1, 0, 0)
  right.set(-1, 0, 0)
  let direction = forward.transformDirection(cube.matrix).normalize()
  if(currentSpeed > 0){
    rc.set(cube.position, direction, 0, 1)
    let fInt = rc.intersectObject(ground, true)
    if(fInt.length > 0){
      if(fInt[0].distance.toFixed(3) < 0.500){
        let normal = fInt[0].face.normal
        let slope = direction.projectOnPlane(normal)
        let cubeSlope = slope.clone().applyQuaternion(cube.quaternion)
        console.log(cubeSlope)
        arrow.setDirection(slope)
        rc.set(cube.position, slope)
        let dirInt = rc.intersectObject(ground, true)
        if(dirInt.length > 0){
          if(dirInt[0].distance.toFixed(3) < 0.500){
            console.log('not moving because requested direction is blocked')
            console.log(dirInt[0])
          } else {
            if(slope.z > 0){
              rc.set(cube.position, slope)
              let fOk = rc.intersectObject(ground, true)
              if(fOk.length > 0){
                if(fOk[0].distance.toFixed(3) < 0.500){
                  console.log(fOk[0])
                }
              } else {
                cube.translateZ(cubeSlope.z * currentSpeed)
                cube.translateX(cubeSlope.x * currentSpeed)
              }
            } else {
              cube.translateZ(cubeSlope.z * currentSpeed)
              cube.translateX(cubeSlope.x * currentSpeed)
            }
          }
        } else {
          cube.translateZ(cubeSlope.z * currentSpeed)
          cube.translateX(cubeSlope.x * currentSpeed)
        }
      }
      else {
        moveZ()
      }
    } else {
      moveZ()
    }
  } else {
    rc.set(cube.position, back.applyQuaternion(cube.quaternion))
    let bInt = rc.intersectObject(ground, true)
    if(bInt.length > 0){
      if(bInt[0].distance.toFixed(3) < 0.500){
        let normal = bInt[0].face.normal
        let slope = forward.applyQuaternion(cube.quaternion).projectOnPlane(normal)
        arrow.setDirection(slope)
        rc.set(cube.position, slope)
        let dirInt = rc.intersectObject(ground, true)
        if(dirInt.length > 0){
          if(dirInt[0].distance.toFixed(3) < 0.500){
            console.log('not moving because requested direction is blocked')
          } else {
            if(slope.z > 0){
              rc.set(cube.position, slope)
              let bOk = rc.intersectObject(ground, true)
              if(bOk.length > 0){
                if(bOk[0].distance.toFixed(3) < 0.500){
                  cube.distance.z
                } else {
                  cube.translateZ(slope.z * currentSpeed)
                  cube.translateX(slope.x * currentSpeed)
                }
              } else {
                cube.translateZ(slope.z * currentSpeed)
                cube.translateX(slope.x * currentSpeed)
              }
            } else {
              cube.translateZ(slope.z * currentSpeed)
              cube.translateX(slope.x * currentSpeed)
            }
          }
        } else {
          cube.translateZ(slope.z * currentSpeed)
          cube.translateX(slope.x * currentSpeed)
        }
      }
      else {
        moveZ()
      }
    } else {
      moveZ()
    }
  }
}

moveZ = () => {
  if(directions.forward && currentSpeed < maxSpeed){
    currentSpeed += 0.002
  }
  if(directions.back && currentSpeed > -maxSpeed){
    currentSpeed -= 0.002
  }
  if(!directions.forward && !directions.back){
    if(Math.abs(currentSpeed) > 0.003){
      currentSpeed -= (0.003 * (currentSpeed/Math.abs(currentSpeed))) 
    } else {
      currentSpeed = 0
    }
  }
  cube.translateZ(currentSpeed)
}

processTurn = () => {
  if(directions.left && currentTurn < maxTurn){
    if(currentTurn < 0){
      currentTurn = 0
    }
    currentTurn += 0.002
  }
  if(directions.right && currentTurn > -maxTurn){
    if(currentTurn > 0){
      currentTurn = 0
    }
    currentTurn -= 0.002
  }
  if(!directions.right && !directions.left){
    if(Math.abs(currentTurn) > 0.03){
      currentTurn -= (0.002 * (currentTurn/Math.abs(currentTurn))) 
    } else {
      currentTurn = 0
    }
  }
}

oldForward = () => {
  
}

processMovement = () => { 
  cube.rotateY(currentTurn)
  cube.position.y -= currentFall
}

var animate = function () {
  requestAnimationFrame( animate );
  processTurn()
  processMovement()
  checkLat()
  checkRoof()
  checkGround()
  arrow.position.copy(cube.position)
  cameraBall.position.x = cube.position.x
  cameraBall.position.y = cube.position.y
  cameraBall.position.z = cube.position.z
  cameraBall.rotation.x = cube.rotation.x
  cameraBall.rotation.y = cube.rotation.y
  cameraBall.rotation.z = cube.rotation.z
  camera.lookAt(cameraBall.position.x, cameraBall.position.y, cameraBall.position.z)
  renderer.render( scene, camera );
};

setupScene();