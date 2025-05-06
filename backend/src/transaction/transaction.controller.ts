/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Controller, Get, Query, DefaultValuePipe, ParseIntPipe, Post, Body, Req, Delete, Param } from '@nestjs/common';
import { Request } from 'express';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) {}
    
    @Get()
    async getTransactions(
        @Req() request: Request,
        @Query('year', new DefaultValuePipe(new Date().getFullYear()), ParseIntPipe) year: number,
    ) {
        return this.transactionService.getTransactions(request.cookies['token'], year);
    }

    @Get('allInMonth')
    async getTransactionsInMonth(
        @Req() request: Request,
        @Query('month', new DefaultValuePipe(new Date().getMonth() + 1), ParseIntPipe) month: number,
        @Query('year', new DefaultValuePipe(new Date().getFullYear()), ParseIntPipe) year: number,
    ) {
        return this.transactionService.getTransactionsInMonth(request.cookies['token'], month, year);
    }

    @Get('analyze')
    async analyzeTransByYear(
        @Req() request: Request,
        @Query('year', new DefaultValuePipe(new Date().getFullYear()), ParseIntPipe) year: number,
    ) {
        return this.transactionService.analyzeTransByYear(request.cookies['token'], year);
    }


    @Post()
    async createTransaction(
        @Req() request: Request,   
        @Body('type') type: string,
        @Body('categoryID') categoryID: string,
        @Body('money') money: string,
        @Body('description') description: string,
        @Body('datetime') datetime: string,
    ) {
        return this.transactionService.createTransaction(request.cookies['token'], type, categoryID, money, description, datetime);
    }

    @Delete(':id')
    async deleteTransaction(@Req() request: Request, @Param('id') transactionID: string) {
        return this.transactionService.deleteTransaction(request.cookies['token'], transactionID);
    }
}