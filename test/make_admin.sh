#!/bin/bash

echo "use m3;
db.creds.update({email:\"$1\"},{\$set:{admin:true}});" > tmp.js

mongo < tmp.js

rm tmp.js