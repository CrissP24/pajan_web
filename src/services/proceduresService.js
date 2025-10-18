import localStorageService from './localStorageService';
import { v4 as uuidv4 } from 'uuid';
import adminService from './adminService';

const PROCEDURES_KEY = 'procedures_data';

const defaultProcedures = [
  {
    id: 'proc-1',
    type: 'certificate',
    title: 'Certificado de Residencia',
    description: 'Documento que acredita la residencia en el cantón de Paján',
    requirements: [
      'Cédula de identidad',
      'Comprobante de domicilio',
      'Formulario de solicitud'
    ],
    cost: 5.00,
    duration: '2-3 días hábiles',
    active: true,
    category: 'certificados',
    createdAt: new Date().toISOString()
  },
  {
    id: 'proc-2',
    type: 'certificate',
    title: 'Certificado de No Adeudo',
    description: 'Documento que certifica que no existen deudas pendientes con el municipio',
    requirements: [
      'Cédula de identidad',
      'Comprobante de pago de impuestos',
      'Formulario de solicitud'
    ],
    cost: 3.00,
    duration: '1-2 días hábiles',
    active: true,
    category: 'certificados',
    createdAt: new Date().toISOString()
  },
  {
    id: 'proc-3',
    type: 'certificate',
    title: 'Certificado de Tradición',
    description: 'Documento que acredita la tradición de un bien inmueble',
    requirements: [
      'Cédula de identidad',
      'Escritura pública',
      'Formulario de solicitud',
      'Pago de tasas'
    ],
    cost: 15.00,
    duration: '5-7 días hábiles',
    active: true,
    category: 'certificados',
    createdAt: new Date().toISOString()
  },
  {
    id: 'proc-4',
    type: 'payment',
    title: 'Pago de Impuestos Prediales',
    description: 'Pago de impuestos sobre bienes inmuebles',
    requirements: [
      'Cédula de identidad',
      'Matrícula del predio',
      'Comprobante de pago anterior'
    ],
    cost: 0.00,
    duration: 'Inmediato',
    active: true,
    category: 'pagos',
    createdAt: new Date().toISOString()
  },
  {
    id: 'proc-5',
    type: 'payment',
    title: 'Pago de Servicios Municipales',
    description: 'Pago de servicios como agua, alcantarillado, etc.',
    requirements: [
      'Cédula de identidad',
      'Recibo de servicios',
      'Comprobante de pago'
    ],
    cost: 0.00,
    duration: 'Inmediato',
    active: true,
    category: 'pagos',
    createdAt: new Date().toISOString()
  },
  {
    id: 'proc-6',
    type: 'payment',
    title: 'Pago de Multas',
    description: 'Pago de multas por infracciones municipales',
    requirements: [
      'Cédula de identidad',
      'Boleta de multa',
      'Comprobante de pago'
    ],
    cost: 0.00,
    duration: 'Inmediato',
    active: true,
    category: 'pagos',
    createdAt: new Date().toISOString()
  }
];

// Inicializar datos por defecto si no existen
if (!localStorageService.getItem(PROCEDURES_KEY)) {
  localStorageService.setItem(PROCEDURES_KEY, defaultProcedures);
}

const proceduresService = {
  getProcedures: async () => {
    return localStorageService.getItem(PROCEDURES_KEY, []);
  },

  getProceduresByType: async (type) => {
    const allProcedures = localStorageService.getItem(PROCEDURES_KEY, []);
    return allProcedures.filter(proc => proc.type === type && proc.active);
  },

  getProceduresByCategory: async (category) => {
    const allProcedures = localStorageService.getItem(PROCEDURES_KEY, []);
    return allProcedures.filter(proc => proc.category === category && proc.active);
  },

  getProcedureById: async (id) => {
    const allProcedures = localStorageService.getItem(PROCEDURES_KEY, []);
    return allProcedures.find(proc => proc.id === id);
  },

  createProcedure: async (procedureData) => {
    const allProcedures = localStorageService.getItem(PROCEDURES_KEY, []);
    const newProcedure = { 
      id: uuidv4(), 
      ...procedureData, 
      active: true, 
      createdAt: new Date().toISOString() 
    };
    allProcedures.push(newProcedure);
    localStorageService.setItem(PROCEDURES_KEY, allProcedures);
    adminService.logActivity('procedure_created', `Trámite "${newProcedure.title}" creado`);
    return newProcedure;
  },

  updateProcedure: async (id, updatedData) => {
    let allProcedures = localStorageService.getItem(PROCEDURES_KEY, []);
    allProcedures = allProcedures.map(proc => 
      proc.id === id ? { ...proc, ...updatedData, updatedAt: new Date().toISOString() } : proc
    );
    localStorageService.setItem(PROCEDURES_KEY, allProcedures);
    adminService.logActivity('procedure_updated', `Trámite "${updatedData.title || id}" actualizado`);
    return allProcedures.find(proc => proc.id === id);
  },

  deleteProcedure: async (id) => {
    let allProcedures = localStorageService.getItem(PROCEDURES_KEY, []);
    const deletedProcedure = allProcedures.find(proc => proc.id === id);
    allProcedures = allProcedures.filter(proc => proc.id !== id);
    localStorageService.setItem(PROCEDURES_KEY, allProcedures);
    adminService.logActivity('procedure_deleted', `Trámite "${deletedProcedure?.title || id}" eliminado`);
    return true;
  },

  toggleProcedureStatus: async (id) => {
    let allProcedures = localStorageService.getItem(PROCEDURES_KEY, []);
    allProcedures = allProcedures.map(proc => 
      proc.id === id ? { ...proc, active: !proc.active, updatedAt: new Date().toISOString() } : proc
    );
    localStorageService.setItem(PROCEDURES_KEY, allProcedures);
    const procedure = allProcedures.find(proc => proc.id === id);
    adminService.logActivity('procedure_toggled', `Trámite "${procedure.title}" ${procedure.active ? 'activado' : 'desactivado'}`);
    return procedure;
  },

  getProceduresStats: async () => {
    const allProcedures = localStorageService.getItem(PROCEDURES_KEY, []);
    return {
      total: allProcedures.length,
      active: allProcedures.filter(p => p.active).length,
      certificates: allProcedures.filter(p => p.type === 'certificate' && p.active).length,
      payments: allProcedures.filter(p => p.type === 'payment' && p.active).length
    };
  }
};

export default proceduresService;
