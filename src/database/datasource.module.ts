import { Global, Logger, Module } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: DataSource,
      inject: [],
      useFactory: async () => {
        try {
          const dataSource = new DataSource({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            migrations: ['dist/migrations*.js'],
            entities: ['dist/**/**/*.entity.js'],
            migrationsRun: true,
            synchronize: true,
            logging: ['error'],
          });
          Logger.log(`**** ${process.env.STAGE} DATABASE CONNECTING ****`);
          const dataSourceInfo = await dataSource.initialize();
          if (!dataSourceInfo.isInitialized) {
            Logger.warn('**** DB FAILED TO CONNECT! ****');
          }
          Logger.log(`**** ${process.env.STAGE} DATABASE CONNECTED ****`);
          return dataSource;
        } catch (error) {
          Logger.error(' **** ERROR CONNECTING TO DATABASE **** ' + error);
        }
      },
    },
  ],
  exports: [DataSource],
})
export class DataSourceModule {}
