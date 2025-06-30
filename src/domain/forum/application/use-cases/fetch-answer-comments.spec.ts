import {beforeEach, describe, expect} from "vitest";
import {UniqueEntityID} from "@/core/entities/unique-entity-i-d";
import {FetchQuestionCommentsUseCase} from "@/domain/forum/application/use-cases/fetch-questions-comments";
import {makeQuestionComment} from "../../../../../test/factories/make-question-comment";
import {InMemoryAnswersCommentRepository} from "../../../../../test/repositories/in-memory-answers-comments-repository";
import {FetchAnswerCommentsUseCase} from "@/domain/forum/application/use-cases/fetch-answer-comments";
import {makeAnswerComment} from "../../../../../test/factories/make-answer-comment";

let inMemoryAnswerCommentRepository: InMemoryAnswersCommentRepository
let sut: FetchAnswerCommentsUseCase

describe('Fecth Answers Comments', () => {

    beforeEach(() => {
        inMemoryAnswerCommentRepository = new InMemoryAnswersCommentRepository()
        sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentRepository)
    })

    it('should be able to fetch question answers', async () =>{
        await inMemoryAnswerCommentRepository.create(makeAnswerComment({
            answerId: new UniqueEntityID('answer-1')
        }))

        await inMemoryAnswerCommentRepository.create(makeAnswerComment({
            answerId: new UniqueEntityID('answer-1')
        }))

        await inMemoryAnswerCommentRepository.create(makeAnswerComment({
            answerId: new UniqueEntityID('answer-1')
        }))

        const result = await sut.execute({
            answerId: 'answer-1',
            page: 1,
        })

        expect(result.value?.answerComments).toHaveLength(3)
    })

    it('should be able to fetch paginated answers comments', async () =>{

        for (let i = 1; i <= 22; i++){
            await inMemoryAnswerCommentRepository.create(makeAnswerComment({
                answerId: new UniqueEntityID('answer-1')
            }))
        }

        const result = await sut.execute({
            answerId: 'answer-1',
            page: 2
        })

        expect(result.value?.answerComments).toHaveLength(2)
    })
})
