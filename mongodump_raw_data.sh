#!/bin/bash
mongodump --db m3 --collection raw_datas --query "{processed:true}"
mv dump/m3/raw_datas.bson dump/m3/raw_datas_$1.bson 
mv dump/m3/raw_datas.metadata.json dump/m3/raw_datas_$1.metadata.json
