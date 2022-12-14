"use strict";

const proxy = 'remont.local';
const dist = "./dist";
const imagesType = 'webp'; // 'webp' or 'original'
const faviconSvg = true;

import pkg from 'gulp';
const {src, dest, parallel, series, watch} = pkg;
import browserSync from 'browser-sync';
import webpackStream from 'webpack-stream';
import webpack from 'webpack';
import imagemin from 'gulp-imagemin';
import imageminWebp from "imagemin-webp";
import webp from "gulp-webp";
import changed from 'gulp-changed';
import include from 'gulp-file-include';
import gulpSass from 'gulp-sass';
import dartSass from 'sass';
const sass = gulpSass(dartSass);
import postCss from 'gulp-postcss';
import postcssSortMediaQueries from "postcss-sort-media-queries";
import postcssViewportHeightCorrection from "postcss-viewport-height-correction";
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';
import concat from 'gulp-concat';
import {deleteAsync} from 'del';
import vinylFtp from "vinyl-ftp";
import gulpif from "gulp-if";
import sourcemaps from "gulp-sourcemaps";
import svgSprite from "gulp-svg-sprite";
import debug from "gulp-debug";
import favicons from "gulp-favicons";
import rename from "gulp-rename";
import ftpSettings from './ftp_settings.js';
ftpSettings();
let production;

