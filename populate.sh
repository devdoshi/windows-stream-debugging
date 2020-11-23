MAX=100000
for i in $(seq 1 $MAX);
do
    cat input-interactions.jsonl >> input-interactions-$MAX.jsonl
done