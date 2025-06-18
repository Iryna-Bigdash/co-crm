// import React, { useState } from 'react';
// import { 
//   Calendar, 
//   Phone, 
//   MessageSquare, 
//   DollarSign, 
//   Paperclip, 
//   FileText, 
//   Plus, 
//   Send, 
//   Download, 
//   Save,
//   Upload,
//   Edit3,
//   Clock,
//   CheckCircle,
//   AlertCircle
// } from 'lucide-react';

// const CRMInterface = () => {
//   const [activeTab, setActiveTab] = useState('info');
//   const [interactions, setInteractions] = useState([
//     {
//       id: 1,
//       date: '2024-12-15',
//       type: 'call',
//       comment: 'Обговорили умови співпраці, клієнт зацікавлений',
//       nextCall: '2024-12-20',
//       amount: 5000,
//       status: 'completed'
//     },
//     {
//       id: 2,
//       date: '2024-12-10',
//       type: 'email',
//       comment: 'Надіслано пропозицію',
//       nextCall: null,
//       amount: 0,
//       status: 'pending'
//     }
//   ]);

//   const [files, setFiles] = useState([
//     { id: 1, name: 'Паспорт_клієнта.jpg', type: 'image', size: '2.3 MB' },
//     { id: 2, name: 'Довідка_про_доходи.pdf', type: 'document', size: '1.1 MB' }
//   ]);

//   const tabs = [
//     { id: 'info', label: 'Інформація', icon: FileText },
//     { id: 'history', label: 'Історія звʼязку', icon: Phone },
//     { id: 'documents', label: 'Документи', icon: Paperclip },
//     { id: 'contract', label: 'Договір', icon: Edit3 }
//   ];

//   const TabButton = ({ tab, isActive, onClick }) => {
//     const Icon = tab.icon;
//     return (
//       <button
//         onClick={() => onClick(tab.id)}
//         className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
//           isActive 
//             ? 'bg-blue-100 text-blue-700 border border-blue-200' 
//             : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
//         }`}
//       >
//         <Icon size={18} />
//         <span>{tab.label}</span>
//       </button>
//     );
//   };

//   const InteractionCard = ({ interaction }) => {
//     const getStatusColor = (status) => {
//       switch(status) {
//         case 'completed': return 'text-green-600 bg-green-50';
//         case 'pending': return 'text-yellow-600 bg-yellow-50';
//         case 'overdue': return 'text-red-600 bg-red-50';
//         default: return 'text-gray-600 bg-gray-50';
//       }
//     };

//     const getTypeIcon = (type) => {
//       switch(type) {
//         case 'call': return <Phone size={16} />;
//         case 'email': return <Send size={16} />;
//         case 'meeting': return <Calendar size={16} />;
//         default: return <MessageSquare size={16} />;
//       }
//     };

//     return (
//       <div className="border border-gray-200 rounded-lg p-4 space-y-3">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//             <div className="text-gray-500">
//               {getTypeIcon(interaction.type)}
//             </div>
//             <span className="font-medium text-gray-900">
//               {new Date(interaction.date).toLocaleDateString('uk-UA')}
//             </span>
//           </div>
//           <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(interaction.status)}`}>
//             {interaction.status === 'completed' ? 'Завершено' : 'В процесі'}
//           </span>
//         </div>
        
//         <p className="text-gray-700 text-sm">{interaction.comment}</p>
        
//         <div className="flex items-center justify-between text-sm">
//           {interaction.nextCall && (
//             <div className="flex items-center space-x-1 text-blue-600">
//               <Clock size={14} />
//               <span>Наступний звʼязок: {new Date(interaction.nextCall).toLocaleDateString('uk-UA')}</span>
//             </div>
//           )}
//           {interaction.amount > 0 && (
//             <div className="flex items-center space-x-1 text-green-600 font-medium">
//               <DollarSign size={14} />
//               <span>{interaction.amount.toLocaleString()} грн</span>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   const renderTabContent = () => {
//     switch(activeTab) {
//       case 'info':
//         return (
//           <div className="space-y-6">
//             <div className="bg-white rounded-lg border border-gray-200 p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">Інформація про компанію</h3>
//               {/* Тут буде CompanyInfo */}
//               <div className="text-gray-500">CompanyInfo компонент</div>
//             </div>
            
//             <div className="bg-white rounded-lg border border-gray-200 p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">Промоції</h3>
//               {/* Тут буде CompanyPromotions */}
//               <div className="text-gray-500">CompanyPromotions компонент</div>
//             </div>
//           </div>
//         );

