const gulp = require('gulp');
const { series, parallel } = require('gulp');
const cache = require('gulp-cached');
const babel = require('gulp-babel');
const gutil = require('gulp-util');
const fork = require('child_process').fork;

process.env.HOST = 'localhost';
process.env.PORT = 3000;
