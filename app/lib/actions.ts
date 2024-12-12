"use server";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const FormScheme = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(["pending", "paid"]),
  date: z.string()
});
const CreateInvoice = FormScheme.omit({
  id: true,
  date: true
});
const UpdateInvoice = FormScheme.omit({
  id: true,
  date: true
});

export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status")
  });
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  try {
    await sql`INSERT INTO invoices (customer_id, amount, status, date)
     VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
     `;
  } catch (error) {
    return {
      message: `Database Error: Failed to Create Invoice.`
    };
  }
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status")
  });

  const amountInCents = amount * 100;

  try {
    // TODO 模板字符串标签函数（tagged template function）
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return {
      message: "Database Error: Failed to Update Invoice."
    };
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
  throw new Error("Failed to Delete Invoice");
  
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath("/dashboard/invoices");
    return {
      message: "Delete Invoice."
    };
  } catch (error) {
    return {
      message: "Database Error: Failed to Delete Invoice."
    };
  }
}