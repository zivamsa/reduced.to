import { AnalyticsService } from './analytics.service';
import { PrismaService } from '@reduced.to/prisma';
import { Test, TestingModule } from '@nestjs/testing';


describe('AnalyticsService', () => {
    let service: AnalyticsService;
    let prismaService: PrismaService;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
            AnalyticsService,
          {
            provide: PrismaService,
            useValue: {
              $transaction: jest.fn(),
              visit: {
                // findMany: jest.fn(),
                count: jest.fn(),
              },
            },
          },
        ],
      }).compile();
  
      service = module.get<AnalyticsService>(AnalyticsService);
      prismaService = module.get<PrismaService>(PrismaService);
  
      // Mocking the $transaction method, we don't really care about the result
      jest.spyOn(prismaService, '$transaction').mockResolvedValue([null, null]);
    });
  
    afterEach(async () => {
      jest.clearAllMocks();
    });

    // it('should return visit count for a specific link', async () => {
    //     const linkId = '123'; // Replace with a valid link ID
    //     const expectedVisitCount = 10; // Replace with the expected visit count
    
    //     prismaService.visit.count.mockResolvedValue(expectedVisitCount);
    
    //     const visitCount = await service.countVisitsForLink(linkId);
    
    //     expect(visitCount).toEqual(expectedVisitCount);
    //     expect(prismaService.visit.count).toHaveBeenCalledWith({
    //       where: {
    //         linkId: linkId ,
    //       },
    //     });
    //   });
});