import { EnderecoDto } from '../../common/dto/endereco.dto';
import { DocumentoDto } from './documento.dto';
export declare class CreateCuidadorDto {
    nome: string;
    email: string;
    senha: string;
    cpf: string;
    telefone?: string;
    especialidades?: string[];
    dadosBancarios?: any;
    documentos?: DocumentoDto[];
    endereco?: EnderecoDto;
}
