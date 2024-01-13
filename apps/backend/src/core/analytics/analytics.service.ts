import { Injectable } from '@nestjs/common';
import { EntityService } from '../entity.service';
import { Prisma, PrismaService, Visit } from '@reduced.to/prisma';
import { AppConfigService } from '@reduced.to/config';
import { CountryVisitCountDto } from './dto/CountryVisitCountDto';

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

    async countVisitsForLink(linkId: string): Promise<number> {
        const where: Prisma.VisitWhereInput = {
          linkId: { equals: linkId },
        };
    
        return this.prismaService.visit.count({ where });
      }

      async countVisitsByGeo(linkId: string):Promise<CountryVisitCountDto[]> {
        const allVisits = await this.prismaService.visit.findMany({
          where: {
              linkId: linkId,
          },
      });

      const countryCountsMap = new Map<string, number>();

      allVisits.forEach((visit) => {
          let geoLocation = null;
          geoLocation = visit.geo;
          const country = geoLocation?.country || 'Unknown';
          const currentCount = countryCountsMap.get(country) || 0;
          countryCountsMap.set(country, currentCount + 1);
      });

      const resultArray: CountryVisitCountDto[] = [];

      countryCountsMap.forEach((count, country) => {
          resultArray.push({
              country: country,
              count: count,
          });
      });

      return resultArray;
      }
}