#!/bin/bash

echo "use m3;
db.creds.find({email:\"$1\"});" > tmp.js

mongo < tmp.js

rm tmp.js