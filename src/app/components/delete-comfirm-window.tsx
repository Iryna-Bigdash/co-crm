import React from 'react';
import Swal from 'sweetalert2';

interface DeleteConfirmationProps {
  id: string;
  companyId: string;
  text: string;
  onDelete: (id: string) => Promise<void>;
  children?: React.ReactNode;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({ id, text, onDelete, children }) => {
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `${text}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1D4ED8',
      cancelButtonColor: '#B91C1C',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      await onDelete(id);
      Swal.fire('Deleted!', 'Successfully deleted.', 'success');
    }
  };

  return (
    <button onClick={handleDelete} className="px-4 py-2 flex items-center justify-center">
      {children ? children : 'Delete'}
    </button>
  );
};

export default DeleteConfirmation;
