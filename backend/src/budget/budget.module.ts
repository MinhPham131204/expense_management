/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Budget, BudgetSchema } from 'src/schemas/budget.schema';
import { BudgetService } from './budget.service';
import { BudgetController } from './budget.controller';
import { TransactionModule } from 'src/transaction/transaction.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Budget.name, schema: BudgetSchema }]),
        TransactionModule,
    ],
    providers: [BudgetService],
    controllers: [BudgetController]
})
export class BudgetModule {}