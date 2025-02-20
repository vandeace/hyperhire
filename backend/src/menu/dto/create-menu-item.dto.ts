import { IsString, IsOptional, IsInt, IsBoolean } from 'class-validator';

export class CreateMenuItemDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  parentId?: string;

  @IsInt()
  ordering: number;

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @IsOptional()
  @IsString()
  iconClass?: string;

  @IsOptional()
  @IsString()
  routePath?: string;
}
