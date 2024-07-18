cd frontend
pnpm install
pnpm build
xcopy .\src\ext_index\img .\dist\img\ /e
cd ..
docker-compose up --build