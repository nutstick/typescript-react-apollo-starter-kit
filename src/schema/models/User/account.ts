interface IAccountDocument {
  email: string;
  password?: string;
  facebook?: {
    id: string;
    accessCode: string;
  };
  google?: {
    id: string;
    accessCode: string;
  };
}

const Account = {
  email: String,
  password: {
    $required: false,
    $type: String,
  },
  facebook: {
    $required: false,
    $type: {
      id: String,
      accessCode: String,
    },
  },
  google: {
    $required: false,
    $type: {
      id: String,
      accessCode: String,
    },
  },
};

export { IAccountDocument, Account };
