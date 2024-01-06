import { Controller,Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Role } from '@reduced.to/prisma';
import { Roles } from '../../shared/decorators';
import { AnalyticsService } from './analytics.service';
import { CountQueryDto } from './dto/count-query.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({
  path: 'visit',
  version: '1',
})
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('countClicks')
  @Roles(Role.USER)
  async count(@Query() query : CountQueryDto) {
    const filter: Record<string, any> = {};
    filter.linkId = query;

    // Perform the count operation with the dynamic filter
    const count = await this.analyticsService.countVisitsForLink(filter);

    return { count };
  }

  @Get('countByGeo')
  @Roles(Role.USER)
  async countByGeo(@Query() query: CountQueryDto): Promise<{ geo: string; count: number }[]> {
    // const filter: Record<string, any> = {};
    // filter.linkId = linkId;

    // Perform the count operation with the dynamic filter
    const linkId = query.linkId;
    return this.analyticsService.countVisitsByGeo(linkId);
  }
}