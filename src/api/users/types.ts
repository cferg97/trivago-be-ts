import { Model, Document } from "mongoose";

interface User {
    email: string,
    password: string,
    role: "User" | "Host"
}

export interface UserDocument extends User, Document {}

export interface usersModel extends Model<UserDocument> {
    checkCredentials(email: string, password: string): Promise<UserDocument | null>
}