var studiorichter = window.studiorichter || {};
studiorichter.quattromori = window.studiorichter.quattromori || {};

window.addEventListener('DOMContentLoaded', function(e) {
	mapboxgl.accessToken = 'pk.eyJ1Ijoib2VsbmEiLCJhIjoiY2s0OHNyZnd0MDNmNzNubWg1eTNjN3RybiJ9.LfClyNatWxI4OkfvD3SlCg';

	studiorichter.quattromori.coordinates = [8.468239, 49.476551];

	studiorichter.quattromori.map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/mapbox/streets-v11',
		center: studiorichter.quattromori.coordinates,
		zoom: 14
	});

	studiorichter.quattromori.map.on('load', function() {

		studiorichter.quattromori.map.addControl(new mapboxgl.NavigationControl());

		const el = document.createElement('div');
		el.classList.add('marker');
		el.setAttribute('title', 'Jetzt anrufen');
		el.addEventListener('click', function(e) {
			e.preventDefault();

			studiorichter.quattromori.callNumber('+49621827546');
		});

		// make a marker for each feature and add to the map
		new mapboxgl.Marker(el).setLngLat(studiorichter.quattromori.coordinates).addTo(studiorichter.quattromori.map);
	});

	document.querySelectorAll('.notification').forEach(function (ele, i) {
		const start = ele.dataset.startdate;
		const end = ele.dataset.enddate;

		const startdate = (start.length > 0) ? Date.parse(start) : false;
		const enddate = (end.length > 0) ? Date.parse(end) : false;

		const now = Date.now();

		if (now > startdate && now < enddate) {
			ele.classList.remove('hidden');
		}
	});

	studiorichter.quattromori.callNumber = function(number) {
		if (!number) return;

		if (window.confirm("Jetzt anrufen?\n(Bitte beachten Sie: wir liefern nicht nach Hause! Nur Abholung möglich.)")) { 
			window.open('tel:'+number, '_self');
		}
	}

	document.querySelector('[href*=tel]').addEventListener('click', function(e) {
		e.preventDefault();
		let href = e.target.getAttribute('href');

		studiorichter.quattromori.callNumber(href.replace('tel:', ''));
	});
	

	studiorichter.quattromori.toggleHiddenText = function(ele) {
		let hiddenText = ele.parentNode.parentNode.querySelector('.text');
		hiddenText.classList.toggle('hidden');

		if (!hiddenText.classList.contains('hidden')) {
			ele.textContent = ele.textContent.replace('einblenden', 'ausblenden');
		} else {
			ele.textContent = ele.textContent.replace('ausblenden', 'einblenden');
		}
	}

	document.querySelector('#imprint a:first-of-type').addEventListener('click', function(e) {
		e.preventDefault();
		studiorichter.quattromori.toggleHiddenText(this);
	});

	document.querySelector('#privacypolicy a:first-of-type').addEventListener('click', function(e) {
		e.preventDefault();
		studiorichter.quattromori.toggleHiddenText(this);
	});

	// notification persistence
	if (localStorage.getItem('notification-covid19') == 'hide') {
		document.querySelector('#covid-19 .body').classList.add('hidden');
		document.querySelector('#covid-19 .toggle').textContent = 'Anzeigen';
	}

	if (document.querySelector('.toggle')) {
		document.querySelector('.toggle').addEventListener('click', function() {
			console.log(this.closest('.notification').querySelector('.body'));

			if (this.closest('.notification').querySelector('.body').classList.contains('hidden')) {
				this.closest('.notification').querySelector('.body').classList.remove('hidden');
				localStorage.setItem('notification-covid19', 'show');
				this.textContent = 'Ausblenden';
			} else {
				this.closest('.notification').querySelector('.body').classList.add('hidden');
				localStorage.setItem('notification-covid19', 'hide');
				this.textContent = 'Anzeigen';
			}

			this.blur();		
		});
	}
});