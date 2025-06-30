import {beforeEach, describe, expect} from "vitest";
import {UniqueEntityID} from "@/core/entities/unique-entity-i-d";
import {makeAnswer} from "../../../../../test/factories/make-answer";
import {
    InMemoryQuestionCommentRepository
} from "../../../../../test/repositories/in-memory-question-comments-repository";
import {FetchQuestionCommentsUseCase} from "@/domain/forum/application/use-cases/fetch-questions-comments";
import {makeQuestionComment} from "../../../../../test/factories/make-question-comment";

let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository
let sut: FetchQuestionCommentsUseCase

describe('Fecth Questions Comments', () => {

    beforeEach(() => {
        inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository()
        sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentRepository)
    })

    it('should be able to fetch question comments', async () =>{
        await inMemoryQuestionCommentRepository.create(makeQuestionComment({
            questionId: new UniqueEntityID('question-1')
        }))

        await inMemoryQuestionCommentRepository.create(makeQuestionComment({
            questionId: new UniqueEntityID('question-1')
        }))

        await inMemoryQuestionCommentRepository.create(makeQuestionComment({
            questionId: new UniqueEntityID('question-1')
        }))

        const result = await sut.execute({
            questionId: 'question-1',
            page: 1,
        })

        expect(result.value?.questionComments).toHaveLength(3)
    })

    it('should be able to fetch paginated question comments', async () =>{

        for (let i = 1; i <= 22; i++){
            await inMemoryQuestionCommentRepository.create(makeQuestionComment({
                questionId: new UniqueEntityID('question-1')
            }))
        }

        const result = await sut.execute({
            questionId: 'question-1',
            page: 2
        })

        expect(result.value?.questionComments).toHaveLength(2)
    })
})
