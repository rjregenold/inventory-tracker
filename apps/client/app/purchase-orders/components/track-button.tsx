'use client';
import Modal from '@/components/ui/modal';
import {useState} from 'react';

interface Props {
  vendorName: string;
}

export default function TrackButton({vendorName}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button className="btn btn-block" onClick={() => setIsOpen(true)}>
        Track Order
      </button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Order Tracking"
      >
        <p className="py-4">
          Your order from {vendorName} is 2 years late but will be here
          eventually.
        </p>
      </Modal>
    </>
  );
}
