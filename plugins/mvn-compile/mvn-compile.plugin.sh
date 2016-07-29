#!/bin/bash

if ! which java > /dev/null ; then
  printf "Please install [java] first."
fi

if ! which mvn > /dev/null ; then
  printf "Please install [mvn] first."
fi

mvn clean

mvn compile
