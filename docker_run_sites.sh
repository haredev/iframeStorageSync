docker rm -f main
docker rm -f target
docker run --name main -v $(pwd)/mainSite:/usr/share/nginx/html:ro -d -p 8081:80 nginx
docker run --name target -v $(pwd)/targetSite:/usr/share/nginx/html:ro -d -p 8082:80 nginx