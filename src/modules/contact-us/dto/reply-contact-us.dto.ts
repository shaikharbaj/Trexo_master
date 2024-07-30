import { IsBoolean, IsNotEmpty, IsOptional } from "class-validator";

export class ReplyContactUsDto {

    @IsNotEmpty({ message: "Please enter reply message." })
    readonly reply_message: string;

    @IsOptional()
    @IsBoolean({ message: 'Please enter valid value.' })
    readonly is_active: boolean;
}

