import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RiotApiModule } from 'src/riot.api/riot.api.module';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { Match, matchSchema } from './schemas/match.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Match.name, schema: matchSchema }]), RiotApiModule],
  controllers: [MatchesController],
  providers: [MatchesService],
})
export class MatchesModule {}
