import bundleScripts from 'gulp-esbuild';
import createAutoprefixes from 'autoprefixer';
import createHtml from 'gulp-twig';
import { deleteAsync } from 'del';
import eslint from 'gulp-eslint';
import getData from 'gulp-data';
import gulp from 'gulp';
import lessSyntax from 'postcss-less';
import lintspaces from 'gulp-lintspaces';
import minifyCss from 'cssnano';
import minifySvg from 'gulp-svgmin';
import preprocessLess from 'gulp-less';
import processHtml from 'gulp-posthtml';
import processImages from 'gulp-libsquoosh';
import processPostcss from 'gulp-postcss';
import processStylelint from 'stylelint';
import processSvelte from 'esbuild-svelte';
import reportStylelint from 'postcss-reporter';
import server from 'browser-sync';
import sortMediaQueries from 'postcss-sort-media-queries';
import { stacksvg } from 'gulp-stacksvg';
import useCondition from 'gulp-if';
import validateBem from 'gulp-html-bemlinter';

const { dest, parallel, series, src, watch } = gulp;
const devMode = process.env.NODE_ENV === 'development';
const lintMode = Boolean(process.env.LINT);

const Path = {
	DEST: 'build',
	EDITORCONFIG: ['src/**/*.{js,less,twig,svg}', '*.{js,json}'],
	ICONS: 'src/icons/**/*.svg',
	Images: {
		DEST: 'build/images',
		RASTERS: ['src/images/**/*.{jpg,png}', 'src/pixelperfect/**/*.{jpg,png}']
	},
	Layouts: {
		ALL: 'src/{data,layouts}/**/*.{js,twig}',
		ENTRIES: 'src/layouts/pages/**/*.twig'
	},
	STATIC: 'src/static/**',
	Scripts: {
		ALL: ['src/scripts/**/*.{js,svelte}', '*.js'],
		DEST: 'build/scripts',
		ENTRIES: ['src/scripts/*.js']
	},
	Styles: {
		ALL: 'src/styles/**/*.less',
		DEST: 'build/styles',
		ENTRIES: 'src/styles/*.less'
	}
};
const postcssPlugins = [sortMediaQueries(), createAutoprefixes()];

// Изменение настроек в production-режиме
if (!devMode) {
	Path.Scripts.ENTRIES.push('!src/scripts/dev.js');
	Path.Images.RASTERS.pop();

	postcssPlugins.push(
		minifyCss({
			preset: ['default', { cssDeclarationSorter: false }]
		})
	);
}

// Задача обработки HTML
const processLayouts = () =>
	src(Path.Layouts.ENTRIES)
		.pipe(
			getData(async ({ path }) => {
				const page = path
					.replace(/^.*pages(\\+|\/+)(.*)\.twig$/, '$2')
					.replace(/\\/g, '/');
				const versionId = new Date();

				const data = await import(`./src/data/${page}.js?${versionId}`);
				return {
					...data.default,
					devMode,
					page,
					version: devMode ? `?${versionId}` : ''
				};
			})
		)
		.pipe(createHtml())
		.pipe(processHtml())
		.pipe(validateBem())
		.pipe(useCondition(!lintMode, dest(Path.DEST)));

// Задачи сборки

const buildStyles = () =>
	src(Path.Styles.ENTRIES)
		.pipe(preprocessLess())
		.pipe(processPostcss(postcssPlugins))
		.pipe(dest(Path.Styles.DEST));

const buildScripts = () =>
	src(Path.Scripts.ENTRIES)
		.pipe(
			bundleScripts({
				bundle: true,
				minify: !devMode,
				plugins: [processSvelte()]
			})
		)
		.pipe(dest(Path.Scripts.DEST));

const buildWebp = () =>
	src(Path.Images.RASTERS)
		.pipe(processImages({ webp: { quality: 75 } }))
		.pipe(dest(Path.Images.DEST));

const buildSprite = () =>
	src(Path.ICONS)
		.pipe(useCondition(!devMode, minifySvg()))
		.pipe(stacksvg({ output: 'icons' }))
		.pipe(dest(Path.Images.DEST));

const copyStatic = () => src(Path.STATIC).pipe(dest(Path.DEST));

// Задачи линтинга

const lintEditorconfig = () =>
	src(Path.EDITORCONFIG)
		.pipe(lintspaces({ editorconfig: '.editorconfig' }))
		.pipe(lintspaces.reporter({ breakOnWarning: !devMode }));

const lintStyles = () =>
	src(Path.Styles.ALL).pipe(
		processPostcss(
			[
				processStylelint(),
				reportStylelint({
					clearAllMessages: true,
					throwError: !devMode
				})
			],
			{ syntax: lessSyntax }
		)
	);

const lintScripts = () =>
	src(Path.Scripts.ALL)
		.pipe(eslint({ fix: false }))
		.pipe(eslint.format())
		.pipe(useCondition(!devMode, eslint.failAfterError()));

// Общепроектные задачи

const cleanDist = async (done) => {
	await deleteAsync(Path.DEST);
	done();
};

const reloadServer = (done) => {
	server.reload();
	done();
};

const startWatch = () => {
	server.init({ server: Path.DEST });

	watch(Path.EDITORCONFIG, lintEditorconfig);
	watch(Path.ICONS, series(buildSprite, reloadServer));
	watch(Path.Images.RASTERS, series(buildWebp, reloadServer));
	watch(Path.Layouts.ALL, series(processLayouts, reloadServer));
	watch(
		Path.Scripts.ALL,
		parallel(series(buildScripts, reloadServer), lintScripts)
	);
	watch(Path.STATIC, series(copyStatic, reloadServer));
	watch(
		Path.Styles.ALL,
		parallel(series(buildStyles, reloadServer), lintStyles)
	);
};

export const lint = parallel(
	lintEditorconfig,
	lintScripts,
	lintStyles,
	processLayouts
);
export const build = series(
	cleanDist,
	lint,
	parallel(buildScripts, buildSprite, buildStyles, buildWebp, copyStatic)
);
export default series(build, startWatch);
