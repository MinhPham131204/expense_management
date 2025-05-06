/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { Request } from 'express';
import { BudgetService } from './budget.service';

@Controller('budget')
export class BudgetController {
    constructor(private readonly budgetService: BudgetService) {}

    @Get()
    getAllBudgets(
        @Req() request: Request,
    ) {
        return this.budgetService.getBudget(request.cookies['token']);
    }

    @Get('analyze')
    analyzeBudgetByMonth(
        @Req() request: Request,
    ) {
        return this.budgetService.analyzeBudgetByMonth(request.cookies['token'], 3, new Date().getFullYear());
    }

    @Post('create')
    async createBudget(
        @Req() request: Request,
        @Body('categoryID') categoryID: string,
        @Body('budget') budget: string,
    ) {
        return await this.budgetService.createBudget(request.cookies['token'], categoryID, budget);
    }

    @Put('update')
    async updateBudget(
        @Body('id') id: string,
        @Body('budget') budget: string,
    ) {
        return await this.budgetService.updateBudget(id, budget);
    }

    // @Get('warning')
    // async warningBudget(
    //     @Req() request: Request,
    //     @Query('month', new DefaultValuePipe(new Date().getMonth() + 1), ParseIntPipe) month: number,
    //     @Query('year', new DefaultValuePipe(new Date().getFullYear()), ParseIntPipe) year: number,
    // ) {
    //     return await this.budgetService.getWarningBudgets(request.cookies['token'], month, year);
    // }

    @Get(':id')
    getBudgetById(
        @Req() request: Request,
        @Param() params: any
    ) {
        return this.budgetService.getBudgetById(request.cookies['token'], params.id);
    }

    @Delete('delete/:id')
    async deleteBudget(
        @Param() params: any
    ) {
        return await this.budgetService.deleteBudget(params.id);
    }
}