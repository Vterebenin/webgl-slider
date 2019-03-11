$(document).ready(function () {

	// нашел такой пример на stackoverflow 
	// https://stackoverflow.com/questions/35575065/how-to-make-a-loading-screen-in-three-js

	// в примере сделан прогресс бар, но можно сделать что-либо еще.
	// внимательно почитай документацию на https://threejs.org/docs/?q=loading#api/en/loaders/managers/LoadingManager
	
	// суть: создаем какой-то элемент на странице(допустим div с прогресс баром)
	var progress = document.createElement('div');
	var progressBar = document.createElement('div');

	// закидываем их на страницу
	progress.appendChild(progressBar);
	document.body.appendChild(progress);


	
	// создается manager загрузок, который тречит всю активность загрузок
	// в моем примере с гитхаба грузится 4 текстуры через функцию textureLoader 
	// поэтому в параметры этой функции(textureLoader) суем этого manager'а, чтобы ему было за чем следить
	var manager = new THREE.LoadingManager();
	manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
		// здесь добавляем код, который срабатывает в начале загрузки (до 0%)
		// я вывожу комментарий и скрываю слайдер (условно можно еще показывать прелоадер)
		console.log( 'Начал загружать файлы: ' + url + '.\nЗагружено ' + itemsLoaded + ' из ' + itemsTotal + ' файлов.' );
		$(".b-main").css({
			"display": "none",
		})
	};
	manager.onProgress = function (item, loaded, total) {
		// я сделал невидимый прогресс бар в конце страницы с гитхаба
		// всего 4 текстуры значит отрезок будет грузиться как 25%-50%-75%-100%
		// !!!эти две строчки заменить на то, как будет изменяться прелоадер!!!
		progressBar.style.width = (loaded / total * 100) + '%';
		console.log(progressBar.style.width)
	};
	manager.onLoad = function ( ) {
		// здесь при необходимости добавляем код, который выполняется по окончании загрузки (после 100%)
		// опять же комментарий и показываем уже слайдер. 
		//Стоит здесь так же написать код скрывания прелоадера
		console.log( 'Загрузилось!');	
		$(".b-main").css({
			"display": "block",
		})
	};
	




	// проверка на нажатие мыши

	// залив соурса картинок в массив
	var images = [];
	// TODO: динамически выбираем класс?
	var carouselImg = $('.carousel__webgl');
	for (var i = 0; i < carouselImg.length; i++) {
		image = carouselImg[i].currentSrc;
		images.push(image);
	}


	// в параметры передаем айдишник контейнера и соурс иозбражения. 
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
			isUserInteracting = false;
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
				// НЕ ЗАБЫТЬ ПОСТАВИТЬ ЗДЕСЬ manager'а!!!!!!!!!!!!!
				map: new THREE.TextureLoader(manager).load(image),
			});

			mesh = new THREE.Mesh(geometry, material);

			scene.add(mesh);

			renderer = new THREE.WebGLRenderer();
			renderer.setPixelRatio(window.devicePixelRatio);


			renderer.setSize(canvasWidth, canvasHeigth);
			container.appendChild(renderer.domElement);

			document.getElementById(id).addEventListener('mousedown', onDocumentMouseDown, false);
			document.getElementById(id).addEventListener('mousemove', onDocumentMouseMove, false);
			document.getElementById(id).addEventListener('mouseup', onDocumentMouseUp, false);
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

			//window.addEventListener('resize', onWindowResize, false);

		}

		//function onWindowResize() {
		//	var canvasWidth = $("#" + id).parent().width();
		//	var canvasHeigth = $("#" + id).parent().height();
		//	camera.aspect = canvasWidth / canvasHeigth;
		//	camera.updateProjectionMatrix();

		//	renderer.setSize(canvasWidth, canvasHeigth);

		//}

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