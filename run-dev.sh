# si docker no está prendido, prenderlo
pgrep dockerd > /dev/null || sudo systemctl start docker

# si el container no está corriendo, arrancarlo
# crear el container con: docker run -dp 27018:27017 --name mongodb-unr-escuelas mongo:3.2 
docker inspect --format="{{.State.Status}}" mongodb-unr-escuelas | grep -q running || docker start mongodb-unr-escuelas

# si no estamos usando node v6, cambiar a esa
node -v | grep -q v6 || nvm use v6.17.1

# finalmente, levantar el sistema (bws=build watch serve)
NODE_PATH=. DEBUG=democracyos* gulp bws
