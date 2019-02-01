$(document).ready(function () {

	// проверка на нажатие мыши

	// залив картинок в массив
	var images = [];
	var carouselImg = $('.carousel__webgl');
	for (var i = 0; i < carouselImg.length; i++) {
		image = carouselImg[i].currentSrc;
		images.push(image);
	}

	function webglIt(id, image) {

		//инициализация
		init(id, image);
		animate();

		var camera, scene, renderer;

		// возможно какой-то UI?
		var isUserInteracting = false,
			onMouseDownMouseX = 0, onMouseDownMouseY = 0,
			lon = 0, onMouseDownLon = 0,
			lat = 0, onMouseDowxnLat = 0,
			phi = 0, theta = 0;

		var mouseDown = false;
		// функция проверки нажатия мыши.
		document.getElementById(id).onmousedown = function () {
			mouseDown = true;
		}
		document.getElementById(id).onmouseup = function () {
			mouseDown = false;
		}
		document.getElementById(id).onmouseout = function () {
			mouseDown = false;
		}





		// функция инициализции
		function init(id, image) {

			var container, mesh;
			var canvasWidth = $("#" + id).parent().width();
			var canvasHeigth = $("#" + id).parent().height();

			container = document.getElementById(id);

			//создание камеры
			camera = new THREE.PerspectiveCamera(75, canvasWidth / canvasHeigth, 1, 1100);
			camera.target = new THREE.Vector3(0, 0, 0);

			scene = new THREE.Scene();

			var geometry = new THREE.SphereGeometry(500, 60, 40);
			geometry.scale(- 1, 1, 1);

			var material = new THREE.MeshBasicMaterial({
				map: new THREE.TextureLoader().load(image),
			});

			mesh = new THREE.Mesh(geometry, material);

			scene.add(mesh);

			renderer = new THREE.WebGLRenderer();
			renderer.setPixelRatio(window.devicePixelRatio);


			renderer.setSize(canvasWidth, canvasHeigth);
			container.appendChild(renderer.domElement);

			document.addEventListener('mousedown', onDocumentMouseDown, false);
			document.addEventListener('mousemove', onDocumentMouseMove, false);
			document.addEventListener('mouseup', onDocumentMouseUp, false);
			//document.addEventListener('wheel', onDocumentMouseWheel, false);

			//

			document.addEventListener('dragover', function (event) {

				event.preventDefault();
				event.dataTransfer.dropEffect = 'copy';

			}, false);

			document.addEventListener('dragenter', function (event) {

				document.body.style.opacity = 0.5;

			}, false);

			document.addEventListener('dragleave', function (event) {

				document.body.style.opacity = 1;

			}, false);



			document.addEventListener('drop', function (event) {

				event.preventDefault();

				var reader = new FileReader();
				reader.addEventListener('load', function (event) {

					material.map.image.src = event.target.result;
					material.map.needsUpdate = true;
				}, false);
				reader.readAsDataURL(event.dataTransfer.files[0]);

				document.body.style.opacity = 1;

			}, false);

			//

			window.addEventListener('resize', onWindowResize, false);

		}

		function onWindowResize() {
			var canvasWidth = $("#" + id).parent().width();
			var canvasHeigth = $("#" + id).parent().height();
			camera.aspect = canvasWidth / canvasHeigth;
			camera.updateProjectionMatrix();

			renderer.setSize(canvasWidth, canvasHeigth);

		}

		function onDocumentMouseDown(event) {

			event.preventDefault();

			isUserInteracting = true;

			onPointerDownPointerX = event.clientX;
			onPointerDownPointerY = event.clientY;

			onPointerDownLon = lon;
			onPointerDownLat = lat;

		}

		function onDocumentMouseMove(event) {

			if (isUserInteracting === true) {

				lon = (onPointerDownPointerX - event.clientX) * 0.1 + onPointerDownLon;
				lat = (event.clientY - onPointerDownPointerY) * 0.1 + onPointerDownLat;

			}

		}

		function onDocumentMouseUp(event) {
			isUserInteracting = false;
		}

		function onDocumentMouseWheel(event) {
			camera.fov += event.deltaY * 0.05;
			camera.updateProjectionMatrix();
		}

		function animate() {

			requestAnimationFrame(animate);
			update();

		}


		function update() {

			if (isUserInteracting === false) {

				lon += 0.1;

			}

			lat = Math.max(- 85, Math.min(85, lat));
			phi = THREE.Math.degToRad(90 - lat);
			theta = THREE.Math.degToRad(lon);

			camera.target.x = 200 * Math.sin(phi) * Math.cos(theta);
			camera.target.y = 200 * Math.cos(phi);
			camera.target.z = 200 * Math.sin(phi) * Math.sin(theta);


			// восстановление позиции камеры
			if ((lat < -0.1) && (!mouseDown)) {
				lat += 0.1;
			} else if ((lat > 0.1) && (!mouseDown)) {
				lat -= 0.1;
			}



			camera.lookAt(camera.target);


			// distortion
			//camera.position.copy(camera.target).negate();


			renderer.render(scene, camera);

		}

	}

	//отрисовка
	for (var i = 0; i < images.length; i++) {
		webglIt('container-' + i, images[i]);
	}

	$('.slick-test').slick({
		dots: true,
		swipe: false,
	});


});