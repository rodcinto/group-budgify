import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CategoriesService } from './categories.service';
import { JwtGuard } from '../../auth/guards/jwt-auth.guard';
import { IsOwnedByAuthUserGuard } from '../guards/is-owned-by-auth-user.guard';

@Controller('budget')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(JwtGuard, IsOwnedByAuthUserGuard)
  @Post(':budgetId/categories')
  create(
    @Param('budgetId') budgetId: number,
    @Body()
    createCategoriesDtos:
      | Prisma.BudgetCategoryUncheckedCreateInput
      | Prisma.BudgetCategoryUncheckedCreateInput[],
  ) {
    const injectID = <T>(dto: T, paramId: string | number) => ({
      ...dto,
      budget_id: Number(paramId),
    });

    if (Array.isArray(createCategoriesDtos)) {
      createCategoriesDtos = createCategoriesDtos.map(
        (dto: Prisma.BudgetCategoryUncheckedCreateInput) =>
          injectID(dto, budgetId),
      );

      return this.categoriesService.createMany(createCategoriesDtos);
    }

    createCategoriesDtos = injectID(createCategoriesDtos, budgetId);
    return this.categoriesService.createOne(createCategoriesDtos);
  }

  @UseGuards(JwtGuard, IsOwnedByAuthUserGuard)
  @Get(':budgetId/categories')
  findAll(@Param('budgetId') budgetId: number) {
    return this.categoriesService.findAll(Number(budgetId));
  }

  @UseGuards(JwtGuard, IsOwnedByAuthUserGuard)
  @Get(':budgetId/categories/:categoryId')
  findOne(
    @Param('budgetId') budgetId: number,
    @Param('categoryId') categoryId: number,
  ) {
    return this.categoriesService.findOne(Number(budgetId), Number(categoryId));
  }

  @UseGuards(JwtGuard, IsOwnedByAuthUserGuard)
  @Patch(':budgetId/categories/:categoryId')
  update(
    @Param('budgetId') budgetId: number,
    @Param('categoryId') categoryId: number,
    @Body()
    updateCategory: Prisma.BudgetCategoryUncheckedUpdateInput,
  ) {
    return this.categoriesService.update(
      Number(budgetId),
      Number(categoryId),
      updateCategory,
    );
  }

  @UseGuards(JwtGuard, IsOwnedByAuthUserGuard)
  @Delete(':budgetId/categories/:categoryId')
  delete(
    @Param('budgetId') budgetId: number,
    @Param('categoryId') categoryId: number,
  ) {
    return this.categoriesService.delete(Number(budgetId), Number(categoryId));
  }
}
