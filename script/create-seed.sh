#!/bin/sh
npx sequelize-cli seed:generate --name demo-user
npx sequelize-cli seed:generate --name demo-user-comment
npx sequelize-cli seed:generate --name demo-token