import DetailsPage from "@/components/templates/DetailsPage";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Details({ data }) {
  const router = useRouter();

  if (router.isFallback) {
    return <h2>Loading Page...</h2>;
  }

  return <DetailsPage {...data} />;
}

export async function getStaticPaths() {
  const res = await fetch(`${process.env.BASE_URL}/data`);
  const json = await res.json();
  const data = json.slice(0, 10);

  const paths = data.map((food) => ({
    params: { id: food.id.toString() },
  }));

  return {
    paths,
    fallback: "blocking",
  };
}

export async function getStaticProps(context) {
  const {
    params: { id },
  } = context;
  const res = await fetch(`${process.env.BASE_URL}/data/${id}`);
  if (res.status === 200) {
    const data = await res.json();
    if (!data.name) {
      return {
        notFound: true,
      };
    }
    return {
      props: { data },
      revalidate: +process.env.REVALIDATE,
    };
  } else {
    return {
      notFound: true,
    };
  }
}
