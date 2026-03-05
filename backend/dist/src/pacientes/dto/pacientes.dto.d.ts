import { EnderecoDto } from '../../common/dto/endereco.dto';
export declare class CreatePacienteDto {
    nome: string;
    dataNascimento: string;
    necessidades?: string;
    endereco?: EnderecoDto;
    familiarId: string;
    parentesco: string;
    isResponsavelFinanceiro?: boolean;
}
