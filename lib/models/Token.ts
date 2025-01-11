import mongoose, { Document, Schema, model, models } from 'mongoose';

export interface TokenDocument extends Document {
	email: string;
	refreshToken: string;
}

const tokenSchema = new Schema<TokenDocument>({
	email: { type: String, required: true },
	refreshToken: { type: String, required: true }
});

const Token = models.Token || model<TokenDocument>('Token', tokenSchema);

export default Token;