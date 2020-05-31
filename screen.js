import { Cover, Artwork } from "./work.js";

var isomap = [19,3,5,17,34,21,20,1,7,16,18,31,32,36,22,41,4,0,15,24,35,33,8,6,2,12,23,38,37,30,10,9,14,30,27,25,13,11,28,40,26];

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

export var nav = {
    location: {},
    homescreen: {},
    zoomed: false,
    zoomindex: -1,
    infod: false
}

nav.title = function(app, zoomed, work) {
    if(zoomed) {
        $(".work-title").html(work.title);   
    }
}

nav.zoom = function(app, zoomed, work, artistscreen) {
    if(work) {
        work.selected(false);
    }
    
    $("#container").toggleClass("zoomed", zoomed);
    
    nav.title(app, zoomed, work);
    
    if(this.zoomed != zoomed) {
        if(this.location.type == "artistscreen") {
            app.controls.lock(app, zoomed);
            this.zoomindex = work ? work.index : -1;
            this.location.zoom(app, zoomed, this.zoomindex, 1000, 0);
            this.homescreen.lighten(app, zoomed ? 1 : 0.75, 1000);

            $(".arrows").toggleClass("visible", zoomed);
            $(".work-title").toggleClass("visible", zoomed);
            
            
            this.zoomed = zoomed;
        }
    }
}

nav.info = function(app, infod, name) {
    $("#info").toggleClass("visible", infod);
    $("#title").toggleClass("hidden", infod);
    $("#info-" + name).toggleClass("visible", infod);
    
    
    this.infod = infod
    $("#back").html(infod ? "<span class='left'>→</span> back" : name == "main" ? "info" : "<span class='left'>→</span> back");
}

nav.artistInfo = function(app, infod) {
    if(this.location.type == "artistscreen") {
        this.info(app, infod, this.location.name.replace(/\s+/g, '').replace(/(&amp;|&)/g, '').replace(/(\-)/g, '').replace(/(\n)/g, ''));
        
        $("#artist-info").toggleClass("visible", !infod);
    }
}

nav.inc = function(app, n) {
    if(this.location.type == "artistscreen" && this.zoomed) { 
        this.zoomindex += n;
        
        if(this.zoomindex == this.location.works.length) this.zoomindex = 0;
        if(this.zoomindex < 0) this.zoomindex = this.location.works.length - 1;
        
        this.location.zoom(app, true, this.zoomindex, 1000, 0);
        
        nav.title(app, true, this.location.works[this.zoomindex]);
    }
}

nav.enter = function(app, artistscreen, enter) {
    this.location = artistscreen;
    $("#back").html(enter ? "<span class='left'>→</span> back" : "info"); //←
    $("#artist-info").toggleClass("visible", enter);
    
    this.homescreen.dim(app, enter, 1000);
    this.homescreen.scoot(app, enter, 1000);
    artistscreen.dim(app, !enter, 300, enter ? 0 : 300);
    artistscreen.collapse(app, !enter, 1000, 0);
    artistscreen.center(app, enter, 5000, 0);
    this.homescreen.lighten(app, enter ? 0.75 : 0, 1000);
}

nav.back = function(app) {
    if(this.location.type == "artistscreen") {
        if(!this.infod) {
            if(!this.zoomed) {
                app.nav.enter(app, this.location, false);
                this.location = app.nav.homescreen;
            } else {
                this.zoom(app, false);
            }
        } else {
            nav.artistInfo(app, false);
        }
    } else {
        nav.info(app, !this.infod, "main");
    }
}

function Screen(app, dir, collapsed, dimmed, scooted, centered, addsphere, lightness) {
    
    function initIso(app, dir, me) {
        var geometry = new app.THREE.IcosahedronGeometry(R, 1);
        var material = new app.THREE.MeshBasicMaterial( {color: 0x000000, wireframe: true} );
        var sphere = new app.THREE.Mesh( geometry, material );
        
        me.group = new app.THREE.Group();

        if(addsphere) app.scene.add( sphere );

        app.scene.add( me.group );

        me.group.lookAt(dir);

        return {
            obj: sphere, 
            geo: geometry, 
            mat: material
        };
    }
    
    this.type = "screen";
    this.sphere = initIso(app, dir, this);
    this.collapsed = collapsed || false;
    this.dimmed = dimmed || false;
    this.scooted = scooted || false;
    this.centered = centered || false;
    this.lightness = lightness || 1;
    
    this.works = [];
    this.objs = [];
}

