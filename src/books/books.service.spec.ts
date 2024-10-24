import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BooksService } from './books.service';
import { HttpException, NotFoundException } from '@nestjs/common';
import { Book } from './book.schema';
import { Author } from '../authors/author.schema';
import { NewBookInterface } from './interfaces/book.input';

// Mocks de los modelos
const mockBookModel = {
    new: jest.fn(),
    constructor: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    exec: jest.fn(),
};

const mockAuthorModel = {
    find: jest.fn().mockResolvedValue([]),
    save: jest.fn(),
    new: jest.fn().mockImplementation((dto) => ({
        ...dto,
        save: jest.fn().mockResolvedValue({ _id: 'newauthorid', ...dto }),
    })),
    constructor: jest.fn(),
};

describe('BooksService', () => {
    let service: BooksService;
    let bookModel: any;
    let authorModel: any;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BooksService,
                {
                    provide: getModelToken(Book.name),
                    useValue: mockBookModel, // Inyectamos el modelo mockeado de Book
                },
                {
                    provide: getModelToken(Author.name),
                    useValue: mockAuthorModel, // Inyectamos el modelo mockeado de Author
                },
            ],
        }).compile();

        service = module.get<BooksService>(BooksService);
        bookModel = module.get(getModelToken(Book.name));
        authorModel = module.get(getModelToken(Author.name));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createBook', () => {

        it('should throw an HttpException when an error occurs', async () => {
            const bookData = { title: 'New Book', authors: ['Author 1'], pages: 100, chapters: 10 };

            authorModel.find.mockRejectedValue(new Error('Error finding authors'));

            await expect(service.createBook(bookData)).rejects.toThrow(HttpException);
        });
    });

    describe('books', () => {
        it('should throw an HttpException when an error occurs', async () => {
            bookModel.find.mockReturnValue({
                exec: jest.fn().mockRejectedValue(new Error('Error fetching books')),
            });

            await expect(service.books()).rejects.toThrow(HttpException);
        });
    });

    describe('PagePerChapters', () => {
        it('should return the average pages per chapter for a valid book', async () => {
            const book = { _id: 'bookid', title: 'Book 1', pages: 100, chapters: 10 };
            bookModel.findOne.mockResolvedValue(book);

            const result = await service.PagePerChapters('Book 1');
            expect(result).toEqual({ id: 'bookid', average: '10.00' });
            expect(bookModel.findOne).toHaveBeenCalledWith({ title: 'Book 1' });
        });

        it('should throw a NotFoundException when the book is not found', async () => {
            bookModel.findOne.mockResolvedValue(null);

            await expect(service.PagePerChapters('Unknown Book')).rejects.toThrow(NotFoundException);
        });
    });
});