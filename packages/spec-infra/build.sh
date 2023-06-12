cd ../../
mv .dockerignore .dockerignore.temp
docker build -f packages/spec-infra/Dockerfile -t foundation:latest .
mv .dockerignore.temp .dockerignore