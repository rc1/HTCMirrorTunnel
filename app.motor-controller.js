// Motor Control
// =============
// Client application to control the motors

var MotorInterface = require( './lib/motor-interface' );


MotorInterface
    .init( MotorInterface.make() )
    .success( function ( motorInterface ) {
        MotorInterface.doTestSequence( motorInterface );

        
    });

