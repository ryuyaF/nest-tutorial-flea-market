import { Item } from '../entities/item.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemStatus } from './item-status.enum';
import { User } from '../entities/user.entity';
import { BadRequestException } from '@nestjs/common';

@EntityRepository(Item)
export class ItemRepository extends Repository<Item> {
  async createItem(createItemDto: CreateItemDto, user: User): Promise<Item> {
    const item = this.create({
      ...createItemDto,
      status: ItemStatus.ON_SALE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user,
    });

    await this.save(item);

    return item;
  }

  async updateStatus(id: string, user: User): Promise<Item> {
    const item = await this.findOne(id);
    if (item.userId === user.id) {
      throw new BadRequestException('自身の商品を購入することはできません。');
    }
    const savedItem = await this.save({
      ...item,
      status: ItemStatus.SOLD_OUT,
      updatedAt: new Date().toISOString(),
    });
    return savedItem;
  }
}
