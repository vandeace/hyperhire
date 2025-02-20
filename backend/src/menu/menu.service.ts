import { Injectable, NotFoundException } from '@nestjs/common';
import { MenuItem } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async createMenuItem(dto: CreateMenuItemDto): Promise<MenuItem> {
    const depth = dto.parentId ? await this.calculateDepth(dto.parentId) : 0;

    return this.prisma.menuItem.create({
      data: {
        ...dto,
        depth,
      },
    });
  }

  private async calculateDepth(parentId: string): Promise<number> {
    const parent = await this.prisma.menuItem.findUnique({
      where: { id: parentId },
    });
    return parent ? parent.depth + 1 : 0;
  }

  async getMenuTree() {
    const items = await this.prisma.menuItem.findMany({
      where: { parentId: null },
      include: { children: true },
      orderBy: { ordering: 'asc' },
    });
    return this.buildTree(items);
  }

  private async buildTree(
    items: MenuItem[],
  ): Promise<(MenuItem & { children: any[] })[]> {
    const tree: (MenuItem & { children: any[] })[] = [];
    for (const item of items) {
      const children = await this.prisma.menuItem.findMany({
        where: { parentId: item.id },
        orderBy: { ordering: 'asc' },
      });
      tree.push({
        ...item,
        children: children.length > 0 ? await this.buildTree(children) : [],
      });
    }
    return tree;
  }

  async moveMenuItem(id: string, newParentId: string | null) {
    const item = await this.prisma.menuItem.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException('Menu item not found');
    }

    const newDepth = newParentId ? await this.calculateDepth(newParentId) : 0;

    return this.prisma.menuItem.update({
      where: { id },
      data: {
        parentId: newParentId,
        depth: newDepth,
      },
    });
  }

  async reorderMenuItems(itemIds: string[]) {
    const updates = itemIds.map((id, index) => {
      return this.prisma.menuItem.update({
        where: { id },
        data: { ordering: index },
      });
    });

    return this.prisma.$transaction(updates);
  }

  async updateMenuItem(id: string, dto: UpdateMenuItemDto): Promise<MenuItem> {
    const depth =
      dto.parentId !== undefined
        ? await this.calculateDepth(dto.parentId)
        : undefined;

    const existingItem = await this.prisma.menuItem.findUnique({
      where: { id },
    });

    if (!existingItem) {
      throw new NotFoundException('Menu item not found');
    }

    return this.prisma.menuItem.update({
      where: { id },
      data: {
        ...dto,
        depth: depth !== undefined ? depth : undefined,
      },
    });
  }

  async deleteMenuItem(id: string): Promise<void> {
    // First get all children recursively
    const children = await this.getAllChildren(id);
    const childIds = children.map((child) => child.id);

    // Delete all children and the item itself in a transaction
    await this.prisma.$transaction([
      ...childIds.map((childId) =>
        this.prisma.menuItem.delete({
          where: { id: childId },
        }),
      ),
      this.prisma.menuItem.delete({
        where: { id },
      }),
    ]);
  }

  private async getAllChildren(parentId: string): Promise<MenuItem[]> {
    const children = await this.prisma.menuItem.findMany({
      where: { parentId },
    });

    const allChildren = [...children];
    for (const child of children) {
      const grandChildren = await this.getAllChildren(child.id);
      allChildren.push(...grandChildren);
    }

    return allChildren;
  }

  async getMenuItem(id: string): Promise<MenuItem> {
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id },
      include: { children: true },
    });

    if (!menuItem) {
      throw new NotFoundException('Menu item not found');
    }

    return menuItem;
  }
}
