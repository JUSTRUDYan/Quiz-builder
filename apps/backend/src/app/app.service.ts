import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateQuizDto} from "../dto/create-quiz.dto";
import {PrismaService} from "./prisma.service";

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateQuizDto) {
    return this.prisma.quiz.create({
      data: {
        title: dto.title,
        questions: {
          create: dto.questions.map((q) => ({
            text: q.text,
            type: q.type,
            options: q.options?.length ? q.options : [],
            answer: q.answer ?? null,
          })),
        },
      },
      include: { questions: true },
    });
  }

  async findAll() {
    const quizzes = await this.prisma.quiz.findMany({
      include: { questions: true },
      orderBy: { id: 'desc' },
    });
    return quizzes.map((q) => ({
      id: q.id,
      title: q.title,
      questionCount: q.questions.length,
    }));
  }

  async findOne(id: number) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: { questions: true },
    });
    if (!quiz) throw new NotFoundException('Quiz not found');
    return quiz;
  }

  async remove(id: number) {
    await this.prisma.quiz.delete({ where: { id } });
    return { message: 'Quiz deleted successfully' };
  }
}
