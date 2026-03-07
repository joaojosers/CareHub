// src/services/endpoints.js

export const ENDPOINTS = {
  // Usuários do sistema (ADMIN, CUIDADOR, RESPONSAVEL)
  USUARIOS: "/usuarios",

  // Dados específicos do cuidador
  CUIDADORES: "/cuidadores",

  // Pacientes cadastrados no sistema
  PACIENTES: "/pacientes",

  // Relação de responsáveis por paciente
  PACIENTE_RESPONSAVEIS: "/paciente_responsaveis",

  // Vínculos entre cuidadores e pacientes
  VINCULOS: "/vinculos",

  // Endereços vinculados a cuidadores ou pacientes
  ENDERECOS: "/enderecos",

  // Turnos (horas trabalhadas)
  TURNOS: "/turnos",

  // Relatórios de turnos
  RELATORIOS: "/relatorios",

  // Documentos enviados por cuidadores
  DOCUMENTOS: "/documentos",

  // Pagamentos mensais de cuidadores
  PAGAMENTOS: "/pagamentos",

  // Auditoria do sistema (ações críticas)
  AUDITORIA: "/auditoria",

  // Endpoint de login, se futuramente existir rota específica
  LOGIN: "/login",
};