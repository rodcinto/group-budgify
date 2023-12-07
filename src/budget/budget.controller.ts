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
} from '@nestjs/common';
import { BudgetService } from './budget.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

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
  invitationKeyFor(@Request() req: any, @Body() data) {
    const userId = this.extractUserIdFromReq(req);
    return this.budgetService.generateInvitationKeyFor(data.budget_id, userId);
  }

  private extractUserIdFromReq(req: any): number {
    return req.user.user.user_id;
  }
}
