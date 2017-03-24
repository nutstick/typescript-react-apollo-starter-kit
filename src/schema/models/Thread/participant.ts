interface IParticicantDocument {
  participant: string;
  guide?: boolean;
  pending?: boolean;
  invitedBy: string;
  createAt: Date;
};

const Participant = {
  participant: String,
  guide: Boolean,
  pending: Boolean,
  invitedBy: String,
  createAt: Date,
};

export { IParticicantDocument, Participant };