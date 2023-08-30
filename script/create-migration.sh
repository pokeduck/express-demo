#!/bin/sh

npx sequelize-cli model:generate --force --name Users --attributes userName:string,email:string,modifyAt:date,password:string,authToken:string,profilePicture:string,verificationStatus:string

npx sequelize-cli model:generate --force --name UsersComment --attributes userId:string,contentId:string,parentId:string,text:string,createAt:date,modifyAt:date,upvotes:integer,downvotes:integer

npx sequelize-cli model:generate --force --name Assets --attributes name:string,minetype:string,url:string,type:string,uploadAt:date

npx sequelize-cli model:generate --force --name Token --attributes id:INTEGER,userId:string,tokenValue:string,createAt:date,expiredAt:date,usageState:string,tokenType:string,deiceInfo:string

npx sequelize-cli db:migrate