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



export function Work(app, dir, work_data, onload) {
    
    var scale = app.mobile ? 0.9 : 0.9;
    var limitx = (app.mobile ? 1.2 : 1.4) * scale;
    var limity = (app.mobile ? 1.5 : 1.35) * scale;
    
    this.dim_tween = { stop: function() {} }
    
    this.onload = onload;
    
    function addImage(url, imgload) {
        new app.THREE.ImageLoader()
            .setCrossOrigin( '*' )
            .load( url + '?' + performance.now(), function ( image ) {
            
//                console.log(url);

                let texture = new app.THREE.CanvasTexture(image, 
                                                      app.THREE.UVMapping, 
                                                      app.THREE.ClampToEdgeWrapping, 
                                                      app.THREE.ClampToEdgeWrapping,
                                                      app.THREE.LinearFilter,
                                                      app.THREE.LinearMipmapLinearFilter,
                                                      app.THREE.RGBAFormat,
                                                      app.THREE.UnsignedByteType,
                                                      app.renderer.capabilities.getMaxAnisotropy());
            
                let imge = {}
                imge.tall = false;
            
                imge.img = image;
                imge.dim = {
                    x: limitx,
                    y: (image.height / image.width) * limitx,
                    z: 0.01
                }
            
                if(imge.dim.y > limity) {
                    imge.dim.x *= limity / imge.dim.y;
                    imge.dim.y = limity;
                    imge.tall = true;
                }
            
                imge.mat = new app.THREE.MeshBasicMaterial( { color: 0xffffff, map: texture } );
                imge.geo = new app.THREE.BoxGeometry(imge.dim.x, imge.dim.y, imge.dim.z);
                imge.obj = new app.THREE.Mesh( imge.geo, imge.mat )
                
                imgload(imge);
            } );
    }
    
    for(let k in work_data) {
        this[k] = work_data[k];
    }
    
    this.x = 0;
    this.y = 0;
    
    var wrk = this;
    this.grp = new app.THREE.Group();
    
    
    if(this.file && this.type == "image") {
        
        app.loading.size++;
        
        addImage(dir + this.file, function(img) {
            
            wrk.img = img;
            
            wrk.main = img;
            wrk.raycastTarget = img;
            
            img.mat.transparent = true;
            wrk.grp.add(img.obj);
            
            img.obj.selected = function(sel) { wrk.selected(sel, app); }
            img.obj.click = function() { wrk.click(); }

            let div = 10;
            
            //img.mat.opacity = 0;
            wrk.main.opacity = 1;
            wrk.main.updateOpacity = function() {
                wrk.main.mat.opacity = wrk.main.opacity;
            }
            
            app.loading.update(1);
            wrk.onload();
        });
    } else if(this.type == "youtube" && this.code) {
        
        let iframe = app.css.makeYoutube(this.code, 0.0025);
        
        
//        console.log(iframe);
        
        wrk.iframe = iframe;
        wrk.main = iframe;
        wrk.grp.add(iframe.obj);
        
        let me = wrk;
        me.raycastTarget = {}
        me.raycastTarget.geo = new app.THREE.BoxGeometry(me.main.dim.x, me.main.dim.y, .001 );
        me.raycastTarget.mat = new app.THREE.MeshBasicMaterial(); 
        me.raycastTarget.mat.transparent = true;
        me.raycastTarget.mat.opacity = 0;
        me.raycastTarget.obj = new app.THREE.Mesh( me.raycastTarget.geo, me.raycastTarget.mat);
        me.raycastTarget.obj.z = -0.25;
        me.grp.add( me.raycastTarget.obj );
        
        me.raycastTarget.obj.selected = function(sel) { wrk.selected(sel, app); }
        me.raycastTarget.obj.click = function() { wrk.click(); }
        
        wrk.main.opacity = 1;
        wrk.main.updateOpacity = function() {
            wrk.main.div.style.opacity = wrk.main.opacity;
        }
        
        wrk.onload();
    } else if(this.type == "img" && this.file) {
        
        let dom = app.css.makeImg(dir + this.file, 0.0035);
        
        
//        console.log(iframe);
        
        wrk.dom = dom;
        wrk.main = dom;
        wrk.grp.add(dom.obj);
        
        let me = wrk;
        me.raycastTarget = {}
        me.raycastTarget.geo = new app.THREE.BoxGeometry(me.main.dim.x, me.main.dim.y, .001 );
        me.raycastTarget.mat = new app.THREE.MeshBasicMaterial(); 
        me.raycastTarget.mat.transparent = true;
        me.raycastTarget.mat.opacity = 0;
        me.raycastTarget.obj = new app.THREE.Mesh( me.raycastTarget.geo, me.raycastTarget.mat);
        me.raycastTarget.obj.z = -0.25;
        me.grp.add( me.raycastTarget.obj );
        
        me.raycastTarget.obj.selected = function(sel) { wrk.selected(sel, app); }
        me.raycastTarget.obj.click = function() { wrk.click(); }
        
        wrk.main.opacity = 1;
        wrk.main.updateOpacity = function() {
            wrk.main.div.style.opacity = wrk.main.opacity;
        }
        
        wrk.onload();
    }
}

