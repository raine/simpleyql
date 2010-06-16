PREFIX = .
DIST_DIR = ${PREFIX}

DATE=`git log -1 | grep Date: | sed 's/[^:]*: *//'`
COMMIT=`git rev-parse --short HEAD`

BUILD_DIR = build
SRC = simpleyql.js
SRC_MIN = ${DIST_DIR}/simpleyql.min.js

MINJAR = java -jar ${BUILD_DIR}/compiler.jar

define ANNOUNCE_BODY
/*
 * SimpleYQL
 *
 * Copyright 2010, Raine Virta
 * Released under MIT license
 * Commit: 
 * Date: 
 */
endef

all: compile

${DIST_DIR}:
	@@mkdir -p ${DIST_DIR}

export ANNOUNCE_BODY
compile: ${DIST_DIR}
	@@echo "Compiling" ${SRC}
	@@echo "$$ANNOUNCE_BODY" | sed 's/Date:./&'"${DATE}"'/' | sed 's/Commit:./&'"${COMMIT}"'/' > ${SRC_MIN}
	@@${MINJAR} --js ${SRC} --warning_level QUIET >> ${SRC_MIN}
	