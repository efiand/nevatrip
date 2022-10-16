import data from 'gulp-data';
import { deleteAsync } from 'del';
import gulp from 'gulp';
import gulpIf from 'gulp-if';
import posthtml from 'gulp-posthtml';
import server from 'browser-sync';
import twig from 'gulp-twig';

const { dest, parallel, series, src, watch } = gulp;
const IS_DEV = process.env.NODE_ENV === 'development';

const processPages = (testOnly = false) =>
	src('src/twig/pages/**/*.twig')
		.pipe(
			data(async ({ path }) => {
				const page = path
					.replace(/^.*pages(\\+|\/+)(.*)\.twig$/, '$2')
					.replace(/\\/g, '/');

				const data = (await import(`./src/data/${page}.js?${new Date()}`)).default;
				console.log(data);

				return { ...data, IS_DEV, page };
			})
		)
		.pipe(twig())
		.pipe(posthtml())
		.pipe(gulpIf(!testOnly, dest('dist')));
const buildPages = async (done) => {
	await processPages();
	done();
};
const testPages = async (done) => {
	await processPages(true);
	done();
};

const clean = async (done) => {
	await deleteAsync('dist');
	done();
};

export const reload = (done) => {
	server.reload();
	done();
};

export const startServer = (done) => {
	server.init({
		cors: true,
		open: false,
		server: 'dist',
		ui: false
	});

	watch('src/{data,twig}/**/*.{js,twig}', series(buildPages, reload));

	done();
};

export const build = series(clean, buildPages);
export const test = series(testPages);
export default series(build, startServer);
