cd ../../
mv .dockerignore .dockerignore.temp
docker build -f packages/spec-app/Dockerfile -t foundation:latest .
mv .dockerignore.temp .dockerignore