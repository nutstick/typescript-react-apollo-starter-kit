interface IPermissionTypeDocument {
  admin?: boolean;
  guide?: boolean;
};

const PermissionType = {
  admin: Boolean,
  guide: Boolean,
};

export { PermissionType, IPermissionTypeDocument };
