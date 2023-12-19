import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { BudgetService } from './budget.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';
import { TransactionsService } from '../transactions/transactions.service';
import { IsAuthUserMemberGuard } from './guards/is-auth-user-member.guard';
import { BudgetFacadeFactory } from '../transactions/factory/budget-facade.factory';
import { UserFacadeFactory } from '../transactions/factory/user-facade.factory';

@Controller('budget')
export class BudgetController {
  constructor(
    private readonly budgetService: BudgetService,
    private readonly transactionsService: TransactionsService,
    private readonly budgetFacadeFactory: BudgetFacadeFactory,
    private readonly userFacadeFactory: UserFacadeFactory,
  ) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Request() req: any, @Body() createBudgetDto: CreateBudgetDto) {
    const userId = this.extractUserIdFromReq(req);

    return this.budgetService.create(userId, createBudgetDto);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll(@Request() req: any) {
    const userId = this.extractUserIdFromReq(req);
    return this.budgetService.findAll(userId);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    const userId = this.extractUserIdFromReq(req);
    return this.budgetService.findOneOwned(+id, userId);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateBudgetDto: UpdateBudgetDto,
  ) {
    const userId = this.extractUserIdFromReq(req);
    return this.budgetService.update(+id, userId, updateBudgetDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    const userId = this.extractUserIdFromReq(req);
    return this.budgetService.remove(+id, userId);
  }

  @UseGuards(JwtGuard)
  @Post('generate-invitation')
  invitationKeyFor(@Request() req: any, @Body() data: any) {
    const userId = this.extractUserIdFromReq(req);
    return this.budgetService.generateInvitationKeyFor(data.budget_id, userId);
  }

  @UseGuards(JwtGuard)
  @Post('join')
  @HttpCode(201)
  joinBudget(@Request() req: any, @Body() data: any) {
    const userId = this.extractUserIdFromReq(req);
    return this.budgetService.joinBudget(data.key, userId);
  }

  @UseGuards(JwtGuard)
  @Post(':id/add-money')
  @HttpCode(201)
  async addToBudget(
    @Request() req: any,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    const userId = this.extractUserIdFromReq(req);
    const budgetFacade = await this.budgetFacadeFactory.buildBudgetFacade(
      this.budgetService.findOneById(Number(id)),
    );
    const userFacade = this.userFacadeFactory.buildUserFacade(
      userId,
      budgetFacade,
    );

    return this.transactionsService.add(
      budgetFacade,
      userFacade,
      data.amount,
      data.description,
      data.category_id,
    );
  }

  @UseGuards(JwtGuard)
  @Post(':id/take-money')
  @HttpCode(201)
  async takeFromBudget(
    @Request() req: any,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    const userId = this.extractUserIdFromReq(req);
    const budgetFacade = await this.budgetFacadeFactory.buildBudgetFacade(
      await this.budgetService.findOneById(Number(id)),
    );
    const userFacade = this.userFacadeFactory.buildUserFacade(
      userId,
      budgetFacade,
    );

    // It should be only possibe to take money if the balance is positive,
    // unless the user is the owner.
    // But I think I can break this logic in two parts.
    return this.transactionsService.subtract(
      budgetFacade,
      userFacade,
      data.amount,
      data.description,
      data.category_id,
    );
  }

  @UseGuards(JwtGuard, IsAuthUserMemberGuard)
  @Get(':budgetId/balance')
  balance(@Param('budgetId') budgetId: string) {
    return this.transactionsService.createBalanceReport(Number(budgetId));
  }

  private extractUserIdFromReq(req: any): number {
    return req.user.user.user_id;
  }
}
