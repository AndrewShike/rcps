export var lookAtExt = function(app) {
    
    var _m1 = new app.THREE.Matrix4();
    var _target = new app.THREE.Vector3();
    var _position = new app.THREE.Vector3();
    var _q;
    
    return function(x, y, z, returnQuaterneon ) {

        // This method does not support objects having non-uniformly-scaled parent(s)

        if ( x.isVector3 ) {

            _target.copy( x );

        } else {

            _target.set( x, y, z );

        }

        var parent = this.parent;

        this.updateWorldMatrix( true, false );

        _position.setFromMatrixPosition( this.matrixWorld );

        if ( this.isCamera || this.isLight ) {  

            _m1.lookAt( _position, _target, this.up );

        } else {

            _m1.lookAt( _target, _position, this.up );

        }

        if(!returnQuaterneon) this.quaternion.setFromRotationMatrix( _m1 );
        else {
            _q = new app.THREE.Quaternion();
            _q.setFromRotationMatrix( _m1 );
        }

        if ( parent ) {

            _m1.extractRotation( parent.matrixWorld );
            _q1.setFromRotationMatrix( _m1 );
            this.quaternion.premultiply( _q1.inverse() );

        }

        if(_q) return _q;
    }
}