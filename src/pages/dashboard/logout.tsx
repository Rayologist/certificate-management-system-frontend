import { logout } from "@services/session";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useUser } from "src/contexts/UserContext";

const Logout = () => {
  const router = useRouter();
  const { setUser } = useUser();

  useEffect(() => {
    const logoutFunc = async () => {
      await logout();
      router.push("/dashboard/login");
      setUser((prev) => ({ ...prev, data: { role: "" } }));
    };
    logoutFunc();
  }, [router, setUser]);

  return null;
};

Logout.auth = true;

export default Logout;