//       case 'history':
//         return (
//           <div className="space-y-6">
//             {/* Форма додавання нової взаємодії */}
//             <div className="bg-white rounded-lg border border-gray-200 p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">Додати звʼязок</h3>
//               <div className="grid grid-cols-2 gap-4 mb-4">
//                 <input
//                   type="date"
//                   className="border border-gray-300 rounded-lg px-3 py-2"
//                   placeholder="Дата"
//                 />
//                 <select className="border border-gray-300 rounded-lg px-3 py-2">
//                   <option>Тип звʼязку</option>
//                   <option value="call">Дзвінок</option>
//                   <option value="email">Email</option>
//                   <option value="meeting">Зустріч</option>
//                 </select>
//               </div>
//               <textarea
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
//                 rows="3"
//                 placeholder="Коментар менеджера..."
//               />
//               <div className="grid grid-cols-2 gap-4 mb-4">
//                 <input
//                   type="date"
//                   className="border border-gray-300 rounded-lg px-3 py-2"
//                   placeholder="Наступний звʼязок"
//                 />
//                 <input
//                   type="number"
//                   className="border border-gray-300 rounded-lg px-3 py-2"
//                   placeholder="Сума (грн)"
//                 />
//               </div>
//               <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
//                 <Plus size={16} />
//                 <span>Додати запис</span>
//               </button>
//             </div>

//             {/* Список взаємодій */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold text-gray-900">Історія взаємодій</h3>
//               {interactions.map((interaction) => (
//                 <InteractionCard key={interaction.id} interaction={interaction} />
//               ))}
//             </div>
//           </div>
//         );

//       case 'documents':
//         return (
//           <div className="space-y-6">
//             {/* Завантаження файлів */}
//             <div className="bg-white rounded-lg border border-gray-200 p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">Завантажити документи</h3>
//               <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
//                 <Upload size={48} className="mx-auto text-gray-400 mb-4" />
//                 <p className="text-gray-600 mb-2">Перетягніть файли сюди або</p>
//                 <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
//                   Вибрати файли
//                 </button>
//               </div>
//             </div>

//             {/* Список завантажених файлів */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold text-gray-900">Завантажені документи</h3>
//               {files.map((file) => (
//                 <div key={file.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
//                   <div className="flex items-center space-x-3">
//                     <Paperclip size={20} className="text-gray-400" />
//                     <div>
//                       <p className="font-medium text-gray-900">{file.name}</p>
//                       <p className="text-sm text-gray-500">{file.size}</p>
//                     </div>
//                   </div>
//                   <button className="text-blue-600 hover:text-blue-800">
//                     <Download size={20} />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         );

//       case 'contract':
//         return (
//           <div className="space-y-6">
//             <div className="bg-white rounded-lg border border-gray-200 p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <h3 className="text-lg font-semibold text-gray-900">Договір</h3>
//                 <div className="flex space-x-2">
//                   <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2">
//                     <Save size={16} />
//                     <span>Зберегти</span>
//                   </button>
//                   <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
//                     <Download size={16} />
//                     <span>Завантажити</span>
//                   </button>
//                   <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2">
//                     <Send size={16} />
//                     <span>Надіслати</span>
//                   </button>
//                 </div>
//               </div>

//               {/* Форма договору */}
//               <div className="space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Номер договору
//                     </label>
//                     <input
//                       type="text"
//                       className="w-full border border-gray-300 rounded-lg px-3 py-2"
//                       placeholder="№ 001/2024"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Дата укладення
//                     </label>
//                     <input
//                       type="date"
//                       className="w-full border border-gray-300 rounded-lg px-3 py-2"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Предмет договору
//                   </label>
//                   <textarea
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2"
//                     rows="4"
//                     placeholder="Опис послуг або товарів..."
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Сума договору (грн)
//                     </label>
//                     <input
//                       type="number"
//                       className="w-full border border-gray-300 rounded-lg px-3 py-2"
//                       placeholder="50000"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Термін виконання
//                     </label>
//                     <input
//                       type="date"
//                       className="w-full border border-gray-300 rounded-lg px-3 py-2"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Додаткові умови
//                   </label>
//                   <textarea
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2"
//                     rows="3"
//                     placeholder="Додаткові умови та зауваження..."
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-6 px-10">
//       {/* Навігація табами */}
//       <div className="mb-6">
//         <div className="flex space-x-2 border-b border-gray-200 pb-4">
//           {tabs.map((tab) => (
//             <TabButton
//               key={tab.id}
//               tab={tab}
//               isActive={activeTab === tab.id}
//               onClick={setActiveTab}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Контент табів */}
//       <div className="max-w-6xl">
//         {renderTabContent()}
//       </div>

