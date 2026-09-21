#!/bin/bash
echo "Iniciando serviços..."
sudo systemctl start postgresql httpd

echo "Iniciando backend..."
cd ~/TCC/application/backend
node index.js &

sleep 2

echo "Iniciando frontend..."
cd ~/TCC/application/frontend
npm run dev &

sleep 3

echo ""
echo "================================"
echo " Sistema rodando!"
echo " Acesse: http://localhost:5173"
echo " Moodle: http://localhost"
echo "================================"

wait