Screen.prototype.collapse = function(app, collapsed, t, del) {
    this.collapsed = collapsed;
    var tt = t || 1000;
    var d = del || 0;
    
    for(let i in this.works) {
        let ti = collapsed ? 0 : i;
        let target = new app.THREE.Vector3().copy(this.sphere.geo.vertices[isomap[ti]]);
        target.multiplyScalar(0.9 + (collapsed ? (0.1 * ((ti + 1)/this.works.length)) : 0));
        
        let tw = new TWEEN.Tween(this.works[i].grp.position)
            .delay(d)
            .easing(TWEEN.Easing.Exponential.Out)
            .to({
                x: target.x,
                y: target.y,
                z: target.z,
            }, tt)
            .onUpdate(() => {
                this.works[i].grp.lookAt(0,0,0);
            })
            .start();
    }
}

Screen.prototype.dim = function(app, dimmed, t, del) {
    this.dimmed = dimmed;
    var tt = t || 1000;
    var d = del || 0;
    var op = dimmed ? 0 : 1;
    
    for(let i in this.works) {
        
        if(this.works[i].main) {
            this.works[i].dim_tween.stop()
            this.works[i].dim_tween = new TWEEN.Tween(this.works[i].main)
                .easing(TWEEN.Easing.Exponential.Out)
                .delay(d)
                .to({
                    opacity: op
                }, tt)
                .onUpdate(() => {
                    this.works[i].main.updateOpacity();
                })
                .start();
        }
    }
    
//    let tws = new TWEEN.Tween(this.sphere.mat)
//        .easing(TWEEN.Easing.Exponential.Out)
//        .delay(d)
//        .to({
//            opacity: op
//        }, tt)
//        .start();
}

Screen.prototype.lighten = function(app, lightness, t, del) {
    this.lightness = lightness;
    var tt = t || 1000;
    var d = del || 0;
    
    let tw = new TWEEN.Tween(this.sphere.mat.color)
        .easing(TWEEN.Easing.Exponential.Out)
        .delay(d)
        .to({
            r: lightness,
            g: lightness,
            b: lightness
        }, tt)
        .start();
     
}

Screen.prototype.scoot = function(app, scooted, t, del) {
    this.scooted = scooted;
    var tt = t || 1000;
    var d = del || 0;
    
    for(let i in this.works) {
        let ti = this.collapsed ? 0 : i;
        let target = new app.THREE.Vector3().copy(this.sphere.geo.vertices[isomap[ti]]);
        target.multiplyScalar((this.scooted ? 1.5 : 0.9) + (this.collapsed ? (0.1 * ((ti + 1)/this.works.length)) : 0));
        
        let tw = new TWEEN.Tween(this.works[i].grp.position)
            .delay(d)
            .easing(TWEEN.Easing.Exponential.Out)
            .to({
                x: target.x,
                y: target.y,
                z: target.z,
            }, tt)
            .onUpdate(() => {
                this.works[i].grp.lookAt(0,0,0);
            })
            .start();
    }
}

Screen.prototype.center = function(app, centered, t, del) {
    this.centered = centered;
    var tt = t || 1000;
    var d = del || 0;
    let target;
    
    if(centered) {
        target = new app.THREE.Vector3()
        target.copy(this.cover.grp.position);
        target.multiply(new app.THREE.Vector3(-1, 1, -1));
    } else {
        target = new app.THREE.Vector3(0, 0, -1)
    }
    
//    app.camera.target = target
//    
//    console.log(app.camera.target);

    
    app.camera.tween.stop();
    app.camera.tween = new TWEEN.Tween(app.camera.target)
        .delay(d)
        .easing(TWEEN.Easing.Exponential.Out)
        .to({
            x: target.x,
            y: target.y,
            z: target.z,
        }, tt)
        .start();
}

function Artistscreen(cover, app, idx, dir) {
//    Screen.call(this, app, new app.THREE.Vector3(0,0,-1), true, true);
    Screen.call(this, app, new app.THREE.Vector3().copy(dir).multiply(new app.THREE.Vector3(-1, 1, -1)), true, true, false, false, false);
    this.type = "artistscreen";
    this.cover = cover;
    this.name = app.data.artists[idx].name;
    
    function place(me, app, k) {
        return function() {
            me.group.add( this.grp );
            
            this.index = k;
            me.objs[k] = this.raycastTarget.obj;

            this.grp.position.copy(me.sphere.geo.vertices[isomap[0]]);
            this.grp.position.multiplyScalar(1 + 0.01 * (k/me.works.length));
            this.main.opacity = 0;
            this.main.updateOpacity();
            
            this.grp.lookAt(0,0,0);
            
            this.click = function() {
                nav.zoom(app, true, this, me);
            }
        }
    }
    
    this.works[0] = new Artwork(app, app.data.artists[idx].dir, app.data.artists[idx].cover, place(this, app, 0));
    
    for(let i in app.data.artists[idx].work) {
        let l = Number(i);
        let m = l + 1;
        this.works[m] = new Artwork(app, app.data.artists[idx].dir, app.data.artists[idx].work[l], place(this, app, m));
    }
}

