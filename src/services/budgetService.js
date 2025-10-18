import localStorageService from './localStorageService';
import { v4 as uuidv4 } from 'uuid';
import adminService from './adminService';

const BUDGET_KEY = 'budget_data';
const BUDGET_SECTIONS_KEY = 'budget_sections_data';

const defaultBudgetSections = [
  {
    id: 'budget-section-1',
    title: 'Transparencia Presupuestaria',
    content: 'El GAD Municipal de Paján mantiene un compromiso firme con la transparencia en la gestión de los recursos públicos. Aquí podrás encontrar información detallada sobre nuestro presupuesto anual, ejecución financiera y rendición de cuentas.',
    additionalContent: 'Nuestro presupuesto está diseñado para promover el desarrollo integral del cantón, priorizando las necesidades de la comunidad y garantizando el uso eficiente de los recursos públicos.',
    icon: 'dollar',
    published: true,
    order: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: 'budget-section-2',
    title: 'Presupuesto Anual 2024',
    content: 'Información detallada del presupuesto municipal para el año 2024, incluyendo ingresos, gastos y proyectos prioritarios.',
    additionalContent: 'El presupuesto 2024 se enfoca en el desarrollo de infraestructura, servicios básicos y programas sociales para beneficio de toda la comunidad.',
    icon: 'chart',
    published: true,
    order: 2,
    createdAt: new Date().toISOString()
  }
];

const defaultBudgetData = [
  {
    id: 'budget-2024',
    year: 2024,
    totalIncome: 2500000.00,
    totalExpenses: 2400000.00,
    categories: [
      {
        name: 'Ingresos Corrientes',
        amount: 1800000.00,
        percentage: 72,
        subcategories: [
          { name: 'Impuestos', amount: 1200000.00 },
          { name: 'Tasas y Contribuciones', amount: 400000.00 },
          { name: 'Transferencias', amount: 200000.00 }
        ]
      },
      {
        name: 'Ingresos de Capital',
        amount: 700000.00,
        percentage: 28,
        subcategories: [
          { name: 'Préstamos', amount: 500000.00 },
          { name: 'Donaciones', amount: 200000.00 }
        ]
      }
    ],
    expenses: [
      {
        name: 'Gastos de Personal',
        amount: 1200000.00,
        percentage: 50
      },
      {
        name: 'Bienes y Servicios',
        amount: 600000.00,
        percentage: 25
      },
      {
        name: 'Inversión Pública',
        amount: 400000.00,
        percentage: 17
      },
      {
        name: 'Otros Gastos',
        amount: 200000.00,
        percentage: 8
      }
    ],
    published: true,
    createdAt: new Date().toISOString()
  }
];

// Inicializar datos por defecto si no existen
if (!localStorageService.getItem(BUDGET_SECTIONS_KEY)) {
  localStorageService.setItem(BUDGET_SECTIONS_KEY, defaultBudgetSections);
}
if (!localStorageService.getItem(BUDGET_KEY)) {
  localStorageService.setItem(BUDGET_KEY, defaultBudgetData);
}

const budgetService = {
  getBudgetSections: async () => {
    return localStorageService.getItem(BUDGET_SECTIONS_KEY, []);
  },

  getPublishedBudgetSections: async () => {
    const allSections = localStorageService.getItem(BUDGET_SECTIONS_KEY, []);
    return allSections.filter(section => section.published).sort((a, b) => a.order - b.order);
  },

  getBudgetSectionById: async (id) => {
    const allSections = localStorageService.getItem(BUDGET_SECTIONS_KEY, []);
    return allSections.find(section => section.id === id);
  },

  createBudgetSection: async (sectionData) => {
    const allSections = localStorageService.getItem(BUDGET_SECTIONS_KEY, []);
    const newSection = { 
      id: uuidv4(), 
      ...sectionData, 
      published: true, 
      createdAt: new Date().toISOString() 
    };
    allSections.push(newSection);
    localStorageService.setItem(BUDGET_SECTIONS_KEY, allSections);
    adminService.logActivity('budget_section_created', `Sección de presupuesto "${newSection.title}" creada`);
    return newSection;
  },

  updateBudgetSection: async (id, updatedData) => {
    let allSections = localStorageService.getItem(BUDGET_SECTIONS_KEY, []);
    allSections = allSections.map(section => 
      section.id === id ? { ...section, ...updatedData, updatedAt: new Date().toISOString() } : section
    );
    localStorageService.setItem(BUDGET_SECTIONS_KEY, allSections);
    adminService.logActivity('budget_section_updated', `Sección de presupuesto "${updatedData.title || id}" actualizada`);
    return allSections.find(section => section.id === id);
  },

  deleteBudgetSection: async (id) => {
    let allSections = localStorageService.getItem(BUDGET_SECTIONS_KEY, []);
    const deletedSection = allSections.find(section => section.id === id);
    allSections = allSections.filter(section => section.id !== id);
    localStorageService.setItem(BUDGET_SECTIONS_KEY, allSections);
    adminService.logActivity('budget_section_deleted', `Sección de presupuesto "${deletedSection?.title || id}" eliminada`);
    return true;
  },

  getBudgetData: async () => {
    return localStorageService.getItem(BUDGET_KEY, []);
  },

  getPublishedBudgetData: async () => {
    const allBudgetData = localStorageService.getItem(BUDGET_KEY, []);
    return allBudgetData.filter(budget => budget.published);
  },

  getBudgetByYear: async (year) => {
    const allBudgetData = localStorageService.getItem(BUDGET_KEY, []);
    return allBudgetData.find(budget => budget.year === year && budget.published);
  },

  createBudgetData: async (budgetData) => {
    const allBudgetData = localStorageService.getItem(BUDGET_KEY, []);
    const newBudget = { 
      id: uuidv4(), 
      ...budgetData, 
      published: true, 
      createdAt: new Date().toISOString() 
    };
    allBudgetData.push(newBudget);
    localStorageService.setItem(BUDGET_KEY, allBudgetData);
    adminService.logActivity('budget_data_created', `Datos de presupuesto ${newBudget.year} creados`);
    return newBudget;
  },

  updateBudgetData: async (id, updatedData) => {
    let allBudgetData = localStorageService.getItem(BUDGET_KEY, []);
    allBudgetData = allBudgetData.map(budget => 
      budget.id === id ? { ...budget, ...updatedData, updatedAt: new Date().toISOString() } : budget
    );
    localStorageService.setItem(BUDGET_KEY, allBudgetData);
    adminService.logActivity('budget_data_updated', `Datos de presupuesto ${updatedData.year || id} actualizados`);
    return allBudgetData.find(budget => budget.id === id);
  },

  deleteBudgetData: async (id) => {
    let allBudgetData = localStorageService.getItem(BUDGET_KEY, []);
    const deletedBudget = allBudgetData.find(budget => budget.id === id);
    allBudgetData = allBudgetData.filter(budget => budget.id !== id);
    localStorageService.setItem(BUDGET_KEY, allBudgetData);
    adminService.logActivity('budget_data_deleted', `Datos de presupuesto ${deletedBudget?.year || id} eliminados`);
    return true;
  },

  getBudgetStats: async () => {
    const sections = localStorageService.getItem(BUDGET_SECTIONS_KEY, []);
    const budgetData = localStorageService.getItem(BUDGET_KEY, []);
    return {
      totalSections: sections.length,
      publishedSections: sections.filter(s => s.published).length,
      totalBudgetYears: budgetData.length,
      publishedBudgetYears: budgetData.filter(b => b.published).length
    };
  }
};

export default budgetService;
