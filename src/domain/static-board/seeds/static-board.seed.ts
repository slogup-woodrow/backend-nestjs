import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { StaticBoardRepository } from '../repositories/static-board.repository';
import { StaticBoard } from '../entities/static-board.entity';

export class StaticBoardSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ) {
    //방식 1: Repository 패턴으로 고정 데이터 생성
    console.log('🔧 Creating static data with Repository...');
    const staticBoardRepository = new StaticBoardRepository(dataSource);

    await dataSource.transaction(async (transactionManager) => {
      await staticBoardRepository.createStaticBoard(
        {
          birth: new Date('2000-10-10'),
          body: '초기 seed 목업 내용',
          category: '공지사항',
          isActivated: true,
          writer: '김작가',
          phone: '010-1234-5678',
        },
        transactionManager,
      );
    });

    // 🎲 방식 2: Factory로 랜덤 데이터 생성
    //if (process.env.NODE_ENV !== 'prod') {}
    console.log('🎲 Creating random data with Factory...');
    const staticBoardFactory = factoryManager.get(StaticBoard);

    // 공지사항 카테고리로 5개
    await staticBoardFactory.saveMany(5, {
      category: '공지사항',
      isActivated: true,
    });

    // 완전 랜덤 10개
    await staticBoardFactory.saveMany(10);

    console.log('✅ 15 random records created with Factory!');
    console.log('🎯 All StaticBoard seeding completed!');
  }
}
