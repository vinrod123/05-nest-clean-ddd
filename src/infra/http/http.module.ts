import { Module } from '@nestjs/common'

import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateQuestionController } from './controllers/create-question.controller'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student'
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { GetQuestionBySlugController } from './controllers/get-question-by-slug.controller'
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug'
import { DatabaseModule } from '@/infra/database/database.module';
import { FetchRecentQuestionsController } from '@/infra/http/controllers/fetch-recent-question.controller';
import { EditQuestionController } from '@/infra/http/controllers/edit-question.controller';
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question';
import { DeleteQuestionController } from '@/infra/http/controllers/delete-question.controller';
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question';
import { AnswerQuestionController } from '@/infra/http/controllers/answer-question.controller';
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question';
import { EditAnswerController } from '@/infra/http/controllers/edit-answer.controller';
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer';
import { DeleteAnswerController } from '@/infra/http/controllers/delete-answer.controller';
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer';
import { FetchQuestionAnswersController } from '@/infra/http/controllers/fetch-question-answers.controller';
import { FetchQuestionsAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-questions-answers';
import { ChooseQuestionBestAnswerController } from '@/infra/http/controllers/choose-question-best-answer.controller';
import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer';
import { CommentOnQuestionController } from '@/infra/http/controllers/comment-on-question.controller';
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question';
import { DeleteQuestionCommentController } from '@/infra/http/controllers/delete-question-comment.controller';
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment';
import { CommentOnAnswerController } from '@/infra/http/controllers/comment-on-answer.controller';
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer';
import { DeleteAnswerCommentController } from '@/infra/http/controllers/delete-answer-comment.controller';
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment';
import { FetchAnswerCommentsController } from '@/infra/http/controllers/fetch-answer-comments.controller';
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments';
import { FetchQuestionCommentsController } from '@/infra/http/controllers/fetch-question-comments.controller';
import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-questions-comments';
import { UploadAttachmentController } from '@/infra/http/controllers/upload-attachment.controller';
import { StorageModule } from '@/infra/storage/storage.module';
import { UploadAndCreateAttachmentUseCase } from '@/domain/forum/application/use-cases/upload-and-create-attachment';
import { ReadNotificationController } from '@/infra/http/controllers/read-notification.controller';
import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification';

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
    GetQuestionBySlugController,
    EditQuestionController,
    DeleteQuestionController,
    AnswerQuestionController,
    EditAnswerController,
    DeleteAnswerController,
    FetchQuestionAnswersController,
    ChooseQuestionBestAnswerController,
    CommentOnQuestionController,
    DeleteQuestionCommentController,
    CommentOnAnswerController,
    DeleteAnswerCommentController,
    FetchQuestionCommentsController,
    FetchAnswerCommentsController,
    UploadAttachmentController,
    ReadNotificationController
  ],
  providers: [
    CreateQuestionUseCase,
    FetchRecentQuestionsUseCase,
    RegisterStudentUseCase,
    AuthenticateStudentUseCase,
    GetQuestionBySlugUseCase,
    EditQuestionUseCase,
    DeleteQuestionUseCase,
    AnswerQuestionUseCase,
    EditAnswerUseCase,
    DeleteAnswerUseCase,
    FetchQuestionsAnswersUseCase,
    ChooseQuestionBestAnswerUseCase,
    CommentOnQuestionUseCase,
    DeleteQuestionCommentUseCase,
    CommentOnAnswerUseCase,
    DeleteAnswerCommentUseCase,
    FetchQuestionCommentsUseCase,
    FetchAnswerCommentsUseCase,
    UploadAndCreateAttachmentUseCase,
    ReadNotificationUseCase
  ],
})
export class HttpModule {}