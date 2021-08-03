import { useEffect } from "react";
import Router from "next/router";

// API
import useRequest from "../../hooks/use-request";

const SignoutPage = () => {
  const [doRequest, errors] = useRequest({
    url: "/api/users/signout",
    method: "delete",
    body: {},
    onSuccess: async () => {
      await Router.push("/");
    },
  });

  useEffect(async () => {
    await doRequest();
  }, []);

  return <div>Signing you out...</div>;
};

export default SignoutPage;
