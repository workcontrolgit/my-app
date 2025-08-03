export interface ApprovalRule {
  requiredApprovers: string[];
  optionalApprovers: string[];
  managerSelectsSupervisor?: boolean;
}

export interface Approval {
  approverRole: string;
  approverName: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string | null;
  comments: string | null;
  isRequired: boolean;
  needsSupervisorSelection?: boolean;
  selectedSupervisor?: string;
}

export interface ApprovalWorkflow {
  pdId: string;
  pdTitle: string;
  pdType: 'Custom PD' | 'Standard PD' | 'Expert and Consultant';
  status: 'pending' | 'approved' | 'rejected';
  approvals: Approval[];
  submittedBy: string;
  submittedDate: string;
  availableSupervisors?: string[];
}

export interface ApprovalEvent {
  pdId: string;
  approverRole: string;
  action: 'approve' | 'reject' | 'select-supervisor';
  comments?: string;
  selectedSupervisor?: string;
  timestamp: string;
}

export type ApprovalStatus = Approval['status'];
export type ApprovalAction = ApprovalEvent['action'];
export type PDType = ApprovalWorkflow['pdType'];