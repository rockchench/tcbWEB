var es = require('event-stream');
var gulp = require('gulp');
var concat = require('gulp-concat');
var templateCache = require('gulp-angular-templatecache');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var fs = require('fs');
var _ = require('lodash');
var browserSync = require('browser-sync');
// var scripts = require('./app.scripts.json');
// 删除console等调度代码
var stripDebug = require('gulp-strip-debug');
var babel = require('gulp-babel');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var watch = require('gulp-watch');

var source = {
    js: {
        main: 'app/main.js',
        src: [
            // application config
            // 'app.config.js',@Veyhunk

            // application bootstrap file
            'app/main.js',

            // main module
            'app/app.js',

            // module files
            'app/**/module.js',

            // other js files [controllers, services, etc.]
            'app/**/!(module)*.js'
        ]

    },
    html: {
        src: [
            'app/**/*.html',
            // 排除 ui demo 模块
            // '!app/ui/**/*.html'
        ]
    },
    css: {
        src: [
            'node_modules/openlayers/dist/ol.css',
            'assets/fonts/iconfont/iconfont.css',
            'app/**/*.css'
        ]
    },
    sass: {
        src: [
            'app/**/*.scss'
        ]
    }
};



gulp.task('browser-sync', function() {
    browserSync({
        open: true,
        reloadOnRestart: true,
        reloadDebounce: 300,
        server: {
            baseDir: "./"
        },
        ghostMode: { //在这里你可以禁用/启用 每个单独的功能
            clicks: false,
            forms: false,
            scroll: false
        }
    });
});

var destinations = 'build';

var swallowError = function(error) {
    console.log(error.toString());
    this.emit('end');
};


gulp.task('build', function() {


    var sassStream,
        cssStream;

    sassStream = gulp.src(source.sass.src)
        .pipe(sass().on('error', sass.logError));

    cssStream = gulp.src(source.css.src);

    es.merge(sassStream, cssStream)
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(concat('app.css'))
        .pipe(gulp.dest(destinations));

    return gulp.src(source.js.src)
        .pipe(babel({
            presets: ['es2015', 'es2017']
        }))
        .pipe(ngAnnotate())
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(concat('app.js'))
        .pipe(gulp.dest(destinations))
});

// js
var js = function() {
    return gulp.src(source.js.src)
        .pipe(concat('app.js'))
        .pipe(gulp.dest(destinations));
};

gulp.task('js', js);

// cacheTemplate
var cacheTemplate = function() {
    return gulp.src(source.html.src)
        .pipe(templateCache({
            root: 'app/',
            module: 'app'
        }))
        .pipe(gulp.dest(destinations));
};

gulp.task('cacheTemplate', cacheTemplate);

// css
var css = function() {

    var sassStream,
        cssStream;

    sassStream = gulp.src(source.sass.src)
        .pipe(sass().on('error', sass.logError));

    cssStream = gulp.src(source.css.src);

    return es.merge(sassStream, cssStream)
        .pipe(concat('app.css'))
        .pipe(gulp.dest(destinations))
        .pipe(browserSync.stream());

};
gulp.task('css', css);

// 监视文件变化
gulp.task('watch', function() {


    watch(source.css.src, function(e) {
        css();
        var time = new Date().toTimeString().split(" ")[0];
        console.info('[' + time + ']' + ' ' + e.event + ' ' + e.relative)
    });
    watch(source.sass.src, function(e) {
        css();
        var time = new Date().toTimeString().split(" ")[0];
        console.info('[' + time + ']' + ' ' + e.event + ' ' + e.relative)
    });
    // html 改变立即刷新
    watch(source.html.src, function(e) {

        cacheTemplate().on('end', function() {
            var time = new Date().toTimeString().split(" ")[0];
            console.info('[' + time + ']' + ' ' + e.event + ' ' + e.relative)
            browserSync.reload();
        });
    });
    watch(source.js.src, function(e) {
        js().on('end', function() {
            var time = new Date().toTimeString().split(" ")[0];
            console.info('[' + time + ']' + ' ' + e.event + ' ' + e.relative)
            browserSync.reload();
        });
    });
});

// gulp.task('vendor', function () {

//     _.forIn(scripts.chunks, function (chunkScripts, chunkName) {
//         var paths = [];
//         chunkScripts.forEach(function (script) {
//             var scriptFileName = scripts.paths[script];

//             if (!fs.existsSync(__dirname + '/' + scriptFileName)) {

//                 throw console.error('Required path doesn\'t exist: ' + __dirname + '/' + scriptFileName, script)
//             }
//             paths.push(scriptFileName);
//         });

//         gulp.src(paths)
//             .pipe(concat(chunkName + '.js'))
//             //.on('error', swallowError)
//             .pipe(gulp.dest(destinations))
//     })

// });

//tinymce 插件需要相应的资源文件
gulp.task('copy', function() {
    return gulp.src('bower_components/tinymce/skins/**/*')
        .pipe(gulp.dest(destinations + '/skins'))
});

// 发布使用
gulp.task('product', ['copy', 'cacheTemplate', 'build']);
// 开发时使用
gulp.task('dev', ['copy', 'cacheTemplate', 'js', 'css', 'watch', 'browser-sync']);
// @Veyhunk 开发使用，dl(dev-lite)轻量版本，避免重复执行 vendor cacheTemplate js copy css，保护磁盘
gulp.task('dl', ['watch', 'browser-sync']);
// 项目初始化的时候单独运行
gulp.task('init', ['js', 'css']);
// 默认执行
gulp.task('default', ['dev']);