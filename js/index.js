import {
	zoomToLayer,
	fillHTMLWithPickingInfo,
} from './OGC3DTilesHelper.js';


// ---------- CREATE THE VIEW: ----------

const placement = {
	coord: new itowns.Coordinates('EPSG:4326', 2.351323, 48.856712),
	range: 25000000,
}
const viewContainer = document.getElementById('viewerDiv');
const view = new itowns.GlobeView(viewContainer, placement);


// ---------- DISPLAY A MAP: ----------

itowns.Fetcher.json('./layers/OPENSM.json').then(function (config) {
	config.source = new itowns.TMSSource(config.source);
	const mapLayer = new itowns.ColorLayer('Map', config);
	view.addLayer(mapLayer);
});




// ---------- DISPLAY 3D Tiles: ----------


const gui = new dat.GUI();


itowns.enableDracoLoader('./libs/draco/');
itowns.enableKtx2Loader('./lib/basis/', view.renderer);


const light = new itowns.THREE.AmbientLight(0x404040, 40);
view.scene.add(light);


function readURL() {
	const url = document.getElementById('url').value;

	if (url) {
		addTileset(url);
	}
}


function addTileset(url) {
	const tilesSource = new itowns.OGC3DTilesSource({
		url,
	});

	const tilesLayer = new itowns.OGC3DTilesLayer(
		'3d-tiles',
		{
			source: tilesSource,
		},
	);

	const pickingArgs = {
		htmlDiv: document.getElementById('featureInfo'),
		view,
		layer: tilesLayer,
	};

	view.addLayer(tilesLayer).then(
		(layer) => {
			zoomToLayer(view, layer);
			window.addEventListener(
				'click',
				(event) => fillHTMLWithPickingInfo(event, pickingArgs),
				false,
			);
		},
	);

	tilesLayer.whenReady.then(
		() => debug.createOGC3DTilesDebugUI(gui, view, tilesLayer)
	);
}


document.getElementById('read-url').onclick = readURL;
// form.addEventListener(
// 	'submit',
// 	(event) => {
// 		event.preventDefault();
// 		const formData = new FormData(form);
// 		const url = formData.get('source-url');
//
// 		addTileset(url);
//
// 		document.getElementById('source-information').classList.remove('hidden');
// 		const info = document.createElement('li');
// 		info.innerHTML = `${url}`;
// 		document.getElementById('source-list').appendChild(info);
// 	},
// );

