import { IsString } from 'class-validator';

export class ParseDto {
	@IsString({message: 'VIN not set'})
	vin: string;
}
