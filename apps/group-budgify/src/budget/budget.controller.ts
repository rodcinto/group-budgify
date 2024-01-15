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
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { BudgetService } from './budget.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';
import { IsAuthUserMemberGuard } from './guards/is-auth-user-member.guard';

@Controller('budget')
export class BudgetController {
  constructor(
    private readonly budgetService: BudgetService,
    @Inject('transaction') private readonly client: ClientProxy,
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

  @UseGuards(JwtGuard, IsAuthUserMemberGuard)
  @Post(':budgetId/add-money')
  @HttpCode(201)
  async addToBudget(
    @Request() req: any,
    @Param('budgetId') budgetId: number,
    @Body() data: any,
  ): Promise<Observable<object>> {
    const user_id = this.extractUserIdFromReq(req);

    const budget = await this.budgetService.findOneById(Number(budgetId));

    const pattern = { cmd: 'add-money' };
    const payload = {
      user_id,
      budget: {
        id: budget.id,
        owner_id: budget.owner_id,
      },
      amount: data.amount,
      description: data.description,
      category_id: data.category_id,
    };

    return this.client.send<object>(pattern, payload);
  }

  @UseGuards(JwtGuard, IsAuthUserMemberGuard)
  @Post(':budgetId/take-money')
  @HttpCode(201)
  async takeFromBudget(
    @Request() req: any,
    @Param('budgetId') budgetId: string,
    @Body() data: any,
  ): Promise<Observable<object>> {
    const user_id = this.extractUserIdFromReq(req);

    const budget = await this.budgetService.findOneById(Number(budgetId));

    const pattern = { cmd: 'take-money' };
    const payload = {
      user_id,
      budget: {
        id: budget.id,
        owner_id: budget.owner_id,
      },
      amount: data.amount,
      description: data.description,
      category_id: data.category_id,
    };

    return this.client.send<object>(pattern, payload);
  }

  @UseGuards(JwtGuard, IsAuthUserMemberGuard)
  @Get(':budgetId/balance')
  balance(@Param('budgetId') budgetId: string): Observable<object> {
    const pattern = { cmd: 'balance-report' };
    return this.client.send<object>(pattern, { budgetId });
  }

  private extractUserIdFromReq(req: any): number {
    return req.user.user.user_id;
  }
}
