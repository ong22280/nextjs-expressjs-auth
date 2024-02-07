type User = {
  email: string;
  password: string;
};

type NewUser = User & {
  name: string;
};

type UserBasicInfo = {
  id: string;
  name: string;
  email: string;
};

type AuthApiState = {
  token: string | null;
  userInfo?: UserBasicInfo | null;
  status: "idle" | "loading" | "failed";
  error: string | null;
};

type AuthTokenState = {
  token?: string | null;
  userInfo?: UserBasicInfo | null;
};