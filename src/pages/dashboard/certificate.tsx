import Loader from "@components/Loader";
import CertificateTable from "@containers/Admin/Certificate/Table";
import { Title, Group, Paper } from "@mantine/core";
import { useCertificate } from "@services/certificate";
import { useRouter } from "next/router";

const Certificate = () => {
  const { certificate, isLoading, isError } = useCertificate();
  const router = useRouter();

  if (isLoading) return <Loader />;

  if (isError) {
    router.push("/500", { pathname: router.asPath });
    return null;
  }

  return (
    <>
      <Group position="apart" mb={50}>
        <Title>證書製作</Title>
      </Group>
      <Paper sx={{ padding: "1rem" }}>
        <CertificateTable data={certificate.data} />
      </Paper>
    </>
  );
};

Certificate.auth = true;

export default Certificate;
