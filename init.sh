log "Starting docker-compose"
docker-compose up -d
if [ $? -ne 0 ]; then
    err "Error while starting docker-compose"
fi

sleep 10

log "Run migrations: npm run ts-typeorm migration:run"
docker exec -it market-service npm run ts-typeorm migration:run
if [ $? -ne 0 ]; then
    err "Migrations failed."
fi