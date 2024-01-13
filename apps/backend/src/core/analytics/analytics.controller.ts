import { Controller,Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Role } from '@reduced.to/prisma';
import { Roles } from '../../shared/decorators';
import { AnalyticsService } from './analytics.service';
import { CountQueryDto } from './dto/count-query.dto';
import { CountryVisitCountDto } from './dto/CountryVisitCountDto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({
  path: 'visit',
  version: '1',
})
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('countClicks')
  @Roles(Role.ADMIN)
  async count(@Query() query : CountQueryDto) {
    const linkId = query.linkId;
    const count = await this.analyticsService.countVisitsForLink(linkId);
    return { count };
  }

  @Get('countByGeo')
  @Roles(Role.ADMIN)
    async getVisitCountsByCountry(@Param('linkId') linkId: string): Promise<CountryVisitCountDto[]> {
    return this.analyticsService.countVisitsByGeo(linkId);
  }
}