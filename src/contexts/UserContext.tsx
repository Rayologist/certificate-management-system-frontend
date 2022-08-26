import { refresh } from "@services/session";
import {
  createContext,
  SetStateAction,
  useContext,
  useState,
  Dispatch,
  useEffect,
} from "react";
import { Response } from "types";

type State = {
  pending: boolean;
  error: boolean;
  data: {
    role: string;
  };
};

type Context = {
  user: State;
  setUser: Dispatch<SetStateAction<State>>;
};

const UserContext = createContext<Context | null>(null);

export const useUser = () => {
  return useContext(UserContext) as Context;
};

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const initialState: State = {
    pending: true,
    error: false,
    data: { role: "" },
  };

  const [user, setUser] = useState(initialState);

  useEffect(() => {
    const refresher = async () => {
      const [result, error] = await refresh();

      if (error) {
        setUser((prev) => ({ ...prev, error: true, pending: false }));
        return;
      }

      const { data } = result as Response<{ role?: string }>;

      if (data?.role) {
        setUser((prev) => ({ ...prev, data: { role: data.role ?? "" } }));
      }

      setUser((prev) => ({ ...prev, pending: false }));
    };
    refresher();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
