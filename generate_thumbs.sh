#!/bin/sh
PROJECTS=('wikipedia-viewer' 'pomodoro-clock' 'server-information' 'random-quote' 'simon-game')

count=0
while [ "x${PROJECTS[count]}" != "x" ]
do
   page="http://gillisandrew.me/small-projects/${PROJECTS[count]}"
   pageres   $page --filename="${PROJECTS[count]}/index" --no-crop
   count=$(( $count + 1 ))
done