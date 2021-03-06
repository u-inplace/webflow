#!/bin/bash

bundle=$1
target="/dist/$bundle"
repo="ui-booking"
branch=$2
cdnURL="https://combinatronics.com/u-inplace/$repo/$branch$target"

# Basic if statement
while true; do
    printf "\033c"
    echo @$branch
    echo \:$target
    result=$(diff <(cat .$target) <(curl -s $cdnURL))
    if [[ $result != "" ]]; then
        echo Not synced.
    else
        echo .
    fi
    sleep 2
done
