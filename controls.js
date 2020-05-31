
import { DeviceOrientationControls } from './three/examples/jsm/controls/DeviceOrientationControls.js';

export var controls = {
    locked: false,
    lookat: {}
}

var orientationControls,
    offset,
    isUserInteracting = true,
    onMouseDownMouseX = window.innerWidth / 2, 
    onMouseDownMouseY = window.innerHeight / 2,
    lon = 0, onMouseDownLon = 0,
    lat = 0, onMouseDownLat = 0,
    phi = 0, theta = 0,
    sens = -0.13;

var mouse, INTERSECTED, raycaster;

controls.init = function(app) {
    
    this.lookat = new app.THREE.Vector3();
    
    raycaster = new app.THREE.Raycaster();
    mouse = new app.THREE.Vector2();
    
    app.camera.target = new app.THREE.Vector3(0, 0, -1);
    
    function setMouse(x,y) {
        mouse.x = ( x) * 2 - 1;
        mouse.y = - ( y  ) * 2 + 1;
    }
    
    if(app.mobile) {
        orientationControls = new DeviceOrientationControls(app.camera);
        
        window.oc = orientationControls;
        
        setMouse(0.5, 0.5);
    } else {
            
        document.addEventListener( 'mousemove', onPointerMove, false );

//        app.container.addEventListener( 'touchmove', onPointerMove, false );

        window.addEventListener( 'resize', onWindowResize, false );

        function onWindowResize() {

            app.camera.aspect = window.innerWidth / window.innerHeight;
            app.camera.updateProjectionMatrix();

            app.renderer.setSize( window.innerWidth, window.innerHeight );
            
            app.css.onWindowResize(app);

        }

        function onPointerMove( event ) {

            if ( isUserInteracting === true ) {

                var clientX = event.clientX;
                var clientY = event.clientY;

//                lon = ( onMouseDownMouseX - clientX ) * sens + onMouseDownLon  - 90;
                lon = ( onMouseDownMouseX - clientX ) * -sens + onMouseDownLon;
//                lat = ( clientY - onMouseDownMouseY ) * sens + onMouseDownLat;
                lat = ( clientY - onMouseDownMouseY ) * -sens + onMouseDownLat + 90;

            }
            
            setMouse(event.clientX / window.innerWidth, event.clientY / window.innerHeight)
        }

//        function onDocumentMouseWheel( event ) {
//
//            var fov = app.camera.fov + event.deltaY * 0.05;
//
//            app.camera.fov = app.THREE.MathUtils.clamp( fov, 10, 75 );
//
//            app.camera.updateProjectionMatrix();
//            
//            console.log(fov);
//
//        }
        
        
    }
    
    function onDocumentClick(event) {
        console.log("tap click");

        if(INTERSECTED && INTERSECTED.click) INTERSECTED.click();
    }

    $("#container").on(  'click', onDocumentClick);
    
    $("#container").on( 'touchstart', function(e) {
        e.preventDefault();
        
        onDocumentClick();
    });

    function onButton(event) {
        app.nav.back(app)
    }
    
    function onArtistButton(event) {
        app.nav.artistInfo(app, !app.nav.infod);
    }
    
    
    if(app.mobile) {
        $("#back").on( 'touchstart', function(e) {
            e.preventDefault();

            $("#back").addClass("on");
            onButton();
        });
        
        $("#artist-info").on( 'touchstart', function(e) {
            e.preventDefault();

            $("#artist-info").addClass("on");
            onArtistButton();
        });

        $(window).on( 'touchmove', function(e) {
            e.preventDefault();

            $("#back").removeClass("on");
            $("#artist-info").removeClass("on");
        });
        
        $(window).on( 'touchend', function(e) {
            e.preventDefault();

            $("#back").removeClass("on");
            $("#artist-info").removeClass("on");
        });
        
        $("#arrow-left").on( 'touchstart', function(e) {
            e.preventDefault();

            app.nav.inc(app, -1);
        });

        $("#arrow-right").on( 'touchstart', function(e) {
            e.preventDefault();

            app.nav.inc(app, 1);
        });
        
    } else {
        $("#back").click(onButton);
        document.addEventListener("keydown", function(e) {
            if(e.key == "Escape") {
                $("#back").addClass("on");
                onButton();
            }
        });
        document.addEventListener("keyup", function(e) {
            if(e.key == "Escape") {
                $("#back").removeClass("on");
            }
        });
        
        $("#artist-info").click(onArtistButton);
        document.addEventListener("keydown", function(e) {
            if(e.key == "q" || e.key == "Q") {
                $("#artist-info").addClass("on");
                onArtistButton();
            }
        });
        document.addEventListener("keyup", function(e) {
            if(e.key == "q" || e.key == "Q") {
                $("#artist-info").removeClass("on");
            }
        });
        
        $("#arrow-left").click(function () {
            app.nav.inc(app, -1);
        });

        $("#arrow-right").click(function () {
            app.nav.inc(app, 1);
        });
    }
}

var canvas = document.getElementsByTagName("canvas");

controls.update = function(app) {
    if(app.mobile) {
        if(!this.locked) orientationControls.update();
    } else {
//        lat = Math.max( - 85, Math.min( 85, lat ) );
//        phi = app.THREE.MathUtils.degToRad( 90 - lat );
//        theta = app.THREE.MathUtils.degToRad( lon );

//        app.camera.target.x = 1 * Math.sin( phi ) * Math.cos( theta );
//        app.camera.target.y = 1 * Math.cos( phi );
//        app.camera.target.z = 1 * Math.sin( phi ) * Math.sin( theta );
        
        var tlat = app.THREE.MathUtils.degToRad( 90 - lat );
        var tlon = app.THREE.MathUtils.degToRad( lon );
        
        this.lookat.copy(app.camera.target);
        this.lookat.applyAxisAngle(new app.THREE.Vector3(1, 0, 0), tlat);
        this.lookat.applyAxisAngle(new app.THREE.Vector3(0, 1, 0), tlon);
        
        if(!this.locked) {
            app.camera.lookAt(this.lookat);
        } else {
//            app.camera.lookAt(app.camera.target);
        }
    }
    
    raycaster.setFromCamera( mouse, app.camera );
    
//    if(app.current_screen.objs.length == app.current_screen.length) {
    
        let intersects = app.nav.location && app.nav.location.objs ? raycaster.intersectObjects( app.nav.location.objs ) : null;

        if ( intersects && intersects.length > 0 ) {

            $("#container").addClass("hover");

            if ( INTERSECTED != intersects[ 0 ].object ) {

                if ( INTERSECTED ) {
                    if(INTERSECTED.selected) INTERSECTED.selected(false);
                }

                INTERSECTED = intersects[ 0 ].object;

                if(INTERSECTED.selected) INTERSECTED.selected(true);
            }

        } else {

            $("#container").removeClass("hover");

            if ( INTERSECTED ) {
                if(INTERSECTED.selected) INTERSECTED.selected(false);
            }

            INTERSECTED = null;

        }
//    }

}

controls.lock = function(app, locked) {
    this.locked = locked;
    
    if(locked) {
        if(!app.mobile) {
            app.camera.target.copy(this.lookat);
        }
    }
}