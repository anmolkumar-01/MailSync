import { useState } from 'react';
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { useAppStore } from '../../store/useAppStore';

export const AddEmailModal = ({ isOpen, onOpenChange }) => {
  const { extractedEmail, setExtractedEmails, triggerNotification } = useAppStore();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleAddEmail = () => {

    // Basic email validation
    if (!email || !/[\w.-]+@[\w.-]+\.\w{2,}/.test(email)) {
      triggerNotification("Please enter a valid email address ", "notify")
      onOpenChange(false);
      return;
    }

    setExtractedEmails(email);

    setEmail('');
    setError('');
    onOpenChange(false);
  };

  const handleClose = () => {
    // Also reset state when closing via "Cancel" or "X"
    setEmail('');
    setError('');
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] border-blue-200">
        <DialogHeader>
          <DialogTitle className="text-blue-900">Add a New Recipient</DialogTitle>
          <DialogDescription>
            Enter the email address you want to add to the recipient list.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Input
            id="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-blue-200 focus:border-blue-500"
          />
          {error && <p className="text-red-500 text-xs">{error}</p>}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </DialogClose>
          <Button 
            type="button" 
            onClick={handleAddEmail} 
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Add Email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};