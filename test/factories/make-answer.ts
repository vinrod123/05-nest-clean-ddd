import {Answer, AnswerProps} from "@/domain/forum/enterprise/entities/answer";
import {Slug} from "@/domain/forum/enterprise/entities/value-objects/slug";
import {UniqueEntityID} from "@/core/entities/unique-entity-i-d";
import {faker} from '@faker-js/faker'

export function makeAnswer(override: Partial<AnswerProps> = {}, id?: UniqueEntityID){
    const question = Answer.create({
        questionId: new UniqueEntityID(),
        authorId: new UniqueEntityID('1'),
        content: faker.lorem.text(),
        ...override
    },
        id,
        )

    return question
}