function styles() {
    src("./src/scss/critical.scss")
        .pipe(gulpif(!production, sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulpif(!production, postCss([
            postcssViewportHeightCorrection(),
        ])))
        .pipe(gulpif(production, postCss([
            postcssViewportHeightCorrection(),
            postcssSortMediaQueries({sort: 'desktop-first'}),
            autoprefixer({ grid: 'autoplace' }),
            cssnano({ preset: ['default', { discardComments: { removeAll: true } }] })
        ])))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulpif(!production, sourcemaps.write("./maps/")))
        .pipe(dest(dist + '/css'))
        .pipe(browserSync.stream());

    return src("./src/scss/main.scss")
        .pipe(gulpif(!production, sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulpif(!production, postCss([
            postcssViewportHeightCorrection(),
        ])))
        .pipe(gulpif(production, postCss([
            postcssViewportHeightCorrection(),
            postcssSortMediaQueries({sort: 'desktop-first'}),
            autoprefixer({ grid: 'autoplace' }),
            cssnano({ preset: ['default', { discardComments: { removeAll: true } }] })
        ])))
        .pipe(rename({
            basename: 'bundle',
            suffix: '.min'
        }))
        .pipe(gulpif(!production, sourcemaps.write("./maps/")))
        .pipe(dest(dist + '/css'))
        .pipe(browserSync.stream());
}

// function styles() {
//     return src(["./src/scss/**/*.scss", "!./src/scss/common.admin.scss", "!./src/scss/common.edit.scss"])
//         .pipe(gulpif(!production, sourcemaps.init()))
//         .pipe(sass().on('error', sass.logError))
//         .pipe(gulpif(!production, postCss([
//             postcssViewportHeightCorrection(),
//         ])))
//         .pipe(gulpif(production, postCss([
//             postcssViewportHeightCorrection(),
//             postcssSortMediaQueries({sort: 'desktop-first'}),
//             autoprefixer({ grid: 'autoplace' }),
//             cssnano({ preset: ['default', { discardComments: { removeAll: true } }] })
//         ])))
//         .pipe(concat('bundle.min.css'))
//         .pipe(gulpif(!production, sourcemaps.write("./maps/")))
//         .pipe(dest(dist + '/css'))
//         .pipe(browserSync.stream());
// }

function stylesOther() {
    return src(["./src/scss/common.admin.scss", "./src/scss/common.edit.scss"])
        .pipe(gulpif(!production, sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulpif(!production, postCss([
            postcssViewportHeightCorrection(),
        ])))
        .pipe(gulpif(production, postCss([
            postcssViewportHeightCorrection(),
            postcssSortMediaQueries({sort: 'desktop-first'}),
            autoprefixer({ grid: 'autoplace' }),
            cssnano({ preset: ['default', { discardComments: { removeAll: true } }] })
        ])))
        .pipe(gulpif(!production, sourcemaps.write("./maps/")))
        .pipe(dest(dist + '/css'))
        .pipe(browserSync.stream());
}

function scripts() {
    return src("./src/js/bundle.js")
        .pipe(webpackStream({
            mode: production ? "production" : "development",
            output: {
                filename: 'bundle.min.js'
            },
            watch: false,
            devtool: production ? false : "source-map",
            module: {
                // правила для babel
                rules: [
                    {
                        test: /\.m?js$/, // находим файлы js
                        exclude: /(node_modules|bower_components)/, // исключаем папки
                        use: {
                            loader: 'babel-loader', // свяжет webpack и babel
                            options: {
                                presets: [['@babel/preset-env', {
                                    debug: production ? false : true, // показывает инф-ю во время компиляции
                                    corejs: 3, // биб-ка corejs 3-й версии (для полифилов)
                                    useBuiltIns: "usage" // позволяет corejs выбрать только те полифилы, кот-е нужны в проекте
                                }]]
                            }
                        }
                    }
                ]
            }
        }, webpack)).on('error', (err) => {
            this.emit('end');
        })
        .pipe(dest(dist + '/js'))
        .pipe(browserSync.stream());
}

// сжимаем содержимое папки img (в случае с webp исключаем файлы svg и обрабатываем их отдельно)
const srcImg = ['./src/img/**/*'];
if(imagesType === 'webp'){
    srcImg.push(`!./src/img/**/*.svg`);
}
function images1() {

    return src(srcImg)
        .pipe(changed(dist + "/img", gulpif(imagesType === 'webp', {extension: '.webp'}) ))
        .pipe(gulpif(imagesType === 'original', imagemin()))
        .pipe(gulpif(imagesType === 'webp',
            webp(imageminWebp({
                lossless: true,
                quality: 50,
                alphaQuality: 100
            }))))
        .pipe(dest(dist + "/img"))
        .pipe(browserSync.stream());

}

function images2() {
    if(imagesType === 'webp'){
        // svg compress
        return src('./src/img/**/*.svg')
            .pipe(changed(dist + "/img"))
            .pipe(imagemin())
            .pipe(dest(dist + "/img"))
            .pipe(browserSync.stream());
    }
}

function images3() {

    // копируем все из img/nocompress без сжатия
    return src("./src/img_nocompress/**/*")
        .pipe(changed(dist + "/img", gulpif(imagesType === 'webp', {extension: '.webp'})))
        .pipe(gulpif(imagesType === 'webp', webp()))
        .pipe(dest(dist + "/img"))
        .pipe(browserSync.stream());
}

// function images() {
//
//     // сжимаем содержимое папки img (в случае с webp исключаем файлы svg и обрабатываем их отдельно)
//     const srcImg = ['./src/img/**/*'];
//     if(imagesType === 'webp'){
//         srcImg.push(`!./src/img/**/*.svg`);
//     }
//     src(srcImg)
//         .pipe(changed(dist + "/img", gulpif(imagesType === 'webp', {extension: '.webp'}) ))
//         .pipe(gulpif(imagesType === 'original', imagemin()))
//         .pipe(gulpif(imagesType === 'webp',
//             webp(imageminWebp({
//                 lossless: true,
//                 quality: 50,
//                 alphaQuality: 100
//             }))))
//         .pipe(dest(dist + "/img"))
//         .pipe(browserSync.stream());
//
//     if(imagesType === 'webp'){
//         // svg compress
//         src('./src/img/**/*.svg')
//             .pipe(changed(dist + "/img"))
//             .pipe(imagemin())
//             .pipe(dest(dist + "/img"))
//             .pipe(browserSync.stream());
//     }
//
//     // копируем все из img/nocompress без сжатия
//     return src("./src/img_nocompress/**/*")
//         .pipe(changed(dist + "/img", gulpif(imagesType === 'webp', {extension: '.webp'})))
//         .pipe(gulpif(imagesType === 'webp', webp()))
//         .pipe(dest(dist + "/img"))
//         .pipe(browserSync.stream());
// }

function sprite() {
    return src("./src/sprites/**/*.svg")
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: "../sprite.svg"
                }
            }
        }))
        .pipe(dest(dist + "/img"))
        .pipe(browserSync.stream());
}

