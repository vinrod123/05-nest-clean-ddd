import {Question, QuestionProps} from "@/domain/forum/enterprise/entities/question";
import {Slug} from "@/domain/forum/enterprise/entities/value-objects/slug";
import {UniqueEntityID} from "@/core/entities/unique-entity-i-d";
import {faker} from '@faker-js/faker'

export function makeQuestion(override: Partial<QuestionProps> = {}, id?: UniqueEntityID){
    const question = Question.create({
        title: faker.lorem.sentence(),
        slug: Slug.create('example-question'),
        authorId: new UniqueEntityID('1'),
        content: faker.lorem.text(),
        ...override
    },
        id,
        )

    return question
}