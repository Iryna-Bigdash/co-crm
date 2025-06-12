// 'use client';

// import React, { Fragment } from 'react';
// import { Dialog, Transition } from '@headlessui/react';

// export interface ModalProps {
//   children?: React.ReactNode;
//   show: boolean;
//   onClose: () => void;
// }

// export default function Modal({ show, children, onClose }: ModalProps) {
//   return (
//     <Transition.Root as={Fragment} show={show}>
//       <Dialog
//         as="div"
//         className="fixed inset-0 z-50 flex items-center"
//         onClose={onClose}
//       >
//         <Transition.Child
//           as={Fragment}
//           enter="ease-out duration-300"
//           enterFrom="opacity-0"
//           enterTo="opacity-100"
//           leave="ease-in duration-200"
//           leaveFrom="opacity-100"
//           leaveTo="opacity-0"
//         >
//           <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
//         </Transition.Child>
//         <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all p-7 mx-auto sm:my-10 sm:w-full sm:max-w-2xl">
//           {children}
//         </Dialog.Panel>
//       </Dialog>
//     </Transition.Root>
//   );
// }

'use client';

import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

export interface ModalProps {
  children?: React.ReactNode;
  show: boolean;
  onClose: () => void;
  title?: string;
}

export default function Modal({ show, children, onClose, title }: ModalProps) {
  return (
    <Transition.Root as={Fragment} show={show}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Фонове затемнення */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" />
        </Transition.Child>

        {/* Центрування модального вмісту */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            {/* Вміст модального */}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-2xl transform overflow-hidden rounded-xl bg-white p-6 text-left shadow-xl transition-all">
                {title && (
                  <Dialog.Title className="text-2xl font-bold text-center">
                    {title}
                  </Dialog.Title>
                )}
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

