#!/bin/sh

#npx sequelize-cli model:generate --force --name Users --attributes userName:string,email:string,modifyAt:date,password:string,authToken:string,profilePicture:string,verificationStatus:string
#npx sequelize-cli migration:create --name add_user_id

#npx sequelize-cli model:generate --force --name UsersComment --attributes userId:string,contentId:string,parentId:string,text:string,createAt:date,modifyAt:date,upvotes:integer,downvotes:integer
#npx sequelize-cli migration:create --name change-text-type
#npx sequelize-cli migration:create --name remove-comment-date

#npx sequelize-cli model:generate --force --name Assets --attributes name:string,minetype:string,url:string,type:string,uploadAt:date

#npx sequelize-cli model:generate --force --name Token --attributes id:INTEGER,userId:string,tokenValue:string,createAt:date,expiredAt:date,usageState:string,tokenType:string,deiceInfo:string

#npx sequelize-cli model:generate --force --name CommentHistory --attributes userId:string,commentId:string,action:string

#npx sequelize-cli migration:create --name remove-comment-content-id
#npx sequelize-cli migration:create --name create-comment-history-foreign
