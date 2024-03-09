import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CronDto {
  //@ApiProperty({ type: String })
  @IsString()
  name: string;

  //@ApiProperty({ type: Number, required: false })
  @IsNumber()
  seconds?: number;
}
