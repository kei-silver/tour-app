import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { UUID } from 'vue-uuid';

export class TokenDto {
  @IsUUID()
  @ApiProperty({
    example: '2640355a-b13d-44cf-bac5-9d02ef8e13bc',
    description: 'The UUID token for the reservation',
  })
  token: UUID;
}