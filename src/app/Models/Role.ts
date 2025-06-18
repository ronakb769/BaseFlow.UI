export interface Role {
    roleId: number;
    roleName: string;
    description: string;
    isActive: boolean;
    isDelete: boolean;
    createdOn: string;
    createdBy: number;
    updatedOn: string | null;
    updatedBy: number | null;
  }

  export interface CreateRoleModel{
    roleId : number;
    roleName : string;
    description : string;
    permissionIds:number[]; 
  }

  export interface Permission {
    permissionsId: number;
    permissionName: string;
  }