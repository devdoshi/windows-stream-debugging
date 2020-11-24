#!/bin/bash

set -o errexit

TEST_PATH=$(dirname $0);
INTERACTIONS=$TEST_PATH/../../input-interactions-1000.jsonl
EVENTS=$TEST_PATH/../../input-events.json

echo "----> Preparing diff"
DIFF_CONFIG=$(node $TEST_PATH/prepare.js $INTERACTIONS $EVENTS)

echo "----> Diff prepared, config:"
echo $DIFF_CONFIG

echo "----> Running diff worker"

# node $TEST_PATH/../../node_modules/\@useoptic/cli-scripts/build/emit-diff-projections-rust.js $DIFF_CONFIG

node $TEST_PATH/spawn.js $DIFF_CONFIG

WORKER_EXIT=$?

DIFFS_COUNT=$(wc -l $TEST_PATH/capture/diffs/test-diff/diffs.jsonl)

echo "-----> Done!"
echo "-----> Produced diffs: $DIFFS_COUNT"

exit $WORKER_EXIT