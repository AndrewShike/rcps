import { Work } from "./work.js";

export var homescreen = {}

var R = 3; 
var phi = (Math.sqrt(5)+1)/2 - 1; // golden ratio
var ga = phi*2*Math.PI;           // golden angle
var nbrPoints = 100;

var sphereVects = [];

function initSphere(app, dir) {
  var geometry = new app.THREE.SphereGeometry( 0.01, 32, 32 );
  var material = new app.THREE.MeshBasicMaterial( {color: 0x000000} );
    
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
}

homescreen.init = function(app) {
    
    //app.data.artists = { "Justin Schmitz": app.data.artists["Justin Schmitz"] };
    
    var n = 0;
    for(let k in app.data.artists) {
        let v = app.data.artists[k];
        let cov_url = "./work/" + k.replace(/\s+/g, '') + "/" + v.cover
        let i = n;
        
        v.cover = new Work(app, { image: cov_url, hover: k }, function() {
            this.obj.position.copy(sphereVects[nbrPoints - i]);
            this.obj.lookAt(0,0,0);
        });
        
        n++;
    }
    /*
    var geometry = new app.THREE.SphereGeometry( 0.01, 32, 32 );
    var material = new app.THREE.MeshBasicMaterial( {color: 0x000000} );
    var sphere = new app.THREE.Mesh( geometry, material );
    sphere.position.x = 5;
    app.scene.add( sphere );
    */
    
    initSphere(app, new app.THREE.Vector3(0,0,0));
}