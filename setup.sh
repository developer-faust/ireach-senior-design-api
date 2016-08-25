#!/bin/bash
mkdir ssl
cd ssl
#Change to your company details
country=US
state=WASHINGTON
locality=PULLMAN
organization=WSU
organizationalunit=IT
email=jeremymartinez11@gmail.com
#Optional
password=jiveturkey
########################################################################
echo "Generating key request for server"
#Generate a key
openssl genrsa -des3 -passout pass:$password -out server.key 1024 -noout
#Remove passphrase from the key. Comment the line out to keep the passphrase
echo "Removing passphrase from key"
openssl rsa -in server.key -passin pass:$password -out server.key
#Create the request
echo "Creating CSR"
openssl req -new -key server.key -out server.csr -passin pass:$password \
-subj "/C=$country/ST=$state/L=$locality/O=$organization/OU=$organizationalunit/CN=$commonname/emailAddress=$email"
#Generate a certificate
openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt -passin pass:$password
########################################################################
########################################################################
echo "Generating key request for client authentication"
#Generate a key
openssl genrsa -des3 -passout pass:$password -out ca.key 1024 -noout
#Remove passphrase from the key. Comment the line out to keep the passphrase
echo "Removing passphrase from key"
openssl rsa -in ca.key -passin pass:$password -out ca.key
#Create the request
echo "Creating CSR"
openssl req -new -key ca.key -out ca.csr -passin pass:$password \
-subj "/C=$country/ST=$state/L=$locality/O=$organization/OU=$organizationalunit/CN=$commonname/emailAddress=$email"
#Generate a certificate
openssl x509 -req -days 365 -in ca.csr -signkey ca.key -out ca.crt -passin pass:$password
########################################################################
echo "---------------------------"
echo "-----Below is your CSR-----"
echo "---------------------------"
echo
cat server.csr
echo
echo "---------------------------"
echo "-----Below is your Key-----"
echo "---------------------------"
echo
cat server.key
echo
echo "---------------------------"
echo "-----Below is your CRT-----"
echo "---------------------------"
echo
cat server.crt
echo "---------------------------"
echo "-----Below is your CSR-----"
echo "---------------------------"
echo
cat ca.csr
echo
echo "---------------------------"
echo "-----Below is your Key-----"
echo "---------------------------"
echo
cat ca.key
echo
echo "---------------------------"
echo "-----Below is your CRT-----"
echo "---------------------------"
echo
cat ca.crt