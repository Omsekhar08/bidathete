import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AuctionsModule } from './modules/auctions/auctions.module';
import { TeamsModule } from './modules/teams/teams.module';
import { PlayersModule } from './modules/players/players.module';
import { BidsModule } from './modules/bids/bids.module';
import { SponsorsModule } from './modules/sponsors/sponsors.module';
import { ReportsModule } from './modules/reports/reports.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { Controller, Get } from '@nestjs/common';

@Controller('api')
export class SampleController {
  @Get('teams')
  getTeams() {
    return [
      { id: 'team1', name: 'Team Alpha', description: 'Sample team Alpha' },
      { id: 'team2', name: 'Team Beta', description: 'Sample team Beta' },
    ];
  }

  @Get('auctions')
  getAuctions() {
    return [
      { id: 'auc1', title: 'Auction One', status: 'open' },
      { id: 'auc2', title: 'Auction Two', status: 'closed' },
    ];
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri:
          configService.get<string>('MONGODB_URI') ||
          `mongodb://${configService.get<string>('DB_HOST', 'localhost')}:${configService.get<string>('DB_PORT', '27017')}/${configService.get<string>('DB_DATABASE', 'bidathlete')}`,
        // optional options:
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),

    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    AuctionsModule,
    TeamsModule,
    PlayersModule,
    BidsModule,
    SponsorsModule,
    ReportsModule,
    PaymentsModule,
    NotificationsModule,
  ],
  controllers: [AppController, SampleController],
  providers: [AppService],
})
export class AppModule {}
