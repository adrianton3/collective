#!/usr/bin/env bash

git checkout gh-pages

rm -r src
rm -r art
rm -r lib

git checkout master -- src art lib index.html