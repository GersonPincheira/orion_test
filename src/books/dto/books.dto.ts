import { Prop } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";

export class PagePerChapterDto{
    @Prop({ type: SchemaTypes.ObjectId })
    id: Types.ObjectId;

    @Prop()
    average: string;
}