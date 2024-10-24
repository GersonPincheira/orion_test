import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, SchemaTypes, Types } from 'mongoose';

export type BookDocument = HydratedDocument<Book>;

@Schema({timestamps: true})
export class Book {
    @Prop({required: true})
    title: string;

    @Prop({required: true})
    chapters: number;

    @Prop({required: true})
    pages: number;

    @Prop({ref:'authors'})
    authors: Types.ObjectId[]

}

export const BookSchema = SchemaFactory.createForClass(Book);