Work.prototype.onload = function() {}
Work.prototype.selected = function(sel) {}
Work.prototype.click = function() {}

var color = 0xED3A43; //0x0060c9 // 0xED3A43

export function Cover(app, dir, work_data, covertxt, onload) {
    Work.call(this, app, dir, work_data, onload);
    
    var me = this;
    
    if(covertxt) {
        this.covertxt = covertxt;
        
        let loader = new app.THREE.FontLoader();
        let txtmat = new app.THREE.MeshBasicMaterial( {color: 0xED3A43 }); 
                    
        loader.load('./fonts/Space Mono_Italic.json', function ( font ) {
            
            me.covergrp = new app.THREE.Group();
            
            let size = 0.135;
            
//            var txtgeo = new app.THREE.TextGeometry( "Justin\nSchmitz", {
            var txtgeo = new app.THREE.TextGeometry( me.covertxt, {
                font: font,
                size: size,
                height: 0.01,
                curveSegments: 4
            } );
            txtgeo.center();
            
            let mtch = me.covertxt.match(/(\n)/g)
            let lines = mtch ? mtch.length + 1 : 1;
            
            me.covtxt = {
                obj: new app.THREE.Mesh( txtgeo, txtmat ),
                geo: txtgeo, 
                mat: txtmat,
                height: lines * size * 2
            }
            
            me.covtxt.mat.transparent = true;
            me.covtxt.mat.opacity = 0;
            me.covtxt.obj.position.z = 0.2;
            
//            me.covtxt.obj.selected = function(sel) { me.selected(sel); }

            me.grp.add( me.covtxt.obj );
            
            me.buttonbox = {}
            
            me.buttonbox.geo = new app.THREE.BoxBufferGeometry( .65, size + 0.01, .001 );
            me.buttonbox.edges = new app.THREE.EdgesGeometry( me.buttonbox.geo );
            me.buttonbox.mat = new app.THREE.LineBasicMaterial( { color: 0xED3A43, linewidth: 1 } ) 
            me.buttonbox.obj = new app.THREE.LineSegments( me.buttonbox.edges, me.buttonbox.mat);
            
            me.buttonbox.mat.transparent = true;
            me.buttonbox.mat.opacity = 0;
            me.buttonbox.obj.position.z = 0.2;
            me.buttonbox.obj.position.y = -me.covtxt.height/2 - 0.105
            
            me.grp.add( me.buttonbox.obj );
            
            
            me.buttontxt = {}
            me.buttontxt.geo = new app.THREE.TextGeometry( "enter →", { //→
                font: font,
                size: size * 0.75,
                height: 0.01,
                curveSegments: 12
            } );
            me.buttontxt.geo.center();
            
            me.buttontxt.obj = new app.THREE.Mesh( me.buttontxt.geo, txtmat );
            me.buttontxt.mat = txtmat;
            
            me.buttontxt.mat.transparent = true;
            me.buttontxt.mat.opacity = 0;
            me.buttontxt.obj.position.z = 0.2;
            me.buttontxt.obj.position.y = -me.covtxt.height/2 - 0.1
            
            me.grp.add( me.buttontxt.obj );
        } );
    }
}

Cover.prototype = Object.create(Work.prototype);
Cover.prototype.constructor = Cover;

Cover.prototype.selected = function(sel) {
    if(this.covtxt) {
        if(sel) {
            this.dim_tween.stop();
            
            this.main.opacity = 0;
            this.main.updateOpacity();
            this.covtxt.mat.opacity = 1;
            this.buttonbox.mat.opacity = 1;
            this.buttontxt.mat.opacity = 1;
        } else {
            this.main.opacity = 1;
            this.main.updateOpacity();
            this.covtxt.mat.opacity = 0;
            this.buttonbox.mat.opacity = 0;
            this.buttontxt.mat.opacity = 0;
        }
    }
}

export function Artwork(app, dir, work_data, onload) {
    var me = this;
    
    let imgl = function() {
        
        if((!app.mobile || me.type == "image") && me.type != "img") {
            me.borderbox = {}
            me.borderbox.geo = new app.THREE.BoxGeometry(me.main.dim.x + 0.03, me.main.dim.y + 0.03, .001 );
            me.borderbox.mat = new app.THREE.MeshBasicMaterial( { color: 0x0060C9 } ) 
            me.borderbox.obj = new app.THREE.Mesh( me.borderbox.geo, me.borderbox.mat);
            
            me.borderbox.mat.transparent = true;
            me.borderbox.mat.opacity = 0;
            me.borderbox.obj.position.z = -0.02;

            me.grp.add( me.borderbox.obj );
        }
        
        if(onload) onload.call(me);
    }
    
    Work.call(this, app, dir, work_data, imgl);
}

Artwork.prototype = Object.create(Work.prototype);
Artwork.prototype.constructor = Artwork;

Artwork.prototype.selected = function(sel, app) {
    
    
    if(this.borderbox) {
        console.log("artselect", sel);
        
        if(sel && !app.nav.zoomed) {
            this.borderbox.mat.opacity = 1;
        } else {
            this.borderbox.mat.opacity = 0;
        }
    }
}