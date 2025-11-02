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
    tags?: Tag[];
    commentsCount?: number;
}


export interface Comment {
    id: ID;
    postId: ID;
    userId: ID;
    content: string;
}