import { IsString, IsNotEmpty, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DocumentoDto {
    @ApiProperty({ example: 'RG', description: 'Tipo do documento' })
    @IsString()
    @IsNotEmpty()
    tipo: string;

    @ApiProperty({ example: 'https://storage.com/rg.pdf', description: 'URL do documento' })
    @IsUrl()
    @IsNotEmpty()
    url: string;
}
