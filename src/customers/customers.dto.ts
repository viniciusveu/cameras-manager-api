import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsStrongPassword } from "class-validator";

export class CreateCustomerDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Customer 1',
        description: 'Customer name',
        required: true
    })
    name: string;

    @IsString()
    @IsStrongPassword()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Password 1',
        description: 'Customer password',
        required: true
    })
    password: string;
}