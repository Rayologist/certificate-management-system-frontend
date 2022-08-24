import CertificateForm from "@containers/Form";
import { Paper, Container, Title, Text } from "@mantine/core";
import { GetServerSideProps } from "next";
import request from "src/utils/fetcher";
import { URLSearchParams } from "url";
import { Response, SendCertificate } from "types";

const parseCookie = <T,>(text: string): T | false => {
  try {
    return JSON.parse(text);
  } catch (error) {
    return false;
  }
};

export default function HomePage({ data }: { data: SendCertificate }) {
  const { activityName, certificateName, certificateId, activityUid } = data;

  return (
    <>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        Certificate of Attendence
      </Title>
      <Container size={420} mt={10} mb={40}>
        <Text color="dimmed" align="center" weight="bold">
          {activityName}
        </Text>
        <Text color="dimmed" align="center">
          {certificateName}
        </Text>
        <Paper
          shadow="lg"
          p={30}
          mt={30}
          radius="md"
          // sx={(theme) => ({
          //   [`@media (max-width: ${theme.breakpoints.xs}px)`]: {
          //     padding: "1rem 1rem",
          //     width: "90%",
          //   },
          //   [`@media (max-width: ${theme.breakpoints.lg}px) and (min-width: ${theme.breakpoints.sm}px)`]:
          //     {
          //       padding: "2rem 1rem",
          //       width: "50%",
          //     },
          //   [`@media (min-width: ${theme.breakpoints.lg}px)`]: {
          //     padding: "2rem 1rem",
          //     width: "30%",
          //   },
          // })}
          withBorder
        >
          <CertificateForm
            {...{ certificateId, activityUid }}
            pushUrl={`/success?e=${encodeURIComponent(
              window.btoa(`p=${activityName}&c=${certificateName}`)
            )}`}
          />
        </Paper>
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;
  const redirect = {
    redirect: {
      destination: "https://cbe.ntu.edu.tw/",
      permanent: false,
    },
  };

  const { p: activity, c: certificate } = context.query as {
    p?: string;
    c?: string;
  };

  if (!activity || !certificate) return redirect;
  const domain = process.env.EXTERNAL_SERVER_DOMAIN;

  if (!domain) {
    throw new Error("EXTERNAL_DOMAIN undefined");
  }

  const url = new URL(domain);
  const query = new URLSearchParams({ activity, certificate });
  url.search = query.toString();

  const response: Response<SendCertificate> = await request({
    url: url.href,
    method: "GET",
  });

  if (response.status === "failed") return redirect;

  const cookie = req.cookies[response.data.activityUid];

  if (cookie) {
    const array = parseCookie<number[]>(cookie);
    if (Array.isArray(array)) {
      if (array.includes(response.data.certificateId)) {
        return {
          redirect: {
            permanent: false,
            destination: `/success?e=${encodeURIComponent(
              Buffer.from(
                `p=${response.data.activityName}&c=${response.data.certificateName}`
              ).toString("base64")
            )}`,
          },
        };
      }
    }
  }

  return {
    props: {
      data: response.data,
      cid: certificate,
    },
  };
};
