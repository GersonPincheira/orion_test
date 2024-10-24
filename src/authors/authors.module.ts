import { Module } from '@nestjs/common';
import { AuthorsController } from './authors.controller';
import { AuthorsService } from './authors.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Author, AuthorSchema } from 'src/authors/author.schema';

@Module({
  imports:[MongooseModule.forFeature([{ name: Author.name, schema: AuthorSchema }]),],
  controllers: [AuthorsController],
  providers: [AuthorsService]
})
export class AuthorsModule {}
