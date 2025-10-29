export type ID = number;


export interface User {
id: ID;
nickName: string;
}


export interface Tag {
id: ID;
name: string;
}


export interface PostImage {
id: ID;
url: string;
postId: ID;
}


export interface Post {
id: ID;
userId: ID;
description: string;
tags?: Tag[]; // El backend puede o no expandir, por eso es opcional
commentsCount?: number; // derivado
}


export interface Comment {
id: ID;
postId: ID;
userId: ID;
content: string;
}