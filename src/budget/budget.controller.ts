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
import { TransactionsService } from 'src/transactions/transactions.service';

@Controller('budget')
export class BudgetController {
  constructor(
    private readonly budgetService: BudgetService,
    private readonly transactionsService: TransactionsService,
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
    return this.budgetService.findOne(+id, userId);
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
  addToBudget(@Request() req: any, @Param('id') id: string, @Body() data: any) {
    const userId = this.extractUserIdFromReq(req);

    return this.transactionsService.add(
      Number(id),
      Number(userId),
      data.amount,
      data.description,
      data.category_id,
    );
  }

  @UseGuards(JwtGuard)
  @Post(':id/take-money')
  @HttpCode(201)
  takeFromBudget(
    @Request() req: any,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    const userId = this.extractUserIdFromReq(req);

    // It should be only possibe to take money if the balance is positive,
    // unless the user is the owner.
    // But I think I can break this logic in two parts.
    return this.transactionsService.subtract(
      Number(id),
      Number(userId),
      data.amount,
      data.description,
      data.category_id,
    );
  }

  private extractUserIdFromReq(req: any): number {
    return req.user.user.user_id;
  }
}
