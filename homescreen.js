import { Cover } from "./work.js";

var isomap = [
    19,
    3,
    5,
    17,
    34,
    21,
    20,
    1,
    7,
    16,
    18,
    31,
    32,
    36,
    22,
    41,
    4,
    0,
    15,
    24,
    35,
    33,
    8,
    6,
    2,
    12,
    23,
    38,
    37,
    30,
    10,
    9,
    14,
    30,
    27,
    25,
    13,
    11,
    28,
    40,
    26
];

export var homescreen = {}

var R = 3; 
var phi = (Math.sqrt(5)+1)/2 - 1; // golden ratio
var ga = phi*2*Math.PI;           // golden angle
var nbrPoints = 100;

function initSphere(app, dir) {
  var geometry = new app.THREE.SphereGeometry( 0.01, 32, 32 );
  var material = new app.THREE.MeshBasicMaterial( {color: 0x000000} );
    
  var sphereVects = [];
    
  for (let i = 1; i < nbrPoints + 1; i++) {
    let lon = ga*i;
    lon /= 2*Math.PI; 
    lon -= Math.floor(lon); 
    lon *= 2*Math.PI;
    if (lon > Math.PI)  lon -= 2*Math.PI;
 
    // Convert dome height (which is proportional to surface area) to latitude
    let lat = Math.asin(-1 + 2*i/nbrPoints);
    /*
    let s = new app.THREE.Mesh( geometry, material );
    app.scene.add( s );

    s.position.x = R;
    s.position.applyAxisAngle(new app.THREE.Vector3(0,1,0), lat);
    s.position.applyAxisAngle(new app.THREE.Vector3(0,0,1), lon);
    */
      
      
    sphereVects[i] = new app.THREE.Vector3(R,0,0);
    sphereVects[i].applyAxisAngle(new app.THREE.Vector3(0,1,0), lat);
    sphereVects[i].applyAxisAngle(new app.THREE.Vector3(0,0,1), lon);
  }
    
  return sphereVects;
}


function placeSphere(sphereVects, app, i) {
    return function() {
        app.scene.add( this.grp );
        this.grp.position.z = -5;

        this.grp.position.copy(sphereVects[nbrPoints - i]);
        this.grp.lookAt(0,0,0);
    }
}

var geometry;

function initIso(app, dir) {
    geometry = new app.THREE.IcosahedronGeometry(R, 1);
    var material = new app.THREE.MeshBasicMaterial( {color: 0x000000, wireframe: true} );
    var sphere = new app.THREE.Mesh( geometry, material );
    
    homescreen.group = new app.THREE.Group();
    
    app.scene.add( sphere );

    app.scene.add( homescreen.group );
    
    homescreen.group.lookAt(dir);
    
    return geometry.vertices;
}

function placeIso(sphereVects, app, i) {
    return function() {
        homescreen.group.add( this.grp );

        this.grp.position.copy(geometry.vertices[isomap[i]]);
        this.grp.position.multiplyScalar(0.9);
        
        this.grp.lookAt(0,0,0);
    }
}

homescreen.works = [];
//homescreen.objs = [];

homescreen.init = function(app) {
    
    //app.data.artists = { "Justin Schmitz": app.data.artists["Justin Schmitz"] };
    
    var sphereVects = initIso(app, new app.THREE.Vector3(0,0,-1));
    
    var n = 0;
    
    for(let k in app.data.artists) {
        let v = app.data.artists[k];
        let cov_url = v.dir + v.cover
        let i = n;
        
        this.works[k] = new Cover(app, { image: cov_url, covertxt: v.name }, placeIso(sphereVects, app, i));
        
        n++;
    }

}