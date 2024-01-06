import { Injectable } from '@nestjs/common';
import { EntityService } from '../entity.service';
import { Prisma, PrismaService, Visit } from '@reduced.to/prisma';
import { AppConfigService } from '@reduced.to/config';

@Injectable()
export class AnalyticsService extends EntityService<Visit> {
  constructor(private readonly config: AppConfigService, prismaService: PrismaService) {
    super(prismaService);
  }

  get model(): string {
    return 'visit';
  }

  get selectFields(): Partial<Record<keyof Prisma.VisitWhereInput, any | boolean>> {
    return {
      id: true,
      ip: true,
      userAgent: true,
      geo: true,
      link: {
        select: {
          url: true,
          key: true,
        },
      },
      createdAt: true,
    };
  }

  get filterFields(): Partial<Record<keyof Prisma.VisitWhereInput, any | boolean>> {
    return {
        link: {
            key: true,
            url: true,
          },
    };
  }

    // async countVisitsForLink(linkId: string): Promise<number> {
    async countVisitsForLink(where?: Prisma.VisitWhereInput): Promise<number> {
        // const where: Prisma.VisitWhereInput = {
        //   linkId: { equals: linkId }, // Specify the condition for linkId equality
        // };
    
        return this.prismaService.visit.count({ where });
      }

      async countVisitsByGeo(linkId: string): Promise<{ geo: string; count: number }[]> {
        const visitGeoCounts = await this.prismaService.visit.groupBy({
          by: ['geo'],
          where: {
            linkId,
          },
          _count: {
            geo: true,
          },
        });
    
        return visitGeoCounts.map((result) => ({
          geo: result.geo.toString() ?? 'Unknown', 
          count: result._count?.geo ?? 0,
        }));
      }
//   async countByLinkId(where?: Prisma.VisitWhereInput): Promise<number> {
//     return this.prismaService.visit.count({ where });
//   }
}