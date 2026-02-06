import { PagesContainer } from "@/components/layouts/PagesContainer";
import { InvoiceContainer } from "@/features/Transactions/Transaction/components/InvoicePage";
import { Invoice } from "@/features/Transactions/Transaction/types";
import { ApiResponse } from "@/lib/types";
import axios from "axios";
import type { GetServerSideProps } from "next";

interface InvoiceProps {
  transaction: Invoice | null;
  error?: string;
}

export default function InvoicePage({ transaction }: InvoiceProps) {
  if (!transaction) {
    return null;
  }
  return (
    <PagesContainer withFooter={true} withHeader={true}>
      <InvoiceContainer transaction={transaction} />
    </PagesContainer>
  );
}

export const getServerSideProps = (async (context) => {
  const { slug } = context.params as { slug: string };

  try {
    const res = await axios.get<ApiResponse<Invoice>>(
      `http://localhost:7000/api/transaction/${slug}`,
      {
        timeout: 5000,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!res.data.data) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        transaction: res.data.data,
      },
    };
  } catch (error) {
    // Handle different error cases
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return {
          notFound: true,
        };
      }

      return {
        props: {
          transaction: null,
          error: error.response?.data?.message || "Failed to load category",
        },
      };
    }

    return {
      props: {
        transaction: null,
        error: "An unexpected error occurred",
      },
    };
  }
}) satisfies GetServerSideProps<InvoiceProps>;
