import { fetchCustomers, fetchInvoiceById } from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import Form from "@/app/ui/invoices/edit-form";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers()
  ]);

  return (
    <main className="p-4">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Invoices", href: "/invoices" },
          {
            label: "Create Invoice",
            href: "/invoices/create",
            active: true
          }
        ]}
      />
      <Form invoice={invoice} customers={customers} />
    </main>
  );
}
