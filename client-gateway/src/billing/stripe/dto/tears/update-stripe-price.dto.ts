import { PartialType } from "@nestjs/mapped-types";
import { CreateStripePriceDto } from "@billing/stripe/dto/tears/create-stripe-price.dto";
import { IsString } from "class-validator";

export class UpdateStripePriceDto extends PartialType(CreateStripePriceDto) {
    @IsString()
    id : string;
}