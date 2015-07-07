/* jshint esnext: true */

// Punter Viz
// ==========
// A three.js visulisation to be
// run on an HTC phone and carried by
// punters into the mirror box.

var PunterViz = (function () {

    // Init & make
    // ===========
    function makeViz () {
        return {
            containerEl: document.createElement( 'div' ),
            backroundColor: 0x616264,
            preRenderFns: [],
            preCubeCamRenderFns: [],
            postCubeCamRenderFns: []
        };
    }

    var initViz = W.composePromisers( makeCameraSceneRenderer,
                                      makeWebCamTexture,
                                      makeWebCamMaterial,
                                      makeCubeCam,
                                      // makeWebCamBoxMesh,
                                      makeWebCamHedronMesh,
                                      makeSwarm,
                                      makeLights,
                                      makeRenderLoop );

    // Promisers
    // =========

    // Camera, Scene, Renderer
    // -----------------------
    function makeCameraSceneRenderer ( viz ) {
        return W.promise( function ( resolve, reject ) {
            
            // Camera
            // ------
            viz.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 3000 );
            setCameraPosition( viz, 0, 0, 200 );

            // Scene
            // -----
            viz.scene = new THREE.Scene();

            // Renderer
            // --------
            viz.renderer = new THREE.WebGLRenderer( { antialias: false } );
            viz.renderer.setPixelRatio( window.devicePixelRatio );
            viz.renderer.setSize( window.innerWidth, window.innerHeight );
            viz.renderer.setClearColor( viz.backgroundColor );
            viz.renderer.sortObjects = false;

            viz.containerEl.appendChild( viz.renderer.domElement );
            
            resolve( viz );
        });
    }

    // Web Cam
    // -------
    // Make the web cam available as a texture
    function makeWebCamTexture ( viz ) {
        return W.promise( function ( resolve, reject ) {

            // Web Cam DOM Element
            // -------------------
            var webCamEl = document.createElement('video');
            webCamEl.autoplay = true;

            // Web Cam Stream
            // --------------
            navigator.webkitGetUserMedia( { video:true }, function( stream ){
                webCamEl.src = URL.createObjectURL( stream );
            }, function( err ){
                console.log("Failed to get a stream due to", err);
            });

            // Web Cam Texture
            // ---------------
            viz.webCamTexture = new THREE.Texture( webCamEl );
            viz.webCamTexture.minFilter = THREE.LinearFilter;
            
            // Render Updates
            // --------------
            addPreRenderFn( viz, function ( detlaMS, timestampMS ) {
                if( webCamEl.readyState === webCamEl.HAVE_ENOUGH_DATA ){
                    viz.webCamTexture.needsUpdate = true;
                }
            });
            
            resolve( viz );
        });
    }

    // Cube Camera
    // -----------
    // Create a cube cam for a dynamic envMap.
    // This also enables two hooks: `preCubeCamRenderActions` & `postCubeCamRenderActions`
    // in the viz for that object3D in the scene can be turned on and off during
    // the webcams render
    function makeCubeCam ( viz ) { 
        return W.promise( function ( resolve, reject ) {

            viz.cubeCamera = new THREE.CubeCamera(1, 3000, 256); // near, far, resolution
            viz.cubeCamera.renderTarget.minFilter = THREE.LinearMipMapLinearFilter; // mipmap filter
            
            addPreRenderFn( viz, function ( deltaMS, timestampMS ) {    
                // Render the cube camera to cube map
                // ----------------------------------
                viz.preCubeCamRenderFns.forEach( fn => fn( deltaMS, timestampMS ) );
                viz.cubeCamera.updateCubeMap( viz.renderer, viz.scene );
                viz.postCubeCamRenderFns.forEach( fn => fn( deltaMS, timestampMS ) );
            });
            
            resolve( viz );
        });
    }

    // Web Cam Material
    // ----------------
    function makeWebCamMaterial ( viz ) {
        return W.promise( function ( resolve, reject ) {
            viz.webCamMaterial = new THREE.MeshBasicMaterial({
                map: viz.webCamTexture,
                color: 0xffffff,
                side: THREE.DoubleSide
            });
            resolve( viz );
        });

    }

    // Web Cam Box Mesh
    // ----------------
    // Creates a box with the web cam displayed
    // on the inside of each of it's 6 sides
    function makeWebCamBoxMesh ( viz ) {
        return W.promise( function ( resolve, reject ) {
            
            viz.webCamvBoxMesh = new THREE.Mesh( new THREE.BoxGeometry( 2000, 2000, 2000 ), viz.webCamMaterial );

            var rotationX = W.randomBetween( 0.0002, 0.00002 );
            var rotationY = W.randomBetween( 0.0002, 0.00002 );
            var rotationZ = W.randomBetween( 0.0002, 0.00002 );
            
            // If we want to rotate it
            addPreRenderFn( viz, function ( deltaMS, timestampMS ) {
                viz.webCamvBoxMesh.rotation.x += ( deltaMS * rotationX );
                viz.webCamvBoxMesh.rotation.y += ( deltaMS * rotationY );
                viz.webCamvBoxMesh.rotation.z += ( deltaMS * rotationZ );
            });
            
            viz.scene.add( viz.webCamvBoxMesh );

            // Show it only for the cube cam
            viz.preCubeCamRenderFns.push( function () {
                viz.webCamvBoxMesh.visible = true;
            });

            viz.postCubeCamRenderFns.push( function () {
                viz.webCamvBoxMesh.visible = true;
            });

            resolve( viz );
        });
    }

    // Web Cam Hedron Mesh
    // -------------------
    function makeWebCamHedronMesh ( viz ) {
        return W.promise( function ( resolve, reject ) {

            // Loader
            // ------
            var loader = new THREE.OBJLoader();
            loader.load( '/obj/hedron.obj', onObjLoaded );

            // Swarm Creation
            // ----------------
            function onObjLoaded ( obj ) {
                console.log( obj.children[ 0 ] );
                viz.webCamHedronMesh = obj.children[ 0 ].clone(); //new THREE.Mesh( new THREE.BoxGeometry( 2000, 2000, 2000 ), material );
                viz.webCamHedronMesh.material = viz.webCamMaterial.clone();
                
                var scale = 2800;
                viz.webCamHedronMesh.scale.set( scale, scale, scale );

                var rotationX = W.randomBetween( 0.0002, 0.00002 );
                var rotationY = W.randomBetween( 0.0002, 0.00002 );
                var rotationZ = W.randomBetween( 0.0002, 0.00002 );
                
                // If we want to rotate it
                addPreRenderFn( viz, function ( deltaMS, timestampMS ) {
                    viz.webCamHedronMesh.rotation.x += ( deltaMS * rotationX );
                    viz.webCamHedronMesh.rotation.y += ( deltaMS * rotationY );
                    viz.webCamHedronMesh.rotation.z += ( deltaMS * rotationZ );
                });
                
                viz.scene.add( viz.webCamHedronMesh );

                // Show it only for the cube cam
                viz.preCubeCamRenderFns.push( function () {
                    viz.webCamHedronMesh.visible = true;
                    viz.webCamHedronMesh.material.color.set( 0xffffff );
                });

                viz.postCubeCamRenderFns.push( function () {
                    viz.webCamHedronMesh.visible = true;
                    viz.webCamHedronMesh.material.color.set( 0xd9d5b3 );
                });

                resolve( viz );
            }
            
        });
    }

    // Lights
    // ------
    function makeLights ( viz ) {
        return W.promise( function ( resolve, reject ) {
            viz.scene.add( new THREE.AmbientLight( 0x222222 ) );

            var directionalLight = new THREE.DirectionalLight( 0xffffff, 2 );
            directionalLight.position.set( 2, 1.2, 10 ).normalize();
            viz.scene.add( directionalLight );

            directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
            directionalLight.position.set( -2, 1.2, -10 ).normalize();
            viz.scene.add( directionalLight );  
            resolve( viz );
        });
    }

    // Swarm
    // -----
    function makeSwarm ( viz ) {
        return W.promise( function ( resolve, reject ) {
            
            var particles = [];

            // Add to Scene
            // ------------
            viz.swarmObject3D = new THREE.Object3D();
            viz.scene.add( viz.swarmObject3D );
            viz.preCubeCamRenderFns.push( function () {
                viz.swarmObject3D.visible = false;
            });
            viz.postCubeCamRenderFns.push( function () {
                viz.swarmObject3D.visible = true;
            });

            // Updating
            addPreRenderFn( viz, function ( deltaMS, timestampMS ) {
                particles.forEach( particle => particle.update( deltaMS, timestampMS ) );
            });

            // Particle Class
            // --------------
            function Particle ( mesh ) {

                this.velocity = W.randomBetween( 0.2, 1 );

                // Mesh
                this.mesh = mesh.clone();
                this.mesh.material = Particle.material.clone();
                this.mesh.scale.x = Particle.initialScale;
                this.mesh.scale.y = Particle.initialScale;
                this.mesh.scale.z = Particle.initialScale;

                // Position
                var range = 100;
                this.mesh.position.set( ( Math.random() - 0.5 ) * range, ( Math.random() - 0.5 ) * range, ( Math.random() - 0.5 ) * range );
                
                this.anchor = new THREE.Object3D();
                this.anchor.add( this.mesh );
            }

            // ### Static
            Particle.material = new THREE.MeshPhongMaterial( {
                color: 0xffffff,
                shininess: 0.0,
                specular: 0xffffff,
                envMap: viz.cubeCamera.renderTarget,
                reflectivity: 1.0,
                side: THREE.DoubleSide
            });

            Particle.initialScale = 200;

            // ### Method
            Particle.prototype.update = function ( deltaMS, timestampMS ) {
                this.anchor.rotation.x += 0.002;
                this.anchor.rotation.y += this.velocity / 10;
                this.anchor.rotation.z += 0.001;
            };

            // Loader
            // ------
            var loader = new THREE.OBJLoader();
            loader.load( '/obj/pillow-box.obj', onObjLoaded );

            // Swarm Creation
            // ----------------
            function onObjLoaded ( obj ) {

                var mesh = obj.children[ 0 ];

                // Particle Creation
                // -----------------
                // Ease in the creation of the particles
                var maxParticles = 100;
                var minCreationTime = 5;
                var maxCreationTimeMS = 100;
                
                (function createMore () {
                    if ( particles.length < maxParticles ) {
                        var particle = new Particle( mesh );
                        viz.swarmObject3D.add( particle.anchor );
                        particles.push( particle );
                        setTimeout( createMore, W.map( particles.length / maxParticles, 0, 1, maxCreationTimeMS, minCreationTime, W.interpolations.easeIn ) );
                    }
                }());
            }
            
            resolve( viz );
        });
    }

    // Render Loop
    // -----------
    function makeRenderLoop ( viz ) {
        return W.promise( function ( resolve, reject ) {

            var lastTimestampMS = 0;
            var deltaMS = 0;

            (function  loop ( currentTimestampMS ) {
                
                // Recur
                // -----
                window.requestAnimationFrame( loop );

                // Update timestamps
                // ------------------
                deltaMS = currentTimestampMS - lastTimestampMS;
                lastTimestampMS = currentTimestampMS;
                
                // Actionables
                // -----------
                viz.preRenderFns.forEach( fn => fn( deltaMS, currentTimestampMS ) );
                
                // Render
                // ------
                viz.renderer.clear();
                viz.renderer.render( viz.scene, viz.camera );

            }( lastTimestampMS ));
            
            resolve( viz );
        });

    }

    // Utils
    // =====

    // Render Loop
    // -----------
    function addPreRenderFn ( viz, fn ) {
        viz.preRenderFns.push( fn );
        return viz;
    }

    // Camera
    // ------
    function setCameraPosition ( viz, x, y, z ) {
        viz.camera.position.x = x;
        viz.camera.position.y = y;
        viz.camera.position.z = z;
        return viz;
    }

    function setVelocity ( viz, value ) {
        return viz;
    }
    
    // Export
    // ======    
    return {
        makeViz: makeViz,
        initViz: initViz,
        setVelocity: setVelocity
    };
    
}());