//       {/* Статистика (може бути окремим компонентом) */}
//       <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-64">
//         <h4 className="font-semibold text-gray-900 mb-3">Швидка статистика</h4>
//         <div className="space-y-2 text-sm">
//           <div className="flex justify-between">
//             <span className="text-gray-600">Всього звʼязків:</span>
//             <span className="font-medium">12</span>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-gray-600">Загальна сума:</span>
//             <span className="font-medium text-green-600">75,000 грн</span>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-gray-600">Документів:</span>
//             <span className="font-medium">8</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CRMInterface;

// InteractionCard.tsx

'use client';

import React from 'react';
import {
  Phone,
  Send,
  Calendar,
  MessageSquare,
  Clock,
  DollarSign,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import InteractionForm from './interection-form';

export type InteractionType = 'call' | 'email' | 'meeting' | 'other';
export type InteractionStatus = 'completed' | 'pending' | 'overdue';

export interface Interaction {
  id: string;
  type: InteractionType;
  status: InteractionStatus;
  date: string;
  comment: string;
  nextCall?: string;
  amount?: number;
}

interface InteractionCardProps {
  interaction: Interaction;
}

const statusMap: Record<InteractionStatus, {
  label: string;
  icon: React.ReactNode;
  className: string;
}> = {
  completed: {
    label: 'Завершено',
    icon: <CheckCircle size={14} className="text-green-600" />,
    className: 'bg-green-50 text-green-700'
  },
  pending: {
    label: 'В процесі',
    icon: <AlertCircle size={14} className="text-yellow-600" />,
    className: 'bg-yellow-50 text-yellow-700'
  },
  overdue: {
    label: 'Прострочено',
    icon: <AlertCircle size={14} className="text-red-600" />,
    className: 'bg-red-50 text-red-700'
  }
};

const typeMap: Record<InteractionType, {
  label: string;
  icon: React.ReactNode;
}> = {
  call: {
    label: 'Дзвінок',
    icon: <Phone size={16} className="text-blue-600" />
  },
  email: {
    label: 'Email',
    icon: <Send size={16} className="text-purple-600" />
  },
  meeting: {
    label: 'Зустріч',
    icon: <Calendar size={16} className="text-indigo-600" />
  },
  other: {
    label: 'Інше',
    icon: <MessageSquare size={16} className="text-gray-600" />
  }
};

export function InteractionCard({ interaction }: InteractionCardProps) {
  const status = statusMap[interaction.status] || statusMap.pending;
  const type = typeMap[interaction.type] || typeMap.other;

  return (
    <div>
        <div className="relative my-10">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300" />
      </div>
      <div className="relative flex justify-center text-sm text-gray-500 uppercase">
        <span className="bg-white px-3">Історія взаємодій</span>
      </div>
    </div>
    <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          {type.icon}
          <span className="font-medium">
            {new Date(interaction.date).toLocaleDateString('uk-UA')}
          </span>
        </div>

        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.className}`}>
          {status.icon}
          <span>{status.label}</span>
        </div>
      </div>

      <p className="text-sm text-gray-800 mb-3">{interaction.comment}</p>

      <div className="flex flex-col sm:flex-row sm:justify-between text-sm gap-2">
        {interaction.nextCall && (
          <div className="flex items-center gap-1 text-blue-600">
            <Clock size={14} />
            <span>
              Наступний звʼязок: {new Date(interaction.nextCall).toLocaleDateString('uk-UA')}
            </span>
          </div>
        )}

        {interaction.amount && interaction.amount > 0 && (
          <div className="flex items-center gap-1 text-green-600 font-medium">
            <DollarSign size={14} />
            <span>{interaction.amount.toLocaleString()} грн</span>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}

interface InteractionSectionProps {
  companyId: string;
}

export default function InteractionSection({ companyId }: InteractionSectionProps) {
  // Можна сюди додати useState для зберігання interaction, якщо потрібно

  const defaultInteraction: Interaction = {
    id: 'default-id',
    type: 'call',
    status: 'pending',
    date: new Date().toISOString(),
    comment: 'Стандартний коментар',
  };

  const handleFormSubmit = (data: any) => {
    // Тут відправка на бекенд або оновлення локального стану
    console.log('Interaction submitted:', data);
  };

  return (
    <>
      <InteractionForm onSubmit={handleFormSubmit} />
      <InteractionCard interaction={defaultInteraction} />
    </>
  );
}