Artistscreen.prototype = Object.create(Screen.prototype);
Artistscreen.prototype.constructor = Artistscreen;

// fov = 50 <-> 34
Artistscreen.prototype.zoom = function(app, zoomed, i, t, del) {
    this.zoomed = zoomed;
    var tt = t || 1000;
    var d = del || 0;
    
    let fov;
    if(!app.mobile) fov = zoomed ? 30 : 50;
    else fov = zoomed ? 38 : 50;
    
    let tw = new TWEEN.Tween(app.camera)
        .delay(d + (zoomed ? tt/4 : 0))
        .easing(TWEEN.Easing.Exponential.Out)
        .to({
            fov: fov
        }, tt)
        .onUpdate(() => {
            app.camera.updateProjectionMatrix();
        })
        .start();
    
    let target;
    
    /*
    
    TODO:
    
    if zoomed
        quat target from vect target
        tween camera.quaterneon to target
        
    else
        tween camera.target
    
    */
    
    if(!zoomed) {
        target = new app.THREE.Vector3();
        target.copy(this.cover.grp.position);
        target.multiply(new app.THREE.Vector3(-1, 1, -1));
        
        app.camera.tween.stop();
        app.camera.tween = new TWEEN.Tween(app.camera.target)
        .stop()
        .delay(d + (!zoomed ? tt/4 : 0))
        .easing(TWEEN.Easing.Exponential.Out)
        .to({
            x: target.x,
            y: target.y,
            z: target.z
        }, tt)
        .start();
    } else {
        if(app.mobile) {
            target = new app.THREE.Vector3();
            target.copy(this.works[i].grp.getWorldPosition());
            let qtarget = app.camera.lookAt(target.x, target.y, target.z, true);

            app.camera.tween.stop();
            app.camera.tween = new TWEEN.Tween(app.camera.quaternion)
            .stop()
            .delay(d + (!zoomed ? tt/4 : 0))
            .easing(TWEEN.Easing.Exponential.Out)
            .to({
                x: qtarget.x,
                y: qtarget.y,
                z: qtarget.z,
                w: qtarget.w
            }, tt)
            .onUpdate(() => {
            })
            .start();
        } else {
            target = new app.THREE.Vector3();
            target.copy(this.works[i].grp.getWorldPosition());
//            let qtarget = app.camera.lookAt(target.x, target.y, target.z, true);

            app.camera.tween.stop();
            app.camera.tween = new TWEEN.Tween(app.camera.target)
            .stop()
            .delay(d + (!zoomed ? tt/4 : 0))
            .easing(TWEEN.Easing.Exponential.Out)
            .to({
                x: target.x,
                y: target.y,
                z: target.z
            }, tt)
            .onUpdate(() => {
                app.camera.lookAt(app.camera.target);
            })
            .start();
        }
    }
    
    
}

export function Homescreen(app) {
    Screen.call(this, app, new app.THREE.Vector3(0,0,-1), false, false, true, true, true);
    this.type = "homescreen";
    
    function place(me, app, i, name) {
        return function() {
            me.group.add( this.grp );

            me.objs[me.objs.length] = this.raycastTarget.obj;

            this.grp.position.copy(me.sphere.geo.vertices[isomap[i]]);
            this.grp.position.multiplyScalar(0.9);
            this.grp.lookAt(0,0,0);
            
                
            this.screen = new Artistscreen(this, app, i, this.grp.position);
            this.screen.name = name;
            this.click = function() {
                nav.enter(app, this.screen, true);
            }
        }
    }
    
    var n = 0;
    for(let k in app.data.artists) {
        let v = app.data.artists[k];
        let i = n;
        
        this.works[i] = new Cover(app, v.dir, v.cover, v.name, place(this, app, i, v.name));
        
        n++;
    }
}

Homescreen.prototype = Object.create(Screen.prototype);
Homescreen.prototype.constructor = Homescreen;

Homescreen.prototype.scoot = function(app, scooted, t, del) {
    Screen.prototype.scoot.call(this, app, scooted, t, del);
    
    for(let i in this.works) {
       if(this.works[i].screen.collapsed) this.works[i].screen.scoot(app, scooted, t, del);
    }
}