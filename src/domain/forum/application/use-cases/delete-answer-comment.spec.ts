import {beforeEach, describe, expect} from "vitest";
import {InMemoryQuestionsRepository} from "../../../../../test/repositories/in-memory-questions-repository";
import {UniqueEntityID} from "@/core/entities/unique-entity-i-d";
import {makeQuestion} from "../../../../../test/factories/make-question";
import {makeAnswer} from "../../../../../test/factories/make-answer";
import {
    InMemoryQuestionCommentRepository
} from "../../../../../test/repositories/in-memory-question-comments-repository";
import {CommentOnQuestionUseCase} from "@/domain/forum/application/use-cases/comment-on-question";
import {DeleteQuestionUseCase} from "@/domain/forum/application/use-cases/delete-question";
import {makeQuestionComment} from "../../../../../test/factories/make-question-comment";
import {DeleteQuestionCommentUseCase} from "@/domain/forum/application/use-cases/delete-question-comment";
import {InMemoryAnswersCommentRepository} from "../../../../../test/repositories/in-memory-answers-comments-repository";
import {DeleteAnswerCommentUseCase} from "@/domain/forum/application/use-cases/delete-answer-comment";
import {makeAnswerComment} from "../../../../../test/factories/make-answer-comment";
import {NotAllowedError} from "@/domain/forum/application/use-cases/errors/not-allowed";

let inMemoryAnswerCommentsRepository: InMemoryAnswersCommentRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete Answer Comment', () => {
    beforeEach(() => {
        inMemoryAnswerCommentsRepository = new InMemoryAnswersCommentRepository()

        sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository)
    })

    it('should be able to delete a answer comment', async () => {
        const answerComment = makeAnswerComment()

        await inMemoryAnswerCommentsRepository.create(answerComment)

        await sut.execute({
            answerCommentId: answerComment.id.toString(),
            authorId: answerComment.authorId.toString(),
        })

        expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0)
    })

    it('should not be able to delete another user answer comment', async () => {
        const answerComment = makeAnswerComment({
            authorId: new UniqueEntityID('author-1'),
        })

        await inMemoryAnswerCommentsRepository.create(answerComment)

        const result = await sut.execute({
            answerCommentId: answerComment.id.toString(),
            authorId: 'author-2',
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})
