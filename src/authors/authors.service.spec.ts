import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { AuthorsService } from './authors.service';
import { HttpException } from '@nestjs/common';
import { Author } from './author.schema';

// Creando un mock del modelo Author
const mockAuthorModel = {
    find: jest.fn().mockResolvedValue([]),
    save: jest.fn(),
    new: jest.fn().mockImplementation((dto) => ({
        ...dto,
        save: jest.fn().mockResolvedValue({ _id: 'newauthorid', ...dto }),
    })),
    constructor: jest.fn(),
};

describe('AuthorsService', () => {
    let service: AuthorsService;
    let model: any;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthorsService,
                {
                    provide: getModelToken(Author.name),
                    useValue: mockAuthorModel, // Inyectar el modelo mockeado
                },
            ],
        }).compile();

        service = module.get<AuthorsService>(AuthorsService);
        model = module.get(getModelToken(Author.name));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createAuthor', () => {

        it('should throw an HttpException when an error occurs', async () => {
            const authorData = { name: 'John Doe', books: [] };

            model.save.mockRejectedValue(new Error('Some error'));

            await expect(service.createAuthor(authorData)).rejects.toThrow(HttpException);
        });
    });

    describe('authors', () => {
        it('should return an array of authors', async () => {
            const authorsArray = [{ name: 'Author 1', books: [] }, { name: 'Author 2', books: [] }];
            model.find.mockReturnValue({
                exec: jest.fn().mockResolvedValue(authorsArray), // Simular el método find().exec()
            });

            const result = await service.authors();
            expect(result).toEqual(authorsArray);
            expect(model.find).toHaveBeenCalled();
        });

        it('should throw an HttpException when an error occurs', async () => {
            model.find.mockReturnValue({
                exec: jest.fn().mockRejectedValue(new Error('Error fetching authors')),
            });

            await expect(service.authors()).rejects.toThrow(HttpException);
        });
    });
});