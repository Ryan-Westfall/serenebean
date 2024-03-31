#!/bin/sh
set -e

while true
do
node Create-Image-Data.js
npx remotion render --concurrency=12
node Delete-Used-Images.js
node Create-Image-Data.js
done