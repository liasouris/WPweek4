import mongoose, { Document, Schema, Model } from "mongoose";

interface ITodo {
    todo: string;
    checked: boolean;
}

interface IUser extends Document {
    name: string;
    todos: ITodo[];
}

const TodoSchema: Schema = new Schema({
    todo: { type: String, required: true },
    checked: { type: Boolean, default: false },
});

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    todos: { type: [TodoSchema], default: [] },
});

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export { User, IUser, ITodo };
