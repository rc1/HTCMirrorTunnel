"use strict";function makeWebSocketClient(e){return W.promise(function(n,t){e.wsClient=new W.JSONSocketConnection({socketUrl:e.wsUrl});var r=once(function(){report("CONNECTED","to:",e.wsUrl),n(e)});e.wsClient.on("open",r),e.wsClient.on("error",makeReporter("Web Socket Error")),e.wsClient.openSocketConnection()})}function makePunterVizs(e){return W.promise(function(n,t){$("[data-punter-viz]").toArray().map(function(n){e.punterViz=PunterViz.makeApp(),e.punterViz.containerEl=n,PunterViz.initApp(e.punterViz).error(function(e){console.error("Failed to create Punter app",e)}).success(function(e){console.log("Punter application made")})}),n(e)})}function makeRestRadioButtons(e){return W.promise(function(n,t){$('[data-rest-type="radio-post"]').toArray().map($).map(function(n){var t=n.parent();t.on("click touch",function(t){return t.preventDefault(),console.log("sending",n.val(),"to",n.data("restUri")),RestesqueUtil.post(e.wsClient,n.data("restUri"),n.val()),!1})}),$('[data-rest-type="feildset"]').toArray().map($).map(function(n){var t=n.find('input[type="radio"]').checkboxradio();console.log("got a field set",n.data("restUri")),RestesqueUtil.subscribeWithInitialGet(e.wsClient,n.data("restUri"),function(e){t.prop("checked",!1).checkboxradio("refresh").filter('input[value="'+e.getBody()+'"]').attr("checked","checked").checkboxradio("refresh").parent().find("label").removeClass("ui-radio-off").addClass("ui-radio-on")})}),n(e)})}function once(e){var n=!1;return function(){n||(e(),n=!0)}}function report(e,n){console.log("[",e,"]",W.rest(W.toArray(arguments)).join(" "))}function makeReporter(e,n){var t=arguments;return function(){report.apply(this,t);var e=arguments;return W.promise(function(n,t){n.apply(this,e)})}}var PunterViz=function(){function e(){return{containerEl:document.createElement("div"),backroundColor:6382180,preRenderFns:[],preCubeCamRenderFns:[],postCubeCamRenderFns:[]}}function n(e){return W.promise(function(n,t){e.camera=new THREE.PerspectiveCamera(70,window.innerWidth/window.innerHeight,1,3e3),u(e,0,0,200),e.scene=new THREE.Scene,e.renderer=new THREE.WebGLRenderer({antialias:!1}),e.renderer.setPixelRatio(window.devicePixelRatio),e.renderer.setSize(window.innerWidth,window.innerHeight),e.renderer.setClearColor(e.backgroundColor),e.renderer.sortObjects=!1,e.containerEl.appendChild(e.renderer.domElement),n(e)})}function t(e){return W.promise(function(n,t){var r=document.createElement("video");r.autoplay=!0,navigator.webkitGetUserMedia({video:!0},function(e){r.src=URL.createObjectURL(e)},function(e){console.log("Failed to get a stream due to",e)}),e.webCamTexture=new THREE.Texture(r),e.webCamTexture.minFilter=THREE.LinearFilter,c(e,function(n,t){r.readyState===r.HAVE_ENOUGH_DATA&&(e.webCamTexture.needsUpdate=!0)}),n(e)})}function r(e){return W.promise(function(n,t){e.cubeCamera=new THREE.CubeCamera(1,3e3,256),e.cubeCamera.renderTarget.minFilter=THREE.LinearMipMapLinearFilter,c(e,function(n,t){e.preCubeCamRenderFns.forEach(function(e){return e(n,t)}),e.cubeCamera.updateCubeMap(e.renderer,e.scene),e.postCubeCamRenderFns.forEach(function(e){return e(n,t)})}),n(e)})}function i(e){return W.promise(function(n,t){var r=new THREE.MeshBasicMaterial({map:e.webCamTexture,color:16777215,side:THREE.BackSide});e.webCamvBoxMesh=new THREE.Mesh(new THREE.BoxGeometry(2e3,2e3,2e3),r);var i=W.randomBetween(2e-4,2e-5),o=W.randomBetween(2e-4,2e-5),a=W.randomBetween(2e-4,2e-5);c(e,function(n,t){e.webCamvBoxMesh.rotation.x+=n*i,e.webCamvBoxMesh.rotation.y+=n*o,e.webCamvBoxMesh.rotation.z+=n*a}),e.scene.add(e.webCamvBoxMesh),e.preCubeCamRenderFns.push(function(){e.webCamvBoxMesh.visible=!0}),e.postCubeCamRenderFns.push(function(){e.webCamvBoxMesh.visible=!1}),n(e)})}function o(e){return W.promise(function(n,t){e.scene.add(new THREE.AmbientLight(2236962));var r=new THREE.DirectionalLight(16777215,2);r.position.set(2,1.2,10).normalize(),e.scene.add(r),r=new THREE.DirectionalLight(16777215,1),r.position.set(-2,1.2,-10).normalize(),e.scene.add(r),n(e)})}function a(e){return W.promise(function(n,t){function r(n){{var t=n.children[0],r=100,a=5,s=100;!function c(){if(o.length<r){var n=new i(t);e.swarmObject3D.add(n.anchor),o.push(n),setTimeout(c,W.map(o.length/r,0,1,s,a,W.interpolations.easeIn))}}()}}function i(e){this.velocity=W.randomBetween(.2,1),this.mesh=e.clone(),this.mesh.material=i.material.clone(),this.mesh.scale.x=i.initialScale,this.mesh.scale.y=i.initialScale,this.mesh.scale.z=i.initialScale;var n=100;this.mesh.position.set((Math.random()-.5)*n,(Math.random()-.5)*n,(Math.random()-.5)*n),this.anchor=new THREE.Object3D,this.anchor.add(this.mesh)}var o=[];e.swarmObject3D=new THREE.Object3D,e.scene.add(e.swarmObject3D),e.preCubeCamRenderFns.push(function(){e.swarmObject3D.visible=!1}),e.postCubeCamRenderFns.push(function(){e.swarmObject3D.visible=!0});var a=new THREE.OBJLoader;a.load("/obj/pillow-box.obj",r),c(e,function(e,n){o.forEach(function(t){return t.update(e,n)})}),i.material=new THREE.MeshPhongMaterial({color:16777215,shininess:0,specular:16777215,envMap:e.cubeCamera.renderTarget,reflectivity:1,side:THREE.DoubleSide}),i.initialScale=200,i.prototype.update=function(e,n){this.anchor.rotation.x+=.002,this.anchor.rotation.y+=this.velocity/10,this.anchor.rotation.z+=.001},n(e)})}function s(e){return W.promise(function(n,t){var r=0,i=0;!function o(n){window.requestAnimationFrame(o),i=n-r,r=n,e.preRenderFns.forEach(function(e){return e(i,n)}),e.renderer.clear(),e.renderer.render(e.scene,e.camera)}(r),n(e)})}function c(e,n){e.preRenderFns.push(n)}function u(e,n,t,r){e.camera.position.x=n,e.camera.position.y=t,e.camera.position.z=r}var d=W.composePromisers(n,t,r,i,a,o,s);return{makeApp:e,initApp:d}}(),makeApp=function(){return{wsUrl:"wss://192.168.0.32:7080"}},initApp=W.composePromisers(makeWebSocketClient,makePunterVizs,makeRestRadioButtons);$(function(){initApp(makeApp()).success(function(e){report("OK","TheWorkers.net"),window.app=e})});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFsbC5qcyIsIm1haW4uanMiLCJwdW50ZXItdml6LmpzIl0sIm5hbWVzIjpbIm1ha2VXZWJTb2NrZXRDbGllbnQiLCJhcHAiLCJXIiwicHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJ3c0NsaWVudCIsIkpTT05Tb2NrZXRDb25uZWN0aW9uIiwic29ja2V0VXJsIiwid3NVcmwiLCJyZXNvbHZlT25GaXJzdENvbm5lY3QiLCJvbmNlIiwicmVwb3J0Iiwib24iLCJtYWtlUmVwb3J0ZXIiLCJvcGVuU29ja2V0Q29ubmVjdGlvbiIsIm1ha2VQdW50ZXJWaXpzIiwiJCIsInRvQXJyYXkiLCJtYXAiLCJlbCIsInB1bnRlclZpeiIsIlB1bnRlclZpeiIsIm1ha2VBcHAiLCJjb250YWluZXJFbCIsImluaXRBcHAiLCJlcnJvciIsImVyciIsImNvbnNvbGUiLCJzdWNjZXNzIiwiaW5pdGFsaXNlZFB1bnRlckFwcCIsImxvZyIsIm1ha2VSZXN0UmFkaW9CdXR0b25zIiwiJGVsIiwiJHdyYXBwZXJFbCIsInBhcmVudCIsImUiLCJwcmV2ZW50RGVmYXVsdCIsInZhbCIsImRhdGEiLCJSZXN0ZXNxdWVVdGlsIiwicG9zdCIsInJhZGlvRWxzIiwiZmluZCIsImNoZWNrYm94cmFkaW8iLCJzdWJzY3JpYmVXaXRoSW5pdGlhbEdldCIsInBhY2tldCIsInByb3AiLCJmaWx0ZXIiLCJnZXRCb2R5IiwiYXR0ciIsInJlbW92ZUNsYXNzIiwiYWRkQ2xhc3MiLCJmbiIsImhhc1RyaWdnZXJlZCIsInN0YXR1cyIsInN0ciIsInJlc3QiLCJhcmd1bWVudHMiLCJqb2luIiwicmVwb3J0QXJncyIsImFwcGx5IiwidGhpcyIsImNhbGxlZUFyZ3MiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJiYWNrcm91bmRDb2xvciIsInByZVJlbmRlckZucyIsInByZUN1YmVDYW1SZW5kZXJGbnMiLCJwb3N0Q3ViZUNhbVJlbmRlckZucyIsIm1ha2VDYW1lcmFTY2VuZVJlbmRlcmVyIiwiY2FtZXJhIiwiVEhSRUUiLCJQZXJzcGVjdGl2ZUNhbWVyYSIsIndpbmRvdyIsImlubmVyV2lkdGgiLCJpbm5lckhlaWdodCIsInNldENhbWVyYVBvc2l0aW9uIiwic2NlbmUiLCJTY2VuZSIsInJlbmRlcmVyIiwiV2ViR0xSZW5kZXJlciIsImFudGlhbGlhcyIsInNldFBpeGVsUmF0aW8iLCJkZXZpY2VQaXhlbFJhdGlvIiwic2V0U2l6ZSIsInNldENsZWFyQ29sb3IiLCJiYWNrZ3JvdW5kQ29sb3IiLCJzb3J0T2JqZWN0cyIsImFwcGVuZENoaWxkIiwiZG9tRWxlbWVudCIsIm1ha2VXZWJDYW1UZXh0dXJlIiwid2ViQ2FtRWwiLCJhdXRvcGxheSIsIm5hdmlnYXRvciIsIndlYmtpdEdldFVzZXJNZWRpYSIsInZpZGVvIiwic3RyZWFtIiwic3JjIiwiVVJMIiwiY3JlYXRlT2JqZWN0VVJMIiwid2ViQ2FtVGV4dHVyZSIsIlRleHR1cmUiLCJtaW5GaWx0ZXIiLCJMaW5lYXJGaWx0ZXIiLCJhZGRQcmVSZW5kZXJGbiIsImRldGxhTVMiLCJ0aW1lc3RhbXBNUyIsInJlYWR5U3RhdGUiLCJIQVZFX0VOT1VHSF9EQVRBIiwibmVlZHNVcGRhdGUiLCJtYWtlQ3ViZUNhbSIsImN1YmVDYW1lcmEiLCJDdWJlQ2FtZXJhIiwicmVuZGVyVGFyZ2V0IiwiTGluZWFyTWlwTWFwTGluZWFyRmlsdGVyIiwiZGVsdGFNUyIsImZvckVhY2giLCJ1cGRhdGVDdWJlTWFwIiwibWFrZVdlYkNhbUJveE1lc2giLCJ3ZWJDYW1Cb3hNYXRlcmlhbCIsIk1lc2hCYXNpY01hdGVyaWFsIiwiY29sb3IiLCJzaWRlIiwiQmFja1NpZGUiLCJ3ZWJDYW12Qm94TWVzaCIsIk1lc2giLCJCb3hHZW9tZXRyeSIsInJvdGF0aW9uWCIsInJhbmRvbUJldHdlZW4iLCJyb3RhdGlvblkiLCJyb3RhdGlvbloiLCJyb3RhdGlvbiIsIngiLCJ5IiwieiIsImFkZCIsInB1c2giLCJ2aXNpYmxlIiwibWFrZUxpZ2h0cyIsIkFtYmllbnRMaWdodCIsImRpcmVjdGlvbmFsTGlnaHQiLCJEaXJlY3Rpb25hbExpZ2h0IiwicG9zaXRpb24iLCJzZXQiLCJub3JtYWxpemUiLCJtYWtlU3dhcm0iLCJvbk9iakxvYWRlZCIsIm9iaiIsIm1lc2giLCJjaGlsZHJlbiIsIm1heFBhcnRpY2xlcyIsIm1pbkNyZWF0aW9uVGltZSIsIm1heENyZWF0aW9uVGltZU1TIiwiY3JlYXRlTW9yZSIsInBhcnRpY2xlcyIsImxlbmd0aCIsInBhcnRpY2xlIiwiUGFydGljbGUiLCJzd2FybU9iamVjdDNEIiwiYW5jaG9yIiwic2V0VGltZW91dCIsImludGVycG9sYXRpb25zIiwiZWFzZUluIiwidmVsb2NpdHkiLCJjbG9uZSIsIm1hdGVyaWFsIiwic2NhbGUiLCJpbml0aWFsU2NhbGUiLCJyYW5nZSIsIk1hdGgiLCJyYW5kb20iLCJPYmplY3QzRCIsImxvYWRlciIsIk9CSkxvYWRlciIsImxvYWQiLCJ1cGRhdGUiLCJNZXNoUGhvbmdNYXRlcmlhbCIsInNoaW5pbmVzcyIsInNwZWN1bGFyIiwiZW52TWFwIiwicmVmbGVjdGl2aXR5IiwiRG91YmxlU2lkZSIsInByb3RvdHlwZSIsIm1ha2VSZW5kZXJMb29wIiwibGFzdFRpbWVzdGFtcE1TIiwibG9vcCIsImN1cnJlbnRUaW1lc3RhbXBNUyIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsImNsZWFyIiwicmVuZGVyIiwiY29tcG9zZVByb21pc2VycyJdLCJtYXBwaW5ncyI6IkFBUUEsWUNzQkEsU0FBU0EscUJBQXNCQyxHQUMzQixNQUFPQyxHQUFFQyxRQUFTLFNBQVdDLEVBQVNDLEdBQ2xDSixFQUFJSyxTQUFXLEdBQUlKLEdBQUVLLHNCQUNqQkMsVUFBV1AsRUFBSVEsT0FHbkIsSUFBSUMsR0FBd0JDLEtBQU0sV0FDOUJDLE9BQVEsWUFBYSxNQUFPWCxFQUFJUSxPQUNoQ0wsRUFBU0gsSUFHYkEsR0FBSUssU0FBU08sR0FBSSxPQUFRSCxHQUN6QlQsRUFBSUssU0FBU08sR0FBSSxRQUFTQyxhQUFjLHFCQUN4Q2IsRUFBSUssU0FBU1MseUJB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Q3hCckksRUFBSXNFLE9BQU93RSxTQUFTUixFQUFJQSxFQWhUNUIsR0FBSTlHLEdBQVV2QixFQUFFNkwsaUJBQWtCekgsRUFDQXFCLEVBQ0FvQixFQUNBUSxFQUNBMkIsRUFDQVAsRUFDQTZDLEVBK1NsQyxRQUNJakssUUFBU0EsRUFDVEUsUUFBU0EsTURwVWJGLFFBQVUsV0FDVixPQUNJZCxNQUFPLDRCQUlYZ0IsUUFBVXZCLEVBQUU2TCxpQkFBa0IvTCxvQkFDQWdCLGVBQ0FnQixxQkFFbENmLEdBQUcsV0FDQ1EsUUFBU0YsV0FDUk0sUUFBUyxTQUFXNUIsR0FDakJXLE9BQVEsS0FBTSxrQkFDZDhELE9BQU96RSxJQUFNQSIsImZpbGUiOiJhbGwuanMiLCJzb3VyY2VzQ29udGVudCI6W251bGwsIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cblxuLy8gTWFpbi5qc1xuLy8gPT09PT09PVxuLy8gRW50cnkgcG9pbnQgb2YgdGhlIGFwcGxpY2F0aW9uLlxuXG4vLyBNYWtlICYgSW5pdFxuLy8gPT09PT09PT09PT1cblxudmFyIG1ha2VBcHAgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgd3NVcmw6ICd3c3M6Ly8xOTIuMTY4LjAuMzI6NzA4MCdcbiAgICB9O1xufTtcblxudmFyIGluaXRBcHAgPSBXLmNvbXBvc2VQcm9taXNlcnMoIG1ha2VXZWJTb2NrZXRDbGllbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFrZVB1bnRlclZpenMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFrZVJlc3RSYWRpb0J1dHRvbnMgKTtcblxuJCggZnVuY3Rpb24gKCkge1xuICAgIGluaXRBcHAoIG1ha2VBcHAoKSApXG4gICAgLnN1Y2Nlc3MoIGZ1bmN0aW9uICggYXBwICkge1xuICAgICAgICByZXBvcnQoICdPSycsICdUaGVXb3JrZXJzLm5ldCcgKTtcbiAgICAgICAgd2luZG93LmFwcCA9IGFwcDtcbiAgICB9KTtcbn0pO1xuXG4vLyBQcm9taXNlcnNcbi8vID09PT09PT09PVxuXG5mdW5jdGlvbiBtYWtlV2ViU29ja2V0Q2xpZW50ICggYXBwICkge1xuICAgIHJldHVybiBXLnByb21pc2UoIGZ1bmN0aW9uICggcmVzb2x2ZSwgcmVqZWN0ICkge1xuICAgICAgICBhcHAud3NDbGllbnQgPSBuZXcgVy5KU09OU29ja2V0Q29ubmVjdGlvbih7XG4gICAgICAgICAgICBzb2NrZXRVcmw6IGFwcC53c1VybFxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIHZhciByZXNvbHZlT25GaXJzdENvbm5lY3QgPSBvbmNlKCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXBvcnQoICdDT05ORUNURUQnLCAndG86JywgYXBwLndzVXJsICk7XG4gICAgICAgICAgICByZXNvbHZlKCBhcHAgKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYXBwLndzQ2xpZW50Lm9uKCAnb3BlbicsIHJlc29sdmVPbkZpcnN0Q29ubmVjdCApO1xuICAgICAgICBhcHAud3NDbGllbnQub24oICdlcnJvcicsIG1ha2VSZXBvcnRlciggJ1dlYiBTb2NrZXQgRXJyb3InICkgKTtcbiAgICAgICAgYXBwLndzQ2xpZW50Lm9wZW5Tb2NrZXRDb25uZWN0aW9uKCk7XG4gICAgICAgIFxuICAgIH0pO1xufVxuXG4vLyBQdW50ZXIgVml6XG4vLyAtLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIG1ha2VQdW50ZXJWaXpzICggYXBwICkge1xuICAgIHJldHVybiBXLnByb21pc2UoIGZ1bmN0aW9uICggcmVzb2x2ZSwgcmVqZWN0ICkge1xuICAgICAgICAkKCBcIltkYXRhLXB1bnRlci12aXpdXCIgKVxuICAgICAgICAgICAgLnRvQXJyYXkoKVxuICAgICAgICAgICAgLm1hcCggZnVuY3Rpb24gKCBlbCApIHtcbiAgICAgICAgICAgICAgICAvLyBNYWtlIHRoZSBwdW50ZXIgYXBwbGljYXRpb25cbiAgICAgICAgICAgICAgICBhcHAucHVudGVyVml6ID0gUHVudGVyVml6Lm1ha2VBcHAoKTtcbiAgICAgICAgICAgICAgICAvLyBBZGQgb3V0IGRvbSBlbGVtZW50XG4gICAgICAgICAgICAgICAgYXBwLnB1bnRlclZpei5jb250YWluZXJFbCA9IGVsO1xuXG4gICAgICAgICAgICAgICAgLy8gSW5pdGFpbGlzZSBpdFxuICAgICAgICAgICAgICAgIFB1bnRlclZpelxuICAgICAgICAgICAgICAgICAgICAuaW5pdEFwcCggYXBwLnB1bnRlclZpeiApXG4gICAgICAgICAgICAgICAgICAgIC5lcnJvciggZnVuY3Rpb24gKCBlcnIgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCAnRmFpbGVkIHRvIGNyZWF0ZSBQdW50ZXIgYXBwJywgZXJyICk7XG4gICAgICAgICAgICAgICAgICAgIH0pIFxuICAgICAgICAgICAgICAgICAgICAuc3VjY2VzcyggZnVuY3Rpb24gKCBpbml0YWxpc2VkUHVudGVyQXBwICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdQdW50ZXIgYXBwbGljYXRpb24gbWFkZScgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICByZXNvbHZlKCBhcHAgKTtcbiAgICB9KTtcbn1cblxuLy8galF1ZXJ5IE1vYmlsZSBVaSBCaW5kaW5nc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBtYWtlUmVzdFJhZGlvQnV0dG9ucyAoIGFwcCApIHtcbiAgICByZXR1cm4gVy5wcm9taXNlKCBmdW5jdGlvbiAoIHJlc29sdmUsIHJlamVjdCApIHtcbiAgICAgICAgLy8gUmFkaW8gQnV0dG9uc1xuICAgICAgICAvLyA9PT09PT09PT09PT09XG4gICAgICAgICQoICdbZGF0YS1yZXN0LXR5cGU9XCJyYWRpby1wb3N0XCJdJyApXG4gICAgICAgICAgICAudG9BcnJheSgpXG4gICAgICAgICAgICAubWFwKCAkIClcbiAgICAgICAgICAgIC5tYXAoIGZ1bmN0aW9uICggJGVsICkge1xuICAgICAgICAgICAgICAgIC8vIERpc2FibGUgcmVhbCBldmVudHNcbiAgICAgICAgICAgICAgICB2YXIgJHdyYXBwZXJFbCA9ICRlbC5wYXJlbnQoKTtcbiAgICAgICAgICAgICAgICAkd3JhcHBlckVsLm9uKCAnY2xpY2sgdG91Y2gnLCBmdW5jdGlvbiAoIGUgKSB7XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdzZW5kaW5nJywkZWwudmFsKCksICd0bycsICRlbC5kYXRhKCAncmVzdFVyaScgKSAgKTtcbiAgICAgICAgICAgICAgICAgICAgUmVzdGVzcXVlVXRpbC5wb3N0KCBhcHAud3NDbGllbnQsICRlbC5kYXRhKCAncmVzdFVyaScgKSwgJGVsLnZhbCgpICk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFJhZGlvIEZpZWxkIFNldHNcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PVxuICAgICAgICAkKCAnW2RhdGEtcmVzdC10eXBlPVwiZmVpbGRzZXRcIl0nIClcbiAgICAgICAgICAgIC50b0FycmF5KClcbiAgICAgICAgICAgIC5tYXAoICQgKVxuICAgICAgICAgICAgLm1hcCggZnVuY3Rpb24gKCAkZWwgKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgcmFkaW9FbHMgPSAkZWwuZmluZCggJ2lucHV0W3R5cGU9XCJyYWRpb1wiXScgKS5jaGVja2JveHJhZGlvKCk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICAnZ290IGEgZmllbGQgc2V0JywgJGVsLmRhdGEoICdyZXN0VXJpJyApICk7XG4gICAgICAgICAgICAgICAgUmVzdGVzcXVlVXRpbC5zdWJzY3JpYmVXaXRoSW5pdGlhbEdldCggYXBwLndzQ2xpZW50LCAkZWwuZGF0YSggJ3Jlc3RVcmknICksIGZ1bmN0aW9uICggcGFja2V0ICkge1xuICAgICAgICAgICAgICAgICAgICByYWRpb0Vsc1xuICAgICAgICAgICAgICAgICAgICAgICAgLnByb3AoICdjaGVja2VkJywgZmFsc2UgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmNoZWNrYm94cmFkaW8oICdyZWZyZXNoJyApXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCAnaW5wdXRbdmFsdWU9XCInKyBwYWNrZXQuZ2V0Qm9keSgpICsnXCJdJyApXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXR0ciggJ2NoZWNrZWQnLCAnY2hlY2tlZCcgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmNoZWNrYm94cmFkaW8oICdyZWZyZXNoJyApXG4gICAgICAgICAgICAgICAgICAgICAgICAucGFyZW50KClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maW5kKCAnbGFiZWwnIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcyggJ3VpLXJhZGlvLW9mZicgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCAndWktcmFkaW8tb24nICk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIHJlc29sdmUoIGFwcCApO1xuICAgIH0pO1xufVxuXG4vLyBVdGlsc1xuLy8gPT09PT1cblxuLy8gRnVuY3Rpb25cbi8vIC0tLS0tLS0tXG4gICAgXG5mdW5jdGlvbiBvbmNlICggZm4gKSB7XG4gICAgdmFyIGhhc1RyaWdnZXJlZCA9IGZhbHNlO1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICggISBoYXNUcmlnZ2VyZWQgKSB7XG4gICAgICAgICAgICBmbigpO1xuICAgICAgICAgICAgaGFzVHJpZ2dlcmVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbi8vIFJlcG9ydGluZ1xuLy8gLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIHJlcG9ydCggc3RhdHVzLCBzdHIgKSB7XG4gICAgY29uc29sZS5sb2coICdbJywgc3RhdHVzLCAnXScsIFcucmVzdCggVy50b0FycmF5KCBhcmd1bWVudHMgKSApLmpvaW4oICcgJyApICk7XG59XG5cbmZ1bmN0aW9uIG1ha2VSZXBvcnRlciggc3RhdHVzLCBzdHIgKSB7XG4gICAgdmFyIHJlcG9ydEFyZ3MgPSBhcmd1bWVudHM7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmVwb3J0LmFwcGx5KCB0aGlzLCByZXBvcnRBcmdzICk7XG4gICAgICAgIHZhciBjYWxsZWVBcmdzID0gYXJndW1lbnRzO1xuICAgICAgICByZXR1cm4gVy5wcm9taXNlKCBmdW5jdGlvbiAoIHJlc29sdmUsIHJlamVjdCApIHtcbiAgICAgICAgICAgIHJlc29sdmUuYXBwbHkoIHRoaXMsIGNhbGxlZUFyZ3MgKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbn1cbiIsIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cblxuLy8gUHVudGVyIFZpelxuLy8gPT09PT09PT09PVxuLy8gQSB0aHJlZS5qcyB2aXN1bGlzYXRpb24gdG8gYmVcbi8vIHJ1biBvbiBhbiBIVEMgcGhvbmUgYW5kIGNhcnJpZWQgYnlcbi8vIHB1bnRlcnMgaW50byB0aGUgbWlycm9yIGJveC5cblxudmFyIFB1bnRlclZpeiA9IChmdW5jdGlvbiAoKSB7XG5cbiAgICAvLyBJbml0ICYgbWFrZVxuICAgIC8vID09PT09PT09PT09XG4gICAgZnVuY3Rpb24gbWFrZUFwcCAoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb250YWluZXJFbDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKSxcbiAgICAgICAgICAgIGJhY2tyb3VuZENvbG9yOiAweDYxNjI2NCxcbiAgICAgICAgICAgIHByZVJlbmRlckZuczogW10sXG4gICAgICAgICAgICBwcmVDdWJlQ2FtUmVuZGVyRm5zOiBbXSxcbiAgICAgICAgICAgIHBvc3RDdWJlQ2FtUmVuZGVyRm5zOiBbXVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHZhciBpbml0QXBwID0gVy5jb21wb3NlUHJvbWlzZXJzKCBtYWtlQ2FtZXJhU2NlbmVSZW5kZXJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFrZVdlYkNhbVRleHR1cmUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ha2VDdWJlQ2FtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWtlV2ViQ2FtQm94TWVzaCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFrZVN3YXJtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWtlTGlnaHRzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWtlUmVuZGVyTG9vcCApO1xuXG4gICAgLy8gUHJvbWlzZXJzXG4gICAgLy8gPT09PT09PT09XG5cbiAgICAvLyBDYW1lcmEsIFNjZW5lLCBSZW5kZXJlclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZnVuY3Rpb24gbWFrZUNhbWVyYVNjZW5lUmVuZGVyZXIgKCBhcHAgKSB7XG4gICAgICAgIHJldHVybiBXLnByb21pc2UoIGZ1bmN0aW9uICggcmVzb2x2ZSwgcmVqZWN0ICkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBDYW1lcmFcbiAgICAgICAgICAgIC8vIC0tLS0tLVxuICAgICAgICAgICAgYXBwLmNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSggNzAsIHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0LCAxLCAzMDAwICk7XG4gICAgICAgICAgICBzZXRDYW1lcmFQb3NpdGlvbiggYXBwLCAwLCAwLCAyMDAgKTtcblxuICAgICAgICAgICAgLy8gU2NlbmVcbiAgICAgICAgICAgIC8vIC0tLS0tXG4gICAgICAgICAgICBhcHAuc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcblxuICAgICAgICAgICAgLy8gUmVuZGVyZXJcbiAgICAgICAgICAgIC8vIC0tLS0tLS0tXG4gICAgICAgICAgICBhcHAucmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlciggeyBhbnRpYWxpYXM6IGZhbHNlIH0gKTtcblx0ICAgIGFwcC5yZW5kZXJlci5zZXRQaXhlbFJhdGlvKCB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyApO1xuXHQgICAgYXBwLnJlbmRlcmVyLnNldFNpemUoIHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQgKTtcbiAgICAgICAgICAgIGFwcC5yZW5kZXJlci5zZXRDbGVhckNvbG9yKCBhcHAuYmFja2dyb3VuZENvbG9yICk7XG5cdCAgICBhcHAucmVuZGVyZXIuc29ydE9iamVjdHMgPSBmYWxzZTtcblxuICAgICAgICAgICAgYXBwLmNvbnRhaW5lckVsLmFwcGVuZENoaWxkKCBhcHAucmVuZGVyZXIuZG9tRWxlbWVudCApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXNvbHZlKCBhcHAgKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gV2ViIENhbVxuICAgIC8vIC0tLS0tLS1cbiAgICAvLyBNYWtlIHRoZSB3ZWIgY2FtIGF2YWlsYWJsZSBhcyBhIHRleHR1cmVcbiAgICBmdW5jdGlvbiBtYWtlV2ViQ2FtVGV4dHVyZSAoIGFwcCApIHtcbiAgICAgICAgcmV0dXJuIFcucHJvbWlzZSggZnVuY3Rpb24gKCByZXNvbHZlLCByZWplY3QgKSB7XG5cbiAgICAgICAgICAgIC8vIFdlYiBDYW0gRE9NIEVsZW1lbnRcbiAgICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIHZhciB3ZWJDYW1FbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3ZpZGVvJyk7XG4gICAgICAgICAgICB3ZWJDYW1FbC5hdXRvcGxheSA9IHRydWU7XG5cbiAgICAgICAgICAgIC8vIFdlYiBDYW0gU3RyZWFtXG4gICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgbmF2aWdhdG9yLndlYmtpdEdldFVzZXJNZWRpYSggeyB2aWRlbzp0cnVlIH0sIGZ1bmN0aW9uKCBzdHJlYW0gKXtcbiAgICAgICAgICAgICAgICB3ZWJDYW1FbC5zcmMgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKCBzdHJlYW0gKTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCBlcnIgKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZhaWxlZCB0byBnZXQgYSBzdHJlYW0gZHVlIHRvXCIsIGVycik7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gV2ViIENhbSBUZXh0dXJlXG4gICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIGFwcC53ZWJDYW1UZXh0dXJlID0gbmV3IFRIUkVFLlRleHR1cmUoIHdlYkNhbUVsICk7XG4gICAgICAgICAgICBhcHAud2ViQ2FtVGV4dHVyZS5taW5GaWx0ZXIgPSBUSFJFRS5MaW5lYXJGaWx0ZXI7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIFJlbmRlciBVcGRhdGVzXG4gICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgYWRkUHJlUmVuZGVyRm4oIGFwcCwgZnVuY3Rpb24gKCBkZXRsYU1TLCB0aW1lc3RhbXBNUyApIHtcbiAgICAgICAgICAgICAgICBpZiggd2ViQ2FtRWwucmVhZHlTdGF0ZSA9PT0gd2ViQ2FtRWwuSEFWRV9FTk9VR0hfREFUQSApe1xuICAgICAgICAgICAgICAgICAgICBhcHAud2ViQ2FtVGV4dHVyZS5uZWVkc1VwZGF0ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJlc29sdmUoIGFwcCApO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBDdWJlIENhbWVyYVxuICAgIC8vIC0tLS0tLS0tLS0tXG4gICAgLy8gQ3JlYXRlIGEgY3ViZSBjYW0gZm9yIGEgZHluYW1pYyBlbnZNYXAuXG4gICAgLy8gVGhpcyBhbHNvIGVuYWJsZXMgdHdvIGhvb2tzOiBgcHJlQ3ViZUNhbVJlbmRlckFjdGlvbnNgICYgYHBvc3RDdWJlQ2FtUmVuZGVyQWN0aW9uc2BcbiAgICAvLyBpbiB0aGUgYXBwIGZvciB0aGF0IG9iamVjdDNEIGluIHRoZSBzY2VuZSBjYW4gYmUgdHVybmVkIG9uIGFuZCBvZmYgZHVyaW5nXG4gICAgLy8gdGhlIHdlYmNhbXMgcmVuZGVyXG4gICAgZnVuY3Rpb24gbWFrZUN1YmVDYW0gKCBhcHAgKSB7IFxuICAgICAgICByZXR1cm4gVy5wcm9taXNlKCBmdW5jdGlvbiAoIHJlc29sdmUsIHJlamVjdCApIHtcblxuICAgICAgICAgICAgYXBwLmN1YmVDYW1lcmEgPSBuZXcgVEhSRUUuQ3ViZUNhbWVyYSgxLCAzMDAwLCAyNTYpOyAvLyBuZWFyLCBmYXIsIHJlc29sdXRpb25cbiAgICAgICAgICAgIGFwcC5jdWJlQ2FtZXJhLnJlbmRlclRhcmdldC5taW5GaWx0ZXIgPSBUSFJFRS5MaW5lYXJNaXBNYXBMaW5lYXJGaWx0ZXI7IC8vIG1pcG1hcCBmaWx0ZXJcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgYWRkUHJlUmVuZGVyRm4oIGFwcCwgZnVuY3Rpb24gKCBkZWx0YU1TLCB0aW1lc3RhbXBNUyApIHsgICAgXG4gICAgICAgICAgICAgICAgLy8gUmVuZGVyIHRoZSBjdWJlIGNhbWVyYSB0byBjdWJlIG1hcFxuICAgICAgICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgICAgICBhcHAucHJlQ3ViZUNhbVJlbmRlckZucy5mb3JFYWNoKCBmbiA9PiBmbiggZGVsdGFNUywgdGltZXN0YW1wTVMgKSApO1xuICAgICAgICAgICAgICAgIGFwcC5jdWJlQ2FtZXJhLnVwZGF0ZUN1YmVNYXAoIGFwcC5yZW5kZXJlciwgYXBwLnNjZW5lICk7XG4gICAgICAgICAgICAgICAgYXBwLnBvc3RDdWJlQ2FtUmVuZGVyRm5zLmZvckVhY2goIGZuID0+IGZuKCBkZWx0YU1TLCB0aW1lc3RhbXBNUyApICk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmVzb2x2ZSggYXBwICk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFdlYiBDYW0gQm94IE1lc2hcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gQ3JlYXRlcyBhIGJveCB3aXRoIHRoZSB3ZWIgY2FtIGRpc3BsYXllZFxuICAgIC8vIG9uIHRoZSBpbnNpZGUgb2YgZWFjaCBvZiBpdCdzIDYgc2lkZXNcbiAgICBmdW5jdGlvbiBtYWtlV2ViQ2FtQm94TWVzaCAoIGFwcCApIHtcbiAgICAgICAgcmV0dXJuIFcucHJvbWlzZSggZnVuY3Rpb24gKCByZXNvbHZlLCByZWplY3QgKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciB3ZWJDYW1Cb3hNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7XG4gICAgICAgICAgICAgICAgbWFwOiBhcHAud2ViQ2FtVGV4dHVyZSxcbiAgICAgICAgICAgICAgICBjb2xvcjogMHhmZmZmZmYsXG5cdCAgICAgICAgc2lkZTogVEhSRUUuQmFja1NpZGVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBhcHAud2ViQ2FtdkJveE1lc2ggPSBuZXcgVEhSRUUuTWVzaCggbmV3IFRIUkVFLkJveEdlb21ldHJ5KCAyMDAwLCAyMDAwLCAyMDAwICksIHdlYkNhbUJveE1hdGVyaWFsICk7XG5cbiAgICAgICAgICAgIHZhciByb3RhdGlvblggPSBXLnJhbmRvbUJldHdlZW4oIDAuMDAwMiwgMC4wMDAwMiApO1xuICAgICAgICAgICAgdmFyIHJvdGF0aW9uWSA9IFcucmFuZG9tQmV0d2VlbiggMC4wMDAyLCAwLjAwMDAyICk7XG4gICAgICAgICAgICB2YXIgcm90YXRpb25aID0gVy5yYW5kb21CZXR3ZWVuKCAwLjAwMDIsIDAuMDAwMDIgKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gSWYgd2Ugd2FudCB0byByb3RhdGUgaXRcbiAgICAgICAgICAgIGFkZFByZVJlbmRlckZuKCBhcHAsIGZ1bmN0aW9uICggZGVsdGFNUywgdGltZXN0YW1wTVMgKSB7XG4gICAgICAgICAgICAgICAgYXBwLndlYkNhbXZCb3hNZXNoLnJvdGF0aW9uLnggKz0gKCBkZWx0YU1TICogcm90YXRpb25YICk7XG4gICAgICAgICAgICAgICAgYXBwLndlYkNhbXZCb3hNZXNoLnJvdGF0aW9uLnkgKz0gKCBkZWx0YU1TICogcm90YXRpb25ZICk7XG4gICAgICAgICAgICAgICAgYXBwLndlYkNhbXZCb3hNZXNoLnJvdGF0aW9uLnogKz0gKCBkZWx0YU1TICogcm90YXRpb25aICk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuXHQgICAgYXBwLnNjZW5lLmFkZCggYXBwLndlYkNhbXZCb3hNZXNoICk7XG5cbiAgICAgICAgICAgIC8vIFNob3cgaXQgb25seSBmb3IgdGhlIGN1YmUgY2FtXG4gICAgICAgICAgICBhcHAucHJlQ3ViZUNhbVJlbmRlckZucy5wdXNoKCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgYXBwLndlYkNhbXZCb3hNZXNoLnZpc2libGUgPSB0cnVlO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGFwcC5wb3N0Q3ViZUNhbVJlbmRlckZucy5wdXNoKCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgYXBwLndlYkNhbXZCb3hNZXNoLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBcblxuICAgICAgICAgICAgcmVzb2x2ZSggYXBwICk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIExpZ2h0c1xuICAgIC8vIC0tLS0tLVxuICAgIGZ1bmN0aW9uIG1ha2VMaWdodHMgKCBhcHAgKSB7XG4gICAgICAgIHJldHVybiBXLnByb21pc2UoIGZ1bmN0aW9uICggcmVzb2x2ZSwgcmVqZWN0ICkge1xuICAgICAgICAgICAgYXBwLnNjZW5lLmFkZCggbmV3IFRIUkVFLkFtYmllbnRMaWdodCggMHgyMjIyMjIgKSApO1xuXG4gICAgICAgICAgICB2YXIgZGlyZWN0aW9uYWxMaWdodCA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KCAweGZmZmZmZiwgMiApO1xuXHQgICAgZGlyZWN0aW9uYWxMaWdodC5wb3NpdGlvbi5zZXQoIDIsIDEuMiwgMTAgKS5ub3JtYWxpemUoKTtcblx0ICAgIGFwcC5zY2VuZS5hZGQoIGRpcmVjdGlvbmFsTGlnaHQgKTtcblxuXHQgICAgZGlyZWN0aW9uYWxMaWdodCA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KCAweGZmZmZmZiwgMSApO1xuXHQgICAgZGlyZWN0aW9uYWxMaWdodC5wb3NpdGlvbi5zZXQoIC0yLCAxLjIsIC0xMCApLm5vcm1hbGl6ZSgpO1xuXHQgICAgYXBwLnNjZW5lLmFkZCggZGlyZWN0aW9uYWxMaWdodCApOyAgXG4gICAgICAgICAgICByZXNvbHZlKCBhcHAgKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gU3dhcm1cbiAgICAvLyAtLS0tLVxuICAgIGZ1bmN0aW9uIG1ha2VTd2FybSAoIGFwcCApIHtcbiAgICAgICAgcmV0dXJuIFcucHJvbWlzZSggZnVuY3Rpb24gKCByZXNvbHZlLCByZWplY3QgKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBwYXJ0aWNsZXMgPSBbXTtcblxuICAgICAgICAgICAgLy8gQWRkIHRvIFNjZW5lXG4gICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIGFwcC5zd2FybU9iamVjdDNEID0gbmV3IFRIUkVFLk9iamVjdDNEKCk7XG4gICAgICAgICAgICBhcHAuc2NlbmUuYWRkKCBhcHAuc3dhcm1PYmplY3QzRCApO1xuICAgICAgICAgICAgYXBwLnByZUN1YmVDYW1SZW5kZXJGbnMucHVzaCggZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGFwcC5zd2FybU9iamVjdDNELnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYXBwLnBvc3RDdWJlQ2FtUmVuZGVyRm5zLnB1c2goIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBhcHAuc3dhcm1PYmplY3QzRC52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBMb2FkZXJcbiAgICAgICAgICAgIC8vIC0tLS0tLVxuICAgICAgICAgICAgdmFyIGxvYWRlciA9IG5ldyBUSFJFRS5PQkpMb2FkZXIoKTtcbiAgICAgICAgICAgIGxvYWRlci5sb2FkKCAnL29iai9waWxsb3ctYm94Lm9iaicsIG9uT2JqTG9hZGVkICk7XG5cbiAgICAgICAgICAgIC8vIFN3YXJtIENyZWF0aW9uXG4gICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICBmdW5jdGlvbiBvbk9iakxvYWRlZCAoIG9iaiApIHtcblxuICAgICAgICAgICAgICAgIHZhciBtZXNoID0gb2JqLmNoaWxkcmVuWyAwIF07XG5cbiAgICAgICAgICAgICAgICAvLyBQYXJ0aWNsZSBDcmVhdGlvblxuICAgICAgICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAgICAgLy8gRWFzZSBpbiB0aGUgY3JlYXRpb24gb2YgdGhlIHBhcnRpY2xlc1xuICAgICAgICAgICAgICAgIHZhciBtYXhQYXJ0aWNsZXMgPSAxMDA7XG4gICAgICAgICAgICAgICAgdmFyIG1pbkNyZWF0aW9uVGltZSA9IDU7XG4gICAgICAgICAgICAgICAgdmFyIG1heENyZWF0aW9uVGltZU1TID0gMTAwO1xuXG4gICAgICAgICAgICAgICAgdmFyIG1hdGVyaWFsID0gXG4gICAgICAgICAgICAgICAgKGZ1bmN0aW9uIGNyZWF0ZU1vcmUgKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIHBhcnRpY2xlcy5sZW5ndGggPCBtYXhQYXJ0aWNsZXMgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGFydGljbGUgPSBuZXcgUGFydGljbGUoIG1lc2ggKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcC5zd2FybU9iamVjdDNELmFkZCggcGFydGljbGUuYW5jaG9yICk7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZXMucHVzaCggcGFydGljbGUgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoIGNyZWF0ZU1vcmUsIFcubWFwKCBwYXJ0aWNsZXMubGVuZ3RoIC8gbWF4UGFydGljbGVzLCAwLCAxLCBtYXhDcmVhdGlvblRpbWVNUywgbWluQ3JlYXRpb25UaW1lLCBXLmludGVycG9sYXRpb25zLmVhc2VJbiApICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBVcGRhdGluZ1xuICAgICAgICAgICAgYWRkUHJlUmVuZGVyRm4oIGFwcCwgZnVuY3Rpb24gKCBkZWx0YU1TLCB0aW1lc3RhbXBNUyApIHtcbiAgICAgICAgICAgICAgICBwYXJ0aWNsZXMuZm9yRWFjaCggcGFydGljbGUgPT4gcGFydGljbGUudXBkYXRlKCBkZWx0YU1TLCB0aW1lc3RhbXBNUyApICk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gUGFydGljbGUgQ2xhc3NcbiAgICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICBmdW5jdGlvbiBQYXJ0aWNsZSAoIG1lc2ggKSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnZlbG9jaXR5ID0gVy5yYW5kb21CZXR3ZWVuKCAwLjIsIDEgKTtcblxuICAgICAgICAgICAgICAgIC8vIE1lc2hcbiAgICAgICAgICAgICAgICB0aGlzLm1lc2ggPSBtZXNoLmNsb25lKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5tZXNoLm1hdGVyaWFsID0gUGFydGljbGUubWF0ZXJpYWwuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICB0aGlzLm1lc2guc2NhbGUueCA9IFBhcnRpY2xlLmluaXRpYWxTY2FsZTtcbiAgICAgICAgICAgICAgICB0aGlzLm1lc2guc2NhbGUueSA9IFBhcnRpY2xlLmluaXRpYWxTY2FsZTtcbiAgICAgICAgICAgICAgICB0aGlzLm1lc2guc2NhbGUueiA9IFBhcnRpY2xlLmluaXRpYWxTY2FsZTtcblxuICAgICAgICAgICAgICAgIC8vIFBvc2l0aW9uXG4gICAgICAgICAgICAgICAgdmFyIHJhbmdlID0gMTAwO1xuICAgICAgICAgICAgICAgIHRoaXMubWVzaC5wb3NpdGlvbi5zZXQoICggTWF0aC5yYW5kb20oKSAtIDAuNSApICogcmFuZ2UsICggTWF0aC5yYW5kb20oKSAtIDAuNSApICogcmFuZ2UsICggTWF0aC5yYW5kb20oKSAtIDAuNSApICogcmFuZ2UgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdGhpcy5hbmNob3IgPSBuZXcgVEhSRUUuT2JqZWN0M0QoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFuY2hvci5hZGQoIHRoaXMubWVzaCApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyAjIyMgU3RhdGljXG4gICAgICAgICAgICBQYXJ0aWNsZS5tYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCgge1xuXHRcdGNvbG9yOiAweGZmZmZmZixcblx0XHRzaGluaW5lc3M6IDAuMCxcblx0XHRzcGVjdWxhcjogMHhmZmZmZmYsXG5cdFx0ZW52TWFwOiBhcHAuY3ViZUNhbWVyYS5yZW5kZXJUYXJnZXQsXG4gICAgICAgICAgICAgICAgcmVmbGVjdGl2aXR5OiAxLjAsXG4gICAgICAgICAgICAgICAgc2lkZTogVEhSRUUuRG91YmxlU2lkZVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIFBhcnRpY2xlLmluaXRpYWxTY2FsZSA9IDIwMDtcblxuICAgICAgICAgICAgLy8gIyMjIE1ldGhvZFxuICAgICAgICAgICAgUGFydGljbGUucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uICggZGVsdGFNUywgdGltZXN0YW1wTVMgKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hbmNob3Iucm90YXRpb24ueCArPSAwLjAwMjtcbiAgICAgICAgICAgICAgICB0aGlzLmFuY2hvci5yb3RhdGlvbi55ICs9IHRoaXMudmVsb2NpdHkgLyAxMDtcbiAgICAgICAgICAgICAgICB0aGlzLmFuY2hvci5yb3RhdGlvbi56ICs9IDAuMDAxO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmVzb2x2ZSggYXBwICk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFJlbmRlciBMb29wXG4gICAgLy8gLS0tLS0tLS0tLS1cbiAgICBmdW5jdGlvbiBtYWtlUmVuZGVyTG9vcCAoIGFwcCApIHtcbiAgICAgICAgcmV0dXJuIFcucHJvbWlzZSggZnVuY3Rpb24gKCByZXNvbHZlLCByZWplY3QgKSB7XG5cbiAgICAgICAgICAgIHZhciBsYXN0VGltZXN0YW1wTVMgPSAwO1xuICAgICAgICAgICAgdmFyIGRlbHRhTVMgPSAwO1xuXG4gICAgICAgICAgICAoZnVuY3Rpb24gIGxvb3AgKCBjdXJyZW50VGltZXN0YW1wTVMgKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gUmVjdXJcbiAgICAgICAgICAgICAgICAvLyAtLS0tLVxuICAgICAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIGxvb3AgKTtcblxuICAgICAgICAgICAgICAgIC8vIFVwZGF0ZSB0aW1lc3RhbXBzXG4gICAgICAgICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAgICAgZGVsdGFNUyA9IGN1cnJlbnRUaW1lc3RhbXBNUyAtIGxhc3RUaW1lc3RhbXBNUztcbiAgICAgICAgICAgICAgICBsYXN0VGltZXN0YW1wTVMgPSBjdXJyZW50VGltZXN0YW1wTVM7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gQWN0aW9uYWJsZXNcbiAgICAgICAgICAgICAgICAvLyAtLS0tLS0tLS0tLVxuICAgICAgICAgICAgICAgIGFwcC5wcmVSZW5kZXJGbnMuZm9yRWFjaCggZm4gPT4gZm4oIGRlbHRhTVMsIGN1cnJlbnRUaW1lc3RhbXBNUyApICk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gUmVuZGVyXG4gICAgICAgICAgICAgICAgLy8gLS0tLS0tXG4gICAgICAgICAgICAgICAgYXBwLnJlbmRlcmVyLmNsZWFyKCk7XG5cdFx0YXBwLnJlbmRlcmVyLnJlbmRlciggYXBwLnNjZW5lLCBhcHAuY2FtZXJhICk7XG5cbiAgICAgICAgICAgIH0oIGxhc3RUaW1lc3RhbXBNUyApKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmVzb2x2ZSggYXBwICk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgLy8gVXRpbHNcbiAgICAvLyA9PT09PVxuXG4gICAgLy8gUmVuZGVyIExvb3BcbiAgICAvLyAtLS0tLS0tLS0tLVxuICAgIGZ1bmN0aW9uIGFkZFByZVJlbmRlckZuICggYXBwLCBmbiApIHtcbiAgICAgICAgYXBwLnByZVJlbmRlckZucy5wdXNoKCBmbiApO1xuICAgIH1cblxuICAgIC8vIENhbWVyYVxuICAgIC8vIC0tLS0tLVxuICAgIGZ1bmN0aW9uIHNldENhbWVyYVBvc2l0aW9uICggYXBwLCB4LCB5LCB6ICkge1xuICAgICAgICBhcHAuY2FtZXJhLnBvc2l0aW9uLnggPSB4O1xuICAgICAgICBhcHAuY2FtZXJhLnBvc2l0aW9uLnkgPSB5O1xuICAgICAgICBhcHAuY2FtZXJhLnBvc2l0aW9uLnogPSB6O1xuICAgIH1cbiBcbiAgICAvLyBFeHBvcnRcbiAgICAvLyA9PT09PT0gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgICAgbWFrZUFwcDogbWFrZUFwcCxcbiAgICAgICAgaW5pdEFwcDogaW5pdEFwcCAgXG4gICAgfTtcbiAgICBcbn0oKSk7XG5cblxuXG5cblxuXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=