import { Body, Controller, Get, Post } from '@nestjs/common';
import { NewBookInterface } from './interfaces/book.input';
import { Book } from 'src/books/book.schema';
import { BooksService } from './books.service';
import { PagePerChapterDto } from './dto/books.dto';

@Controller('books')
export class BooksController {

    constructor(private readonly bookService:BooksService){}
    @Post()
    createBook(@Body() input: NewBookInterface): Promise<Book> {
        return this.bookService.createBook(input);
    }

    @Get()
    books():Promise<Book[]>{
        return this.bookService.books();
    }

    @Post('pagesPerChapters')
    pagePerChapters(@Body() input: {'book': string}): Promise<PagePerChapterDto>{
        return this.bookService.PagePerChapters(input.book)
    }
}
