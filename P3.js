/**
Ejemplo extraido de Learning ThreeJs de Jos Kirsten
*/
var ruedas = [];
var scene, renderer, camera;
var controls;
var cube,ladoCabina,detrasCabina,cabina;
var brazo1, brazo2, cucharon;
const radio = 3;         // Radio de la rueda
var chasis,superestructura;
const FACTOR_Z = 1.5;
function init() {
  // create a scene, that will hold all our elements such as objects, cameras and lights.
   scene = new THREE.Scene();

  // create a camera, which defines where we're looking at.
   camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

  // create a render and configure it with shadows
   renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0x000000));
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.shadowMap.enabled = true;
  var axes = new THREE.AxesHelper(20);
    scene.add(axes);
    chasis = new THREE.Object3D();
    scene.add(chasis);
    const loader = new THREE.TextureLoader();
    const texturaRueda = loader.load('./neumatico.jpg');



    const ancho = 2;         // Ancho de la rueda
    const segmentosRadiales = 32;

    // 1. Crear la Geometría
    const geometriaRueda = new THREE.CylinderGeometry(
        radio,
        radio,
        ancho,
        segmentosRadiales
    );

    // Rotar la geometría para que el eje X sea el eje de la rueda (para rodar sobre el plano XZ)
    geometriaRueda.rotateX(Math.PI / 2);

    // 2. Crear el Material
    // const materialRueda = new THREE.MeshLambertMaterial({
    //     // color: 0x555555 // Gris oscuro
    //     map: texturaRueda
        
    // });
    // Material para el lateral (sin textura, color gris oscuro)
const materialLateral = new THREE.MeshLambertMaterial({ color: 0x222222 });

// Material para las tapas (con textura)
const materialTapa = new THREE.MeshLambertMaterial({ map: texturaRueda });

// Creamos un array con el orden: [lateral, superior, inferior]
const materialesRueda = [materialLateral, materialTapa, materialTapa];

    // 3. Crear el Mesh

    rueda1 = new THREE.Mesh(geometriaRueda, materialesRueda);
    rueda1.position.set(-15, radio, -FACTOR_Z); // Posicionarla en X=-15, y levantada por su radio (Y=3)
    rueda1.castShadow = true;
    chasis.add(rueda1);
    rueda2 = new THREE.Mesh(geometriaRueda, materialesRueda);
    rueda2.position.set(-15, radio, 10+FACTOR_Z); // Posicionarla en X=-15, y levantada por su radio (Y=3)
    rueda2.castShadow = true;
    chasis.add(rueda2);

    rueda3 = new THREE.Mesh(geometriaRueda, materialesRueda);
    rueda3.position.set(-30, radio, 10+FACTOR_Z); // Posicionarla en X=-15, y levantada por su radio (Y=3)
    rueda3.castShadow = true;
    chasis.add(rueda3);
    
    rueda4 = new THREE.Mesh(geometriaRueda, materialesRueda);
    rueda4.position.set(-30, radio, -FACTOR_Z); // Posicionarla en X=-15, y levantada por su radio (Y=3)
    rueda4.castShadow = true;
    chasis.add(rueda4);
    ruedas.push(rueda1, rueda2, rueda3, rueda4);

    
  const BASE_CENTER_X = -23;
    const BASE_CENTER_Y = 6; // Posición de la base
    const BASE_CENTER_Z = 5;


// create a cube2 es la base sobre las ruedas
  var baseGeometry = new THREE.BoxGeometry(15, 1, 9);
  var baseMaterial = new THREE.MeshLambertMaterial({
    color: 0x9E9E9E
  });
  base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.castShadow = true;

  // position the cube
  base.position.x = BASE_CENTER_X;
  base.position.y = BASE_CENTER_Y;
  base.position.z = BASE_CENTER_Z;
  chasis.add(base);
  base.scale.z = FACTOR_Z;

  superestructura = new THREE.Object3D();
  const PIVOT_Y = BASE_CENTER_Y + 0.5; // La base tiene 1 de alto (6 a 7), así que el pivote debe estar en 6.5
  superestructura.position.set(BASE_CENTER_X, PIVOT_Y, BASE_CENTER_Z);
  chasis.add(superestructura); // La superestructura es hija del chasis
  superestructura.scale.z = FACTOR_Z;

  // create a cube que es lo de detras de la cabina
  var detrasCabinaGeometry = new THREE.BoxGeometry(10, 7, 12);
  // var detrasCabinaMaterial = new THREE.MeshLambertMaterial({
  //   color: 0xFFFF00
  // });
  var detrasCabinaMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xFFFF00,   // amarillo
    metalness: 0.1,    // un metal ligero
    roughness: 0.8,    // superficie un poco rugosa, no muy reflectante

});
   detrasCabina = new THREE.Mesh(detrasCabinaGeometry, detrasCabinaMaterial);
  detrasCabina.castShadow = true;

  // position the cube
  detrasCabina.position.x = -5;
  detrasCabina.position.y = 3.5;
  detrasCabina.position.z = 0;

  superestructura.add(detrasCabina);
  let ladoCabinaGeometry  = new THREE.BoxGeometry(9, 7, 4);

