#!/bin/sh

GREEN='\033[0;32m'
REG='\033[0;31m'
NC='\033[0m' # No Color

echo -e [] ${GREEN}Docker pull new container
sudo docker pull cr.yandex/$CR_REGISTRY/$CR_REPOSITORY:$IMAGE_TAG

echo -e [] Search running containers
containerIds=$(sudo docker ps -a -q --filter "name=Backend")

echo -e [] Running containers: ${GREEN}$containerIds
if [[ -n $containerIds ]] ; then
  echo -e [] Delete containers ${RED}$(sudo docker stop $containerIds)
fi

echo -e [] Run ${GREEN}cr.yandex/$CR_REGISTRY/$CR_REPOSITORY:$IMAGE_TAG ${NC}WITH NAME ${GREEN}Backend.$GITHUB_RUN_NUMBER
sudo docker run --name Backend.$GITHUB_RUN_NUMBER -d -p $PORT:$PORT cr.yandex/$CR_REGISTRY/$CR_REPOSITORY:$IMAGE_TAG

sudo docker system prune -a -f
