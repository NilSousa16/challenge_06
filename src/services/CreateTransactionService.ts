import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoriesRepository from '../repositories/CategoriesRepository';

import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getCustomRepository(CategoriesRepository);

    const { total } = await transactionRepository.getBalance();

    if (type === 'outcome' && total < value) {
      throw new AppError('Without balance');
    }

    // Use type let
    let findCategoryExists = await categoryRepository.findOne({
      where: { title: category },
    });

    // Category not exists
    if (!findCategoryExists) {
      findCategoryExists = categoryRepository.create({
        title: category,
      });
      await categoryRepository.save(findCategoryExists);
    }

    // Create entity
    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category: findCategoryExists,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
