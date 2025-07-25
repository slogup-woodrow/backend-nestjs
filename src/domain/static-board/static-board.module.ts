import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaticBoard } from './entities/static-board.entity';
import { StaticBoardService } from './services/static-board.service';
import { StaticBoardRepository } from './repositories/static-board.repository';
import { StaticBoardController } from './controllers/static-board.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StaticBoard])],
  controllers: [StaticBoardController],
  providers: [StaticBoardService, StaticBoardRepository],
  exports: [],
})
export class StaticBoardModule {}
