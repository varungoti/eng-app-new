import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useSchools } from '../../hooks/useSchools';

interface AddStaffDialogProps {
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  onInvite: (email: string, role: string) => Promise<void>;
}

const AddStaffDialog: React.FC<AddStaffDialogProps> = ({
  onClose,
  onSubmit,
  onInvite
}) => {
  const [isInvite, setIsInvite] = useState(false);
  const { schools } = useSchools();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    
    if (isInvite) {
      await onInvite(
        formData.get('email') as string,
        formData.get('role') as string
      );
    } else {
      await onSubmit(Object.fromEntries(formData));
    }
    
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isInvite ? 'Invite Staff Member' : 'Add Staff Member'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isInvite && (
            <>
              <div>
                <Label>Name</Label>
                <Input name="name" required />
              </div>
            </>
          )}

          <div>
            <Label>Email</Label>
            <Input name="email" type="email" required />
          </div>

          <div>
            <Label>Role</Label>
            <Select name="role" required>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {/* Company Roles */}
                <SelectItem value="super_admin">Super Admin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="technical_head">Technical Head</SelectItem>
                <SelectItem value="developer">Developer</SelectItem>
                <SelectItem value="sales_head">Sales Head</SelectItem>
                <SelectItem value="sales_lead">Sales Lead</SelectItem>
                <SelectItem value="sales_executive">Sales Executive</SelectItem>
                <SelectItem value="content_head">Content Head</SelectItem>
                <SelectItem value="content_editor">Content Editor</SelectItem>
                <SelectItem value="accounts_head">Accounts Head</SelectItem>
                <SelectItem value="accounts_executive">Accounts Executive</SelectItem>
                
                {/* Client Roles */}
                <SelectItem value="school_leader">School Leader</SelectItem>
                <SelectItem value="school_principal">School Principal</SelectItem>
                <SelectItem value="teacher_head">Teacher Head</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="student">Student</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!isInvite && (
            <>
              <div>
                <Label>Department</Label>
                <Select name="department">
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Company Departments */}
                    <SelectItem value="administration">Administration</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="content">Content</SelectItem>
                    <SelectItem value="accounts">Accounts</SelectItem>
                    
                    {/* Academic Departments */}
                    <SelectItem value="english">English Department</SelectItem>
                    <SelectItem value="mathematics">Mathematics Department</SelectItem>
                    <SelectItem value="science">Science Department</SelectItem>
                    <SelectItem value="languages">Languages Department</SelectItem>
                    <SelectItem value="arts">Arts Department</SelectItem>
                    <SelectItem value="physical_education">Physical Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>School</Label>
                <Select name="school_id">
                  <SelectTrigger>
                    <SelectValue placeholder="Select school" />
                  </SelectTrigger>
                  <SelectContent>
                    {schools.map(school => (
                      <SelectItem key={school.id} value={school.id}>
                        {school.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsInvite(!isInvite)}
            >
              Switch to {isInvite ? 'Add Directly' : 'Send Invite'}
            </Button>
            <div className="space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isInvite ? 'Send Invite' : 'Add Staff'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStaffDialog;