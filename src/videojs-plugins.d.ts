declare module '@silvermine/videojs-chromecast' {
	import type videojs from 'video.js';
	function chromecastPlugin(vjs: typeof videojs): void;
	export default chromecastPlugin;
}

declare module '@silvermine/videojs-airplay' {
	import type videojs from 'video.js';
	function airPlayPlugin(vjs: typeof videojs): void;
	export default airPlayPlugin;
}
