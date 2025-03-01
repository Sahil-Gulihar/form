export interface UserData {
  id: string;
  email: string;
  name?: string | null;
  createdAt?: Date;
}

export interface ApiError {
  error: string;
}
