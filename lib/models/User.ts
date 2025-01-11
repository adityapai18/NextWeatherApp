import mongoose, { Document, Schema, model, models } from 'mongoose';

export interface UserDocument extends Document {
    email: string;
    password: string;
    cities: {
        [key: string]: {
            weather: {
                date: Date;
                description: string;
            }[];
        };
    };
}

const userSchema = new Schema<UserDocument>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cities: {
        type: Map,
        of: new Schema({
            weather: [
                {
                    date: { type: Date, required: true },
                    description: { type: String, required: true }
                }
            ]
        })
    }
});

const User = models.User || model<UserDocument>('User', userSchema);

export default User;