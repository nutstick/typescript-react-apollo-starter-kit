interface IAccountDocument {
  email: string;
  password?: string;
  facebook?: {
    id: string;
    accessCode: string;
  };
  googleAccessCode?: {
    id: string;
    accessCode: string;
  };
};

const Account = {
  email: String,
  password: String,
  facebook: {
    id: String,
    accessCode: String,
  },
  googleAccessCode: {
    id: String,
    accessCode: String,
  },
};

export { IAccountDocument, Account };
