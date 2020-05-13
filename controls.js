
import { DeviceOrientationControls } from './three/examples/jsm/controls/DeviceOrientationControls.js';

export var controls = {}

var orientationControls, 
    isUserInteracting = true,
    onMouseDownMouseX = window.innerWidth / 2, 
    onMouseDownMouseY = window.innerHeight / 2,
    lon = 0, onMouseDownLon = 0,
    lat = 0, onMouseDownLat = 0,
    phi = 0, theta = 0,
    sens = -0.13;

var mouse, INTERSECTED, raycaster;

controls.init = function(app) {
    
    raycaster = new app.THREE.Raycaster();
    mouse = new app.THREE.Vector2();
    
    function setMouse(x,y) {
        mouse.x = ( x) * 2 - 1;
        mouse.y = - ( y  ) * 2 + 1;
    }
    
    if(app.mobile) {
        orientationControls = new DeviceOrientationControls(app.camera);
        
        setMouse(0.5, 0.5);
    } else {
            
        //document.addEventListener( 'mousedown', onPointerStart, false );
        document.addEventListener( 'mousemove', onPointerMove, false );
        //document.addEventListener( 'mouseup', onPointerUp, false );

        document.addEventListener( 'wheel', onDocumentMouseWheel, false );

        //document.addEventListener( 'touchstart', onPointerStart, false );
        document.addEventListener( 'touchmove', onPointerMove, false );
        //document.addEventListener( 'touchend', onPointerUp, false );

        window.addEventListener( 'resize', onWindowResize, false );

        function onWindowResize() {

            app.camera.aspect = window.innerWidth / window.innerHeight;
            app.camera.updateProjectionMatrix();

            app.renderer.setSize( window.innerWidth, window.innerHeight );

        }


        function onPointerStart( event ) {

            isUserInteracting = true;

            var clientX = event.clientX || event.touches[ 0 ].clientX;
            var clientY = event.clientY || event.touches[ 0 ].clientY;

            onMouseDownMouseX = clientX;
            onMouseDownMouseY = clientY;

            onMouseDownLon = lon;
            onMouseDownLat = lat;

        }

        function onPointerMove( event ) {

            if ( isUserInteracting === true ) {

                var clientX = event.clientX || event.touches[ 0 ].clientX;
                var clientY = event.clientY || event.touches[ 0 ].clientY;

                lon = ( onMouseDownMouseX - clientX ) * sens + onMouseDownLon  - 90;
                lat = ( clientY - onMouseDownMouseY ) * sens + onMouseDownLat;

            }
            
            setMouse(event.clientX / window.innerWidth, event.clientY / window.innerHeight)
        }

        function onPointerUp() {

            isUserInteracting = false;

        }

        function onDocumentMouseWheel( event ) {

            var fov = app.camera.fov + event.deltaY * 0.05;

            app.camera.fov = app.THREE.MathUtils.clamp( fov, 10, 75 );

            app.camera.updateProjectionMatrix();

        }
    }
}

controls.update = function(app) {
    if(app.mobile) {
        orientationControls.update();
    } else {
        lat = Math.max( - 85, Math.min( 85, lat ) );
        phi = app.THREE.MathUtils.degToRad( 90 - lat );
        theta = app.THREE.MathUtils.degToRad( lon );

        app.camera.target.x = 500 * Math.sin( phi ) * Math.cos( theta );
        app.camera.target.y = 500 * Math.cos( phi );
        app.camera.target.z = 500 * Math.sin( phi ) * Math.sin( theta );

        app.camera.lookAt( app.camera.target );
    }
    
    raycaster.setFromCamera( mouse, app.camera );
//    let intersects = raycaster.intersectObjects( app.current_screen.group.children );
    let intersects = raycaster.intersectObjects( app.scene.children, true );
    
//    console.log(mouse.x, mouse.y);
    
//    for ( var i = 0; i < intersects.length; i++ ) {
//
//		intersects[ i ].object.material.color.set( 0xff0000 );
//
//	}

    if ( intersects.length > 0 ) {

        if ( INTERSECTED != intersects[ 0 ].object ) {

            if ( INTERSECTED ) {
                if(INTERSECTED.selected) INTERSECTED.selected(false);
            }

            INTERSECTED = intersects[ 0 ].object;
            
            if(INTERSECTED.selected) INTERSECTED.selected(true);
        }

    } else {

        if ( INTERSECTED ) {
            if(INTERSECTED.selected) INTERSECTED.selected(false);
        }

        INTERSECTED = null;

    }

}