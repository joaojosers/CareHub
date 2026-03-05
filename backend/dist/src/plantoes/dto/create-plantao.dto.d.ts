import { RelatorioDto } from './relatorio.dto';
export declare class CreatePlantaoDto {
    pacienteId: string;
    cuidadorId?: string;
    dataInicio: string;
    dataFim: string;
    relatorio?: RelatorioDto;
}
