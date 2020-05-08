// obj - your object (THREE.Object3D or derived)
// point - the point of rotation (THREE.Vector3)
// axis - the axis of rotation (normalized THREE.Vector3)
// theta - radian value of rotation
// pointIsWorld - boolean indicating the point is in world coordinates (default = false)
function rotateAboutPoint(obj, point, axis, theta, pointIsWorld) {
    pointIsWorld = (pointIsWorld === undefined)? false : pointIsWorld;

    if(pointIsWorld){
        obj.parent.localToWorld(obj.position); // compensate for world coordinate
    }

    obj.position.sub(point); // remove the offset
    obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
    obj.position.add(point); // re-add the offset

    if(pointIsWorld){
        obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
    }

    obj.rotateOnAxis(axis, theta); // rotate the OBJECT
}

var scale = 0.5;

export function Work(app, work_data, onload) {
    
    this.onload = onload;
    
    function addImage(url, imgload) {
        new app.THREE.ImageLoader()
            .setCrossOrigin( '*' )
            .load( url + '?' + performance.now(), function ( image ) {

                let texture = new app.THREE.CanvasTexture(image, 
                                                      app.THREE.UVMapping, 
                                                      app.THREE.ClampToEdgeWrapping, 
                                                      app.THREE.ClampToEdgeWrapping,
                                                      app.THREE.LinearFilter,
                                                      app.THREE.LinearMipmapLinearFilter,
                                                      app.THREE.RGBAFormat,
                                                      app.THREE.UnsignedByteType,
                                                      app.renderer.getMaxAnisotropy());
                let material = new app.THREE.MeshBasicMaterial( { color: 0xffffff, map: texture } );
                let geometry = new app.THREE.BoxGeometry(scale, (image.height / image.width) * scale, 0.001);

                imgload(new app.THREE.Mesh( geometry, material ), image);
            } );
    }
    
    for(let k in work_data) {
        this[k] = work_data[k];
    }
    
    this.x = 0;
    this.y = 0;
    
    var wrk = this;
    
    if(this.image) {
        addImage(this.image, function(obj, image) {
            wrk.obj = obj;

            app.scene.add( wrk.obj );
            wrk.obj.position.z = -5;

            let div = 10;
            
            wrk.onload();
        });
    }
}

/*

var area = [
    {
        offset: {
            x: (Math.PI/-2),
            y: 0,
            z: 1
        },
        size: {
            x: Math.PI / 3.5,
            y: 1.3,
            z: 0.25
        }
    },
    {
        offset: {
            x: (Math.PI/-2),
            y: 0,
            z: 0
        },
        size: {
            x: Math.PI,
            y: Math.PI,
            z: 1
        }
    }
]

Work.prototype.move = function(app, x, y, z) {
//    if(app.mobile) {
//        rotateAboutPoint(this.obj, new app.THREE.Vector3( 0, 0, 0 ), new app.THREE.Vector3( 0, 1, 0 ), (Math.PI / 1), false);
//
//    } else {
//        rotateAboutPoint(this.obj, new app.THREE.Vector3( 0, 0, 0 ), new app.THREE.Vector3( 0, 1, 0 ), (Math.PI/-2), false);
//    }
    
    let i = Number(app.mobile);
    var xr = area[i].offset.x - x * area[i].size.x;
    var yr = area[i].offset.y + y * area[i].size.y;
    var zr = area[i].offset.z + z * area[i].size.z;
    
    rotateAboutPoint(this.obj, new app.THREE.Vector3( 0, 0, 0 ), new app.THREE.Vector3( 0, 1, 0 ), xr, false);
    this.obj.position.y = yr;
    this.obj.position.multiplyScalar(zr);
}
*/

Work.prototype.onload = function() {};