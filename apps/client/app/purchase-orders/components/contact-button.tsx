'use client';
import Modal from '@/components/ui/modal';
import {useState} from 'react';

interface Props {
  vendorName: string;
}

export default function ContactButton({vendorName}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        className="btn btn-block btn-neutral"
        onClick={() => setIsOpen(true)}
      >
        Contact Vendor
      </button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Contact Vendor"
      >
        <p className="py-4">You can contact {vendorName} at (123) 555-5555.</p>
      </Modal>
    </>
  );
}
