import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from './book.schema'
import { NewBookInterface } from './interfaces/book.input';
import { PagePerChapterDto } from './dto/books.dto';
import { Author } from '../authors/author.schema';

@Injectable()
export class BooksService {
    constructor(@InjectModel(Book.name) private bookModel: Model<Book>,
    @InjectModel(Author.name) private authorModel: Model<Author>){}

    async  createBook(input: NewBookInterface ): Promise<Book>{
        let authors = []
        try {
            const currentAuthors = await this.authorModel.find({name:{'$in': input.authors}});
        for (const index in input.authors){
            const existAuthor = currentAuthors.find((e)=> e.name == input.authors[index])
            if (!existAuthor){
                const newAuthor = new this.authorModel({name:input.authors[index]})
                await newAuthor.save()
                authors.push(newAuthor._id)
            }else{
                authors.push(existAuthor._id)
            }

        };

        const newBook = new this.bookModel({...input,authors:authors})
        return await newBook.save()
        } catch (error) {
            throw new HttpException(error.message,HttpStatus.FORBIDDEN)
        }
    }

    async books(): Promise<Book[]>{
        try{
            return await this.bookModel.aggregate([
                {
                  '$lookup': {
                    'from': 'authors',
                    'localField': 'authors',
                    'foreignField': '_id',
                    'as': 'authors'
                  }
                }
              ])
        }catch (error){
            throw new HttpException(error.message,HttpStatus.FORBIDDEN)
        }
    }

    async PagePerChapters(book: string): Promise<PagePerChapterDto>{
        try {
            const currentBook = await this.bookModel.findOne({title:book});
        if (!currentBook){
            throw new NotFoundException('No existe el libro seleccionado')
        }
        return {id: currentBook._id, average: ((+currentBook.pages)/(+currentBook.chapters)).toFixed(2)}
        } catch (error) {
            throw error
        }
    }
}
