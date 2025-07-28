import {Answer, AnswerProps} from "@/domain/forum/enterprise/entities/answer";
import {Slug} from "@/domain/forum/enterprise/entities/value-objects/slug";
import {UniqueEntityID} from "@/core/entities/unique-entity-i-d";
import {faker} from '@faker-js/faker'
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { PrismaAnswerMapper } from '@/infra/database/prisma/mappers/prism-answer-mapper';

export function makeAnswer(
  override: Partial<AnswerProps> = {},
  id?: UniqueEntityID,
) {
    const answer = Answer.create(
      {
          authorId: new UniqueEntityID(),
          questionId: new UniqueEntityID(),
          content: faker.lorem.text(),
          ...override,
      },
      id,
    )

    return answer
}

@Injectable()
export class AnswerFactory {
    constructor(private prisma: PrismaService) {}

    async makePrismaAnswer(data: Partial<AnswerProps> = {}): Promise<Answer> {
        const answer = makeAnswer(data)

        await this.prisma.answer.create({
            data: PrismaAnswerMapper.toPrisma(answer),
        })

        return answer
    }
}