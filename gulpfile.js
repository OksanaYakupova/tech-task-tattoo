const gulp = require('gulp'),
    sass = require('gulp-sass'),
    connect = require('gulp-connect'),
    clean = require('gulp-clean'),
    csso = require('gulp-csso'),
    htmlmin = require('gulp-htmlmin'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    ghPages = require('gulp-gh-pages');

gulp.task('connect', function () {
    return connect.server({
        root: 'dist',
        livereload: true
    });
});

gulp.task('scss', function () {
        return gulp.src('app/scss/main.scss')
            .pipe(sass())
            .pipe(autoprefixer())
            .pipe(csso())
            .pipe(gulp.dest('dist/css'))
            .pipe(connect.reload());
    }
);

gulp.task('html', function () {
        return gulp.src('app/index.html')
            .pipe(htmlmin({collapseWhitespace: true}))
            .pipe(gulp.dest('dist'))
            .pipe(connect.reload());
    }
);

gulp.task('scripts-main', function () {
        return gulp.src('app/scripts/main.js')
            .pipe(uglify())
            .pipe(gulp.dest('dist/scripts'))
            .pipe(connect.reload());
    }
);

gulp.task('scripts-libs-magnific-popup', function () {
        return gulp.src('node_modules/magnific-popup/dist/jquery.magnific-popup.js')
            .pipe(gulp.dest('dist/scripts'))
            .pipe(connect.reload());
    }
);

gulp.task('scripts', gulp.parallel(
    'scripts-main',
    'scripts-libs-magnific-popup'
));


gulp.task('img', function () {
        return gulp.src('app/img/**/*')
            .pipe(gulp.dest('dist/img'))
            .pipe(connect.reload());
    }
);

gulp.task('clean', function () {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});

gulp.task('build', gulp.series('clean', gulp.parallel('html', 'scss', 'scripts', 'img')));

gulp.task('watch', function () {
    gulp.watch('app/scss/**/*.scss', gulp.series('scss'));
    gulp.watch('app/index.html', gulp.series('html'));
    gulp.watch('app/scripts/**/*.js', gulp.series('scripts'));
    gulp.watch('app/img/**/*', gulp.series('img'));
});

function pushToGitHubPages() {
    return gulp.src('dist/**/*').pipe(ghPages());
}

gulp.task('deploy', gulp.series('build', pushToGitHubPages));

gulp.task('default', gulp.parallel('connect', 'watch', 'build'));