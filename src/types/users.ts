export enum Status {
  LIKED = 'LIKED',
  NOPED = 'NOPED',
  SUPPER_LIKED = 'SUPPER_LIKED',
}

export type User = {
  firstName: string;
  id: string;
  lastName: string;
  picture: string;
  title: string;
  status?: Status;
  age?: number;
};

export type Location = {
  street: string;
  city: string;
  state: string;
  country: string;
  timeZone: string;
};

export type UserDetail = User & {
  dateOfBirth: Date;
  email: string;
  gender: string;
  phone: string | number;
  location?: Location;
};
