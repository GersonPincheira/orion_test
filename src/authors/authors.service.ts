import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { authorInterface } from './interfaces/author.input';
import { Author } from './author.schema';


@Injectable()
export class AuthorsService {
    constructor(@InjectModel(Author.name) private authorModel: Model<Author>){}

    async createAuthor(input: authorInterface){
        try {
            const newAuthor = new this.authorModel(input)
            return await newAuthor.save()
        } catch (error) {
            throw new HttpException(error.message,HttpStatus.FORBIDDEN)
        }
    }

    async authors(): Promise<Author[]>{
        try {
            return await this.authorModel.find({}).exec()
        } catch (error) {
            throw new HttpException(error.message,HttpStatus.FORBIDDEN)
        }
    }
}
