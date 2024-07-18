cd frontend
pnpm install
pnpm build
cp -a .\src\ext_index\img .\dist\img\
cd ..
docker-compose up --build