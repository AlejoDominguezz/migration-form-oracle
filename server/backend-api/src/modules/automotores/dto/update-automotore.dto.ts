import { PartialType } from '@nestjs/mapped-types';
import { CreateAutomotoreDto } from './create-automotore.dto';

export class UpdateAutomotoreDto extends PartialType(CreateAutomotoreDto) {}
