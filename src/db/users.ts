import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    auth: {
        password: { type: String, required: true, select: false },
        salt: { type: String, select: false },
        sessionToken: { type: String, select: false }
    }
});

type Values = Record<string, any>;

export const UserModel = mongoose.model('User', UserSchema);

export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserBySessionToken = (token: string) => UserModel.findOne({
    'auth.sessionToken': token,
});
export const getUserById = (id: string) => UserModel.findById(id)
export const createUser = async (values: Values) => {
    await new UserModel(values)
    .save()
    .then((user) => user.toObject());
}
export const deleteUserById = (id: string) => UserModel.findByIdAndDelete({_id: id});
export const updateUserById = (id: string, values: Values) => UserModel.findByIdAndUpdate(id, values)