import { PartialType } from "@nestjs/mapped-types";
import { CreateStripeProductDto } from "@billing/stripe/dto/products/create-stripe-product.dto";
import { IsString } from "class-validator";

export class UpdateStripeProductDto extends PartialType(CreateStripeProductDto) {
    @IsString()
    id : string;
}