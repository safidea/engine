cd ../../
mv .dockerignore .dockerignore.temp
docker build -f packages/app-test/Dockerfile -t foundation:latest .
mv .dockerignore.temp .dockerignore