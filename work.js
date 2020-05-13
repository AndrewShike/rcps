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

var scale = 1;

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
                                                      app.renderer.capabilities.getMaxAnisotropy());
                let material = new app.THREE.MeshBasicMaterial( { color: 0xffffff, map: texture } );
                let geometry = new app.THREE.BoxGeometry(scale, (image.height / image.width) * scale, 0.001);
                
                imgload({
                    obj: new app.THREE.Mesh( geometry, material ), 
                    geo: geometry, 
                    mat: material, 
                    img: image 
                });
            } );
    }
    
    for(let k in work_data) {
        this[k] = work_data[k];
    }
    
    this.x = 0;
    this.y = 0;
    
    var wrk = this;
    this.grp = new app.THREE.Group();
    
    if(this.image) {
        addImage(this.image, function(img) {
            
            wrk.img = img
            
            img.mat.transparent = true;
            wrk.grp.add(img.obj);
            
            img.obj.selected = function(sel) { wrk.selected(sel); }

            let div = 10;
            
            //img.mat.opacity = 0;
            
            wrk.onload();
        });
    }
}

Work.prototype.onload = function() {
    
}

Work.prototype.selected = function(sel) {
    console.log("selected proto: " + sel);
}

export function Cover(app, work_data, onload) {
    Work.call(this, app, work_data, onload);
    
    var me = this;
    
    if(this.covertxt) {
        
        let loader = new app.THREE.FontLoader();
        let txtmat = new app.THREE.MeshBasicMaterial( {color: 0xff0000 });
                    
        loader.load('./three/examples/fonts/helvetiker_regular.typeface.json', function ( font ) {
            
            
//            var txtgeo = new app.THREE.TextGeometry( "Justin\nSchmitz", {
            var txtgeo = new app.THREE.TextGeometry( me.covertxt, {
                font: font,
                size: 0.2,
                height: 0.01,
                curveSegments: 12
            } );
            txtgeo.center();
            
            me.covtxt = {
                obj: new app.THREE.Mesh( txtgeo, txtmat ),
                geo: txtgeo, 
                mat: txtmat
            }
            
            me.covtxt.mat.transparent = true;
            me.covtxt.mat.opacity = 0;
            me.covtxt.obj.position.z = 0.1;
            
            me.covtxt.obj.selected = function(sel) { me.selected(sel); }

            me.grp.add( me.covtxt.obj );
        } );
    }
}

Cover.prototype = Object.create(Work.prototype);
Cover.prototype.constructor = Cover;

Cover.prototype.selected = function(sel) {
    console.log("selected: " + sel);
    
    if(true) {
        if(sel) {
            this.img.mat.opacity = 0;
            this.covtxt.mat.opacity = 1;
        } else {
            this.img.mat.opacity = 1;
            this.covtxt.mat.opacity = 0;
        }
    }
}
