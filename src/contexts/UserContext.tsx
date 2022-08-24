import Loader from "@components/Loader";
import Redirect from "@components/Redirect";
import { refresh } from "@services/session";
import { useRouter } from "next/router";
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
  error: string;
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
    error: "",
    data: { role: "" },
  };
  const router = useRouter();
  const [user, setUser] = useState(initialState);
  const [error, setError] = useState(false);

  useEffect(() => {
    const refresher = async () => {
      const [result, error] = await refresh();
      if (error) {
        setError(true);
        setUser((prev) => ({ ...prev, pending: false }));
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

  if (user.pending) return <Loader />;

  if (error) {
    router.push("/500", { pathname: router.asPath });
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
