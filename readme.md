// "start": "ts-node src/index.ts",
// "dev": "nodemon -r tsconfig-paths/register src/index.ts",
// "build": "tsc"
{
"version": 2,
"rewrites": [{ "source": "/(.*)", "destination": "/api" }]
}
//chay redis
docker run --name redis -p 6379:6379 -d redis
docker start redis
//kiem tra xem redis co chay khong
docker exec -it redis redis-cli
