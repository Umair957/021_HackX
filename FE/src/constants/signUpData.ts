export interface SignupPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
  company?: string; // Optional because not all roles/users might provide it
}