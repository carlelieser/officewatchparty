import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type ProxyOptions } from 'vite';

const PROD_ORIGIN = 'https://officewatchparty.com';

// The /thumb and /video routes are backed by the R2 binding, which only exists
// under wrangler/production. In local Vite dev, proxy them to the deployed site
// (which serves from R2) so media works. Local session cookies and origin
// headers trip Cloudflare's edge protection, so present the request as a plain
// same-origin media load. The query string (the signed-URL signature) and the
// Range header pass through untouched, so signed video + seeking both work.
function r2Proxy(): ProxyOptions {
	return {
		target: PROD_ORIGIN,
		changeOrigin: true,
		configure: (proxy) => {
			proxy.on('proxyReq', (proxyReq) => {
				proxyReq.removeHeader('cookie');
				proxyReq.removeHeader('origin');
				proxyReq.setHeader('referer', `${PROD_ORIGIN}/`);
			});
		}
	};
}

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	define: {
		__APP_VERSION__: JSON.stringify(process.env.npm_package_version)
	},
	server: {
		proxy: {
			'/thumb': r2Proxy(),
			'/video': r2Proxy()
		}
	}
});
