import {beforeEach, describe, expect} from "vitest";
import {UniqueEntityID} from "@/core/entities/unique-entity-i-d";

import {
    InMemoryQuestionCommentRepository
} from "../../../../../test/repositories/in-memory-question-comments-repository";
import {makeQuestionComment} from "../../../../../test/factories/make-question-comment";
import {DeleteQuestionCommentUseCase} from "@/domain/forum/application/use-cases/delete-question-comment";
import {NotAllowedError} from "@/domain/forum/application/use-cases/errors/not-allowed";
import {
    InMemoryQuestionAttachmentsRepository
} from "../../../../../test/repositories/in-memory-question-attachments-repository";

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentRepository
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentsRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete question comment', () => {

    beforeEach(() => {
        inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentRepository()
        sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository)
    })

    it('should be able to delete comment question', async () =>{
        const questionComment = makeQuestionComment()


        await  inMemoryQuestionCommentsRepository.create(questionComment)

        await sut.execute({
            questionCommentId: questionComment.id.toString(),
            authorId: questionComment.authorId.toValue()
        })

        expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0)
    })

    it('should not be able to delete comment question', async () =>{
        const questionComment = makeQuestionComment({
            authorId: new UniqueEntityID('author-1')
        })


        await  inMemoryQuestionCommentsRepository.create(questionComment)

        const result = await sut.execute({
            questionCommentId: questionComment.id.toString(),
            authorId: 'author-2'
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})
