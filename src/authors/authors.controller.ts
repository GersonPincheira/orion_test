import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { authorInterface } from './interfaces/author.input';
import { Author } from 'src/authors/author.schema';

@Controller('authors')
export class AuthorsController {

    constructor(private readonly authorService: AuthorsService){}
    
    @Post()
    createBook(@Body() input: authorInterface): Promise<Author> {
        return this.authorService.createAuthor(input);
    }

    @Get()
    books():Promise<Author[]>{
        return this.authorService.authors();
    }

}
