import React, { useState, useCallback } from "react";
import { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, useSubmit } from "@remix-run/react";
import { authenticate } from "~/shopify.server";
import {
  Button,
  Form,
  FormLayout,
  Layout,
  Page,
  TextField,
  Card,
} from "@shopify/polaris";

export const action: ActionFunction = async ({ request }) => {
    try {
      const { admin } = await authenticate.admin(request);
  
      const formData = await request.formData();
  
      const name = formData.get("name") as string;
      const email = formData.get("email") as string;
  
      console.log(name);
      console.log(email);
    } catch (error) {
      return json({ error: "An unexpected error occurred" }, { status: 500 });
    }

    return null;
  };
  

const CustomerForm = () => {
  const submit = useSubmit();
  const actionData = useActionData<typeof action>();

  // set get customer data
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const formData = new FormData();
  console.log(formData);
  const generateCustomer = () => {
    submit(formData, { replace: true, method: "POST" });
  }

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card>
            <Form onSubmit={generateCustomer} method="post">
              <FormLayout>
                <TextField
                  label="Name"
                  name="name"
                  autoComplete="on"
                  value={name}
                  onChange={(value) => setName(value)}
                />
                <TextField
                  type="email"
                  name="email"
                  label="Email"
                  autoComplete="on"
                  value={email}
                  onChange={(value) => setEmail(value)}
                />
                <Button submit>Create Customer</Button>
              </FormLayout>
            </Form>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default CustomerForm;
