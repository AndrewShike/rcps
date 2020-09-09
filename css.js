import { CSS3DRenderer, CSS3DObject } from './three/examples/jsm/renderers/CSS3DRenderer.js';

var camera, scene, renderer;
var controls;

export var css = {}

css.makeYoutube = function ( id, s ) {

    var div = document.createElement( 'div' );
    div.style.width = '480px';
    div.style.height = '360px';
//    div.style.backgroundColor = '#FFFFFF';

    var iframe = document.createElement( 'iframe' );
    iframe.style.width = '480px';
    iframe.style.height = '360px';
    iframe.style.border = '0px';
    iframe.src = [ 'https://www.youtube.com/embed/', id, '?rel=0&autoplay=0' ].join( '' );
    div.appendChild( iframe );

    var object = new CSS3DObject( div );
    object.scale.set(s,s,s);

    return {
        obj: object,
        div: div,
        dim: {
            x: 480 * s,
            y: 360 * s,
            z: 0.001
        }
    }

}

css.makeImg = function ( src, s ) {

    var div = document.createElement( 'div' );
    div.style.width = '480px';
    div.style.height = '360px';
//    div.style.backgroundColor = '#FFFFFF';

    var img = document.createElement( 'img' );
    img.style.width = '480px';
    img.style.height = '360px';
    img.style.border = '0px';
    img.src = src;
    div.appendChild( img );

    var object = new CSS3DObject( div );
    object.scale.set(s,s,s);

    return {
        obj: object,
        div: div,
        dim: {
            x: 480 * s,
            y: 360 * s,
            z: 0.001
        }
    }

}

css.youtubeBump = function() {

    //there's some weird mobile bug with the youtube iframe getting nudged over. I equate this fix to when you smack a TV or DVD player just right and it works every time

    $("#container iframe").css("height", "0px");

    setTimeout(() => {
        $("#container iframe").css("height", "360px");
    }, 1000);
}

css.init = function init(app) {

    camera = app.camera;

//    scene = new app.THREE.Scene();
//    this.scene = scene;

    renderer = new CSS3DRenderer();
    this.renderer = renderer;

    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

//    var group = new app.THREE.Group();
//    group.add( new Element( 'SJOz3qjfQXU', 0, 0, 240, 0 ) );
//    group.add( new Element( 'Y2-xZ-1HE-Q', 240, 0, 0, Math.PI / 2 ) );
//    group.add( new Element( 'IrydklNpcFI', 0, 0, - 240, Math.PI ) );
//    group.add( new Element( '9ubytEsCaS0', - 240, 0, 0, - Math.PI / 2 ) );
//    app.scene.add( group );
//    group.position.set(0, 0, -1000);

//
//    controls.addEventListener( 'start', function () {
//
//        blocker.style.display = '';
//
//    } );
//    controls.addEventListener( 'end', function () {
//
//        blocker.style.display = 'none';
//
//    } );

}

css.render = function(app) {
    this.renderer.render( app.scene, app.camera );
}

css.onWindowResize = function(app) {

//    app.camera.aspect = window.innerWidth / window.innerHeight;
//    app.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );

}
