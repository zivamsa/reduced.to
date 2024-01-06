import { IsDefined, IsString } from "class-validator";

export class CountQueryDto {
    @IsString()
    @IsDefined()
    linkId: string;
}
