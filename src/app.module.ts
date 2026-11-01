import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { typeOrmConfig } from './config/typeorm.config';

import { AuthModule } from './auth/auth.module';
import { CourtsModule } from './courts/courts.module';
import { TimeslotsModule } from './timeslots/timeslots.module';
import { BookingsModule } from './bookings/bookings.module';
import { PaymentsModule } from './payments/payments.module';
import { UsersModule } from './users/users.module';
import { VenuesModule } from './venues/venues.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    // Load .env globally
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Database connection
    TypeOrmModule.forRoot(typeOrmConfig),

    // Modules
    AuthModule,
    UsersModule,
    VenuesModule,
    CourtsModule,
    TimeslotsModule,
    BookingsModule,
    PaymentsModule,
    CategoriesModule,
  ],
})
export class AppModule {
  
}