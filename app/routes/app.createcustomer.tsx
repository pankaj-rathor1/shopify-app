import React, { useState } from 'react';
import { Form, TextField, Button, Layout, Card } from '@shopify/polaris';
import { json, useActionData, useLoaderData, useSubmit } from '@remix-run/react';
import { ActionFunction, ActionFunctionArgs, TypedResponse } from '@remix-run/node';
import { authenticate } from '~/shopify.server';
import { createCustomer } from "~/api/prisma.server";

// export async function loader() {
//     console.log('loader');
//     return null;
// }
export const action: ActionFunction = async ({ request }:ActionFunctionArgs) => {
  
  const formData = await request.formData();
  // const data = Object.fromEntries(formData);
  const firstname = formData.get('firstname');
  const lastname = formData.get('lastname');
  const email = formData.get('email');
  const phone = formData.get('phone');
  
  let e:any = '';  
  
  // return json({message: `Customer Save Name: ${name}, Email: ${email}`});
  try {
    const { admin } = await authenticate.admin(request);
    
    const response = await admin.graphql(
      `#graphql
      mutation customerCreate($input: CustomerInput!) {
        customerCreate(input: $input) {
          userErrors {
            field
            message
          }
          customer {
            id
            email
            phone
            taxExempt
            firstName
            lastName
            smsMarketingConsent {
              marketingState
              marketingOptInLevel
            }
            addresses {
              address1
              city
              country
              phone
              zip
            }
          }
        }
      }`,
      {
        variables: {
          "input": {
            "email": email,
            "phone": phone,
            "firstName": firstname,
            "lastName": lastname,
            "addresses": [
              {
                "address1": "412 fake st",
                "city": "Ottawa",
                "province": "ON",
                "phone": "+16469999999",
                "zip": "A1A 4A1",
                "lastName": "Lastname",
                "firstName": "Steve",
                "country": "CA"
              }
            ]
          }
        },
      },
      );
      const data = await response.json();
      // return json(data);
      if (response.ok) {
        let result:any = Object.entries(data);
        if (result[0][1].customerCreate.userErrors?.length > 0) {
          return json({errorMessage: result[0][1].customerCreate.userErrors});
        } else {
          const name = firstname + ' ' + lastname;
          createCustomer({
            name: name,
            email: email
          });  
          return json({message: `Customer Saved Name: ${name}, Email: ${email}`});
        }
      }
      
    } catch (error:any) {
      if (error.body.data.customerCreate.userErrors?.length == 0) {
        const name = firstname + ' ' + lastname;
          createCustomer({
            name: name,
            email: email
          });  
          
          return json({message: `Customer account has been created successfully`, success:true});

      }
      return json({error:error},{ status: 500 });
    }
    
    // if (e != "") {
    //   return 'test';      
    // }
    
    return null;
  }
  
  interface CustomerFormProps {
    children: React.ReactNode;
  }
  
  interface Customer {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }
  
  const CustomerForm: React.FC<CustomerFormProps> = (props) => {
    const actionData = useActionData<typeof action>();
    console.log(actionData);
    const [customer, setCustomer] = useState<Customer>({
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    });
    
    const handleInputChange = (field: string, value: string) => {
      setCustomer((prevCustomer) => ({ ...prevCustomer, [field]: value }));
    };
    
    const submit = useSubmit();
    const generateCustomer = () => {
      submit({
      firstname: customer.firstName,
      lastname: customer.lastName,
      email: customer.email,
      phone: customer.phone
    }, { replace: true, method: 'POST'});

    if (actionData?.success) {
      setCustomer({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
      });
    }
  }
    
    const msg = (actionData: any) => {
      if (actionData) {
        if (actionData.errorMessage) {
          return <Card>
            <ul>
            {
              actionData.errorMessage.map((value:any)=>(
                <li>{value.message}</li> 
              ))
            }
            </ul>
          </Card>
        }
        if (actionData.message) {
          return <Card>{actionData.message}</Card>          
        }
      }else{
        return <></>;
      }
    }

    return (
      <Layout>
      <Layout.Section>
      <Card>
        {msg(actionData)}
      <Form method='post' onSubmit={generateCustomer}>
      <TextField
      label="First Name"
      name="firstname"
      value={customer.firstName}
      onChange={(value) => handleInputChange('firstName', value)}
      required={true}
      />
      <TextField
      label="Last Name"
      name="lastname"
      value={customer.lastName}
      onChange={(value) => handleInputChange('lastName', value)}
      required
      />
      <TextField
      type="email"
      label="Email"
      name="email"
      value={customer.email}
      onChange={(value) => handleInputChange('email', value)}
      required
      />
      <TextField
      label="Phone"
      name="phone"
      value={customer.phone}
      onChange={(value) => handleInputChange('phone', value)}
      required
      />
      <hr></hr>
      <Button primary submit>Create Customer</Button>
      </Form>
      </Card>
      </Layout.Section>
      </Layout>
      );
    };
    
    export default CustomerForm;
    