// Convertir el cubo en cuña (estrecha a la DERECHA)
for (let i = 0; i < ladoCabinaGeometry .vertices.length; i++) {
  let v =ladoCabinaGeometry .vertices[i];
  if (v.x > 0 && v.y > 0) {
    v.y = 0;
  }
}//lo que hace es modificar los vertices de la derecha para que haga forma de cuña

ladoCabinaGeometry .computeVertexNormals();

let ladoCabinaMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFF00 });
ladoCabina = new THREE.Mesh(ladoCabinaGeometry , ladoCabinaMaterial);
ladoCabina.castShadow = true;
ladoCabina.position.set(4.5, 3.5, 4);
superestructura.add(ladoCabina);


  // cabina
    var cabinaGeometry = new THREE.BoxGeometry(9, 12, 6);
  // var cabinaMaterial = new THREE.MeshLambertMaterial({
  //   color: 0x00000FF
  // });
  var cabinaMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x88ccee,       // color base, un azul clarito funciona bien
    metalness: 0,          // no metálico
    roughness: 0.5,        // poca rugosidad para que brille
    opacity: 0.8,          // transparente
    transparent: true,     // habilita transparencia
    reflectivity: 0.3,     // reflectividad para simular cristal
});
   cabina = new THREE.Mesh(cabinaGeometry, cabinaMaterial);
  cabina.castShadow = true;

  // position the cube
  cabina.position.x = 4.5;
  cabina.position.y = 6;
  cabina.position.z = -3;
  superestructura.add(cabina);

  brazo1 = new THREE.Object3D(); 
  superestructura.add(brazo1);
  brazo1.position.set(4, 0, 1);
  
  


  const brazo1_largo = 4;
  const brazo1_alto = 15;
  const brazo1_ancho = 2;

  var brazo1Geometry = new THREE.BoxGeometry(brazo1_largo, brazo1_alto, brazo1_ancho);
  var brazo1Material = new THREE.MeshLambertMaterial({color: 0xFFFF00});
  var brazo1_mesh = new THREE.Mesh(brazo1Geometry, brazo1Material);
  brazo1_mesh.castShadow = true;
  brazo1_mesh.position.set(0, brazo1_alto / 2, 0); 
  brazo1.add(brazo1_mesh); 




brazo2 = new THREE.Object3D();
brazo1.add(brazo2);

brazo2.position.set(0,brazo1_alto,0 );

const brazo2_largo = 18;
const brazo2_alto = 3;
const brazo2_ancho = 2;

var brazo2Geometry = new THREE.BoxGeometry(brazo2_largo, brazo2_alto, brazo2_ancho);
var brazo2Material = new THREE.MeshLambertMaterial({ color: 0xFFff00 });
var brazo2_mesh = new THREE.Mesh(brazo2Geometry, brazo2Material);
brazo2_mesh.castShadow = true;

// Centramos el brazo2 respecto a su pivote para que la base esté en el pivote
brazo2_mesh.position.set(brazo2_largo/2-brazo1_ancho, 0, 0);

brazo2.add(brazo2_mesh);



cucharon = new THREE.Object3D();
brazo2.add(cucharon);
cucharon.position.set(brazo2_largo, 0, 0); // ajustar según orientación de brazo2


// Dimensiones de la cuchara
var largoC = 5;
var altoC = 2;
var anchoC = 6;

// Crear geometría base
var cucharonGeometry = new THREE.BoxGeometry(largoC, altoC, anchoC); // largo, alto, ancho

// Hacemos la parte superior más estrecha
for (let i = 0; i < cucharonGeometry.vertices.length; i++) {
    let v = cucharonGeometry.vertices[i];
    if (v.y > 0) {       // vertices superiores
        v.z *= 0.5;      // estrechamos en el eje Z
        v.x *= 0.8;      // opcional: estrechamos en X
    }
}

// Recalcular normales para iluminación correcta
cucharonGeometry.computeVertexNormals();
// Crear material
var cucharonMaterial = new THREE.MeshLambertMaterial({ color: 0xAAAA00 });
// Crear el mesh
cucharon = new THREE.Mesh(cucharonGeometry, cucharonMaterial);
cucharon.castShadow = true;
// Posicionar la cuchara en la punta del brazo2
cucharon.position.set(brazo2_largo, 0, 0); // ajustar según orientación del brazo
// Añadir al Object3D brazo2
brazo2.add(cucharon);


  // create the ground plane
  var planeGeometry = new THREE.PlaneGeometry(80, 40);
  var planeMaterial = new THREE.MeshLambertMaterial({
    color: 0xAAAAAA
  });
  var plane = new THREE.Mesh(planeGeometry, planeMaterial);

  // rotate and position the plane
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.set(0, 0, 0);
  plane.receiveShadow = true;


  scene.add(plane);

  camera.position.set(0, 30, 50);
  camera.lookAt(scene.position);

  // add spotlight for the shadows
  var spotLight = new THREE.SpotLight(0xFFFFFF);
  spotLight.position.set(-40, 40, 45);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
  spotLight.shadow.camera.far = 130;
  spotLight.shadow.camera.near = 40;

  // If you want a more detailled shadow you can increase the 
  // mapSize used to draw the shadows.
  // spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
  scene.add(spotLight);

  var ambienLight = new THREE.AmbientLight(0x353535);
  scene.add(ambienLight);

  // add the output of the renderer to the html element
  document.getElementById("contenedor").appendChild(renderer.domElement);
  window.addEventListener('keydown', handleKeyDown, false);
  createControls();

  // call the render function
  renderer.render(scene, camera);
}

function animate() {

   requestAnimationFrame( animate );
   controls.update();
   render();

 }
function createControls() {

        controls = new THREE.TrackballControls( camera, renderer.domElement );

        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;

        controls.keys = [ 65, 83, 68 ];

     }
     function render() {
    renderer.render(scene, camera);
}
function girarRuedas(distancia) {
    const radio = 3; // mismo radio que usaste al crear la rueda
    const rotacion = distancia / radio;
    ruedas.forEach(rueda => {
        rueda.rotation.z -= rotacion;
    });
}
function handleKeyDown(event) {
    var moveSpeed = 1; // Distancia que se moverá el cubo por pulsación
    var rotateSpeed = 0.05;
    let brazo1RotacionMax = -0.05; 
    let brazo1RotacionMin = -0.85;// en radianes
    let brazo2RotacionMax = 0.9; 
    let brazo2RotacionMin = -0.9; 


    // Obtener el código de la tecla presionada
    var keyCode = event.keyCode;

    // 37 es la flecha izquierda, 39 es la flecha derecha
    if (keyCode === 37) {
        // Flecha Izquierda: Disminuir posición X
        chasis.position.x-=moveSpeed;
        girarRuedas(-moveSpeed);

    } else if (keyCode === 39) {
        // Flecha Derecha: Aumentar posición X
        chasis.position.x += moveSpeed;
        girarRuedas(moveSpeed);
    }
    else if (keyCode === 40) {
        // Flecha Derecha: Aumentar posición X
        chasis.position.z += moveSpeed;
    }
    else if (keyCode === 38) {
        // Flecha Derecha: Aumentar posición X
        chasis.position.z -= moveSpeed;
    }
    else if (keyCode === 81) { // Tecla Q (Rotar a la izquierda, aumenta Y)
        superestructura.rotation.y += rotateSpeed; 
    } else if (keyCode === 69) { // Tecla E (Rotar a la derecha, disminuye Y)
        superestructura.rotation.y -= rotateSpeed; 
    }else if (keyCode === 74) { // Tecla J
    // Solo rotar si no hemos llegado al límite
      if (brazo1.rotation.z < brazo1RotacionMax) {
          brazo1.rotation.z += 0.05; // velocidad de rotación
      }
    }else if (keyCode === 75) { // Tecla K
      if (brazo1.rotation.z > brazo1RotacionMin) {
        brazo1.rotation.z -= 0.05;
      }
    }else if (keyCode === 76) { // Tecla L (para rotar Brazo 2 hacia arriba/atrás)
        if (brazo2.rotation.z < brazo2RotacionMax) {
            brazo2.rotation.z += rotateSpeed;
        }
    console.log(brazo2.rotation.z);

            // brazo2.rotation.z += rotateSpeed;

    }else if (keyCode === 192) { // Tecla Ñ (código 192 en muchos teclados, es la tecla junto al Enter o P)
        if (brazo2.rotation.z > brazo2RotacionMin) {
            brazo2.rotation.z -= rotateSpeed;
        }
            // brazo2.rotation.z -= rotateSpeed;

    }// Tecla U (Rotar cuchara hacia adentro / recoger)
    else if (keyCode === 85) { 
        if (cucharon.rotation.z < cucharonRotacionMax) {
            cucharon.rotation.z += rotateSpeed;
        }
    } 
    // Tecla I (Rotar cuchara hacia afuera / soltar)
    else if (keyCode === 73) { 
        if (cucharon.rotation.z > cucharonRotacionMin) {
            cucharon.rotation.z -= rotateSpeed;
        }
    }


    // Opcional: Esto evita que la página se desplace si se pulsan las flechas
    // event.preventDefault(); 
}
