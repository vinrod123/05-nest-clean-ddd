import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerFactory } from 'test/factories/make-answer'
import { AnswerCommentFactory } from 'test/factories/make-answer-comment'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

describe('Delete answer comment (E2E)', () => {
    let app: INestApplication
    let prisma: PrismaService
    let studentFactory: StudentFactory
    let questionFactory: QuestionFactory
    let answerFactory: AnswerFactory
    let answerCommentFactory: AnswerCommentFactory
    let jwt: JwtService

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [
                StudentFactory,
                QuestionFactory,
                AnswerFactory,
                AnswerCommentFactory,
            ],
        }).compile()

        app = moduleRef.createNestApplication()

        prisma = moduleRef.get(PrismaService)
        studentFactory = moduleRef.get(StudentFactory)
        questionFactory = moduleRef.get(QuestionFactory)
        answerFactory = moduleRef.get(AnswerFactory)
        answerCommentFactory = moduleRef.get(AnswerCommentFactory)
        jwt = moduleRef.get(JwtService)

        await app.init()
    })

    test('[DELETE] /answers/comments/:id', async () => {
        const user = await studentFactory.makePrismaStudent()

        const accessToken = jwt.sign({ sub: user.id.toString() })

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id,
        })

        const answer = await answerFactory.makePrismaAnswer({
            questionId: question.id,
            authorId: user.id,
        })

        const answerComment = await answerCommentFactory.makePrismaAnswerComment({
            answerId: answer.id,
            authorId: user.id,
        })

        const answerCommentId = answerComment.id.toString()

        const response = await request(app.getHttpServer())
          .delete(`/answers/comments/${answerCommentId}`)
          .set('Authorization', `Bearer ${accessToken}`)

        expect(response.statusCode).toBe(204)

        const commentOnDatabase = await prisma.comment.findUnique({
            where: {
                id: answerCommentId,
            },
        })

        expect(commentOnDatabase).toBeNull()
    })
})
import {Either, left, right} from "@/core/either";
import {ResourceNotFoundError} from "@/domain/forum/application/use-cases/errors/resource-not-found";
import {NotAllowedError} from "@/domain/forum/application/use-cases/errors/not-allowed";
import { Injectable } from '@nestjs/common';
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answers-comments-repository';
import { DatabaseModule } from '@/infra/database/prisma/repositories/database.module';

interface DeleteAnswerCommentUseCaseRequest{
    authorId: string
    answerCommentId: string
}

type DeleteAnswerCommentUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, null>

@Injectable()
export class DeleteAnswerCommentUseCase{
    constructor(
        private answerCommentsRepository: AnswerCommentsRepository
    ){}

    async execute({
                      authorId,
                      answerCommentId
                  } : DeleteAnswerCommentUseCaseRequest) : Promise<DeleteAnswerCommentUseCaseResponse>{

        const answerComment = await this.answerCommentsRepository.findById(answerCommentId)

        if(!answerComment){
            return left(new ResourceNotFoundError())
        }

        if(answerComment.authorId.toString() !== authorId){
            return left(new NotAllowedError())
        }


        await this.answerCommentsRepository.delete(answerComment)

        return right(null)
    }
}