function html() {
    return src('./src/*.html')
        .pipe(include({
            prefix: '@@',
            basepath: './src/parts/',
            indent: true
        }))
        .pipe(dest(dist))
        .pipe(browserSync.stream());
}

function copyAssets() {
    src("./src/css/**/*")
        .pipe(changed(dist + "/css"))
        .pipe(dest(dist + "/css"))
        .pipe(browserSync.stream());

    src("./src/forms/**/*")
        .pipe(changed(dist + "/forms"))
        .pipe(dest(dist + "/forms"))
        .pipe(browserSync.stream());

    src("./src/js/app/**/*")
        .pipe(changed(dist + "/js/app"))
        .pipe(dest(dist + "/js/app"))
        .pipe(browserSync.stream());

    src("./src/js/libs/**/*")
        .pipe(changed(dist + "/js/libs"))
        .pipe(dest(dist + "/js/libs"))
        .pipe(browserSync.stream());

    return src("./src/fonts/**/*")
        .pipe(changed(dist + "/fonts"))
        .pipe(dest(dist + "/fonts"))
        .pipe(browserSync.stream());
}

function cms() {
    return src([`${dist}/**/*`, `!${dist}/*.html`, `!${dist}/{forms,forms/**/*}`])
        .pipe(changed("./"))
        .pipe(dest("./"));
}

async function clearDistTask() {
    await deleteAsync(dist, { force: true });
}

async function clearProdTask() {
    await deleteAsync(['./css', './js', './fonts', './img', './js', "./favicon.ico", "./manifest.webmanifest"], { force: true });
}

function faviconsTask1() {
    return src("./src/favicon/favicon.*")
        .pipe(favicons({
            icons: {
                android: [
                    "android-chrome-192x192.png",
                    "android-chrome-512x512.png"
                ],
                appleIcon: [
                    "apple-touch-icon-180x180.png"
                ],
                "favicons": [
                    "favicon.ico"
                ],
                online: false,
                appleStartup: false,
                firefox: false,
                yandex: false,
                windows: false,
                coast: false
            },
        }))
        .pipe(imagemin())
        .pipe(dest(dist + '/img/favicons'));
}

// function faviconsTask2() {
//     if(faviconSvg){
//         src("./src/favicon/favicon.svg")
//             .pipe(imagemin())
//             .pipe(dest(dist + "/img/favicons"));
//     }
//
//     return src([dist + "/img/favicons/favicon.ico", "./src/manifest.webmanifest"])
//         .pipe(changed(dist + "/"))
//         .pipe(dest(dist + "/"))
//         .pipe(browserSync.stream());
// }

function faviconsTask2() {
    if(faviconSvg){
        return src("./src/favicon/favicon.svg")
            .pipe(imagemin())
            .pipe(dest(dist + "/img/favicons"));
    }
}

function faviconsTask3() {
    return src([dist + "/img/favicons/favicon.ico", "./src/manifest.webmanifest"])
        .pipe(changed(dist + "/"))
        .pipe(dest(dist + "/"))
        .pipe(browserSync.stream());
}

async function faviconsTask4() {
    await deleteAsync([dist + "/img/favicons/favicon.ico", dist + "/img/favicons/manifest.json"], { force: true });
}

function serve() {
    browserSync.init({
        server: (proxy ? undefined : dist),
        proxy:  (proxy ? proxy : undefined),
        ghostMode: false,
        // ghostMode: { clicks: false },
        notify: false,
        online: true,
        // tunnel: 'yousutename', // Attempt to use the URL https://yousutename.loca.lt
    });

    if(!proxy){
        watch(["./src/*.html", "./src/parts/*.html", "./src/forms/*.html"], { usePolling: true }, html);
        watch(["./src/css/**/*", "./src/forms/**/*", "./src/js/app/**/*", "./src/js/libs/**/*", "./src/fonts/**/*"], { usePolling: true }, copyAssets);
        watch('./src/img/**/*', { usePolling: true }, images);
        watch('./src/sprites/**/*', { usePolling: true }, sprite);
        watch('./src/favicon/favicon.*', { usePolling: true }, faviconsTask);
        watch("./src/scss/**/*", { usePolling: true }, parallel(styles, stylesOther));
        watch("./src/js/**/*", { usePolling: true }, scripts);
    } else {
        watch(["./src/*.html", "./src/parts/*.html", "./src/forms/*.html"], { usePolling: true }, series(html, cms));
        watch(["./src/css/**/*", "./src/forms/**/*", "./src/js/app/**/*", "./src/js/libs/**/*", "./src/fonts/**/*"], { usePolling: true }, series(copyAssets, cms));
        watch('./src/img/**/*', { usePolling: true }, series(images, cms));
        watch('./src/sprites/**/*', { usePolling: true }, series(sprite, cms));
        watch('./src/favicon/favicon.*', { usePolling: true }, series(faviconsTask, cms));
        watch("./src/scss/**/*", { usePolling: true }, series(parallel(styles, stylesOther), cms));
        watch("./src/js/**/*", { usePolling: true }, series(scripts, cms));
    }
}

function ftpSite() {

    const conn = vinylFtp.create({
        host: ftpSettings().site.host,
        user: ftpSettings().site.user,
        password: ftpSettings().site.pass,
        parallel: 10,
    });

    const globs  = [
        'css/**',
        '!css/common.other.css',
        'fonts/**',
        'img/**',
        'js/**',
        '!js/app/common.other.js',
        'favicon.ico',
        'manifest.webmanifest',
    ];

    return src(globs, { base: '.', buffer: false })
        .pipe(conn.newer(ftpSettings().site.folderPath) ) // only upload newer files
        .pipe(conn.dest(ftpSettings().site.folderPath) );
}

function ftpCmsTask() {

    const conn = vinylFtp.create({
        host: ftpSettings().cmsnc.host,
        user: ftpSettings().cmsnc.user,
        password: ftpSettings().cmsnc.pass,
        parallel: 10,
    });

    const folderPath = ftpSettings().cmsnc.folderPath;

    const globs = [
        'css/**',
        '!css/common.other.css',
        'fonts/**',
        'img/**',
        'js/**',
        '!js/app/common.other.js',
        'favicon.ico',
        'manifest.webmanifest',
    ];

    conn.rmdir( folderPath + '/css/*', function () {
        conn.rmdir( folderPath + '/fonts/*', function () {
            conn.rmdir( folderPath + '/img/*', function () {
                conn.rmdir( folderPath + '/js/*', function () { // если кто-то пишет файлы js, то не удаляем папку c js, чтоб не затереть его работу
                    conn.delete( folderPath + '/favicon.ico', function () {
                        conn.delete( folderPath + '/manifest.webmanifest', function () {
                            return src( globs, { base: '.', buffer: false } )
                                .pipe(conn.dest(folderPath));
                        });
                    });
                });
            });
        });
    });

}

function ftpWikiTask() {

    const conn = vinylFtp.create({
        host: ftpSettings().wiki.host,
        user: ftpSettings().wiki.user,
        password: ftpSettings().wiki.pass,
        parallel: 10,
    });

    const folderPath = ftpSettings().wiki.folderPath;

    const globs = [
        'css/**',
        '!css/common.other.css',
        'fonts/**',
        'img/**',
        'js/**',
        '!js/app/common.other.js',
        'favicon.ico',
        'manifest.webmanifest',
    ];

    conn.rmdir( folderPath + '/*', function () {
        return src(globs, {base: '.', buffer: false})
            .pipe(conn.dest(folderPath));
    });
}

async function isProd() {
    production = true;
}

export let faviconsTask = series(faviconsTask1, faviconsTask2, faviconsTask3, faviconsTask4);
export let images = series(images1, images2, images3);
export let clearDist = clearDistTask;
export let clearProd = clearProdTask;
export let ftp = ftpSite;
export let ftpCms = ftpCmsTask;
export let ftpWiki = ftpWikiTask;
export let build = parallel(html, styles, stylesOther, scripts, copyAssets, faviconsTask, sprite, images);
export let prod = series(isProd, parallel(clearDist, clearProd), build, cms);
export default (!proxy ? parallel(build, serve) : series(parallel(build, serve), cms));