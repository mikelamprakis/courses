docker-compose -f docker-compose.yaml up
docker-compose up

# Once server is stopped with Ctrl+C

docker-compose up -d
docker-compose stop
docker-compose start

# With docker ps we can see:
CONTAINER ID   IMAGE           COMMAND                  CREATED         STATUS          PORTS                      NAMES
6886c9d862a2   mongo           "docker-entrypoint.s…"   7 minutes ago   Up 35 seconds   0.0.0.0:27017->27017/tcp   mongodb
b9b042dca711   mongo-express   "tini -- /docker-ent…"   7 minutes ago   Up 30 seconds   0.0.0.0:8081->8081/tcp     mongo-express

# To go inside the container of mongo we take the container_id and do:
docker exec -it 6886c9d862a2 bash


# Now to open the shell of mongo indside the container we do:
mongo mongodb://localhost:27017 -u rootuser -p rootpass

# To exit the mongo shell: Ctrl+C and to exit the container: exit

