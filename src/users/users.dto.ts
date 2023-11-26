import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsStrongPassword } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'User 1',
        description: 'Username',
        required: true
    })
    name: string;

    @IsString()
    @IsStrongPassword()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Password 1',
        description: 'User password',
        required: true
    })
    password: string;
}