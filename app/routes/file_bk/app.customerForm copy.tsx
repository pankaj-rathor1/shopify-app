import React, { useCallback, useState } from "react";
import { ActionList, Button, ButtonGroup, Card, FormLayout, InlineStack, Layout, Page, Popover, TextField, Tooltip, Text, Modal, Frame, TextContainer, MediaCard, Form } from "@shopify/polaris";
import { ChevronDownMinor } from "@shopify/polaris-icons";
import { ActionFunction } from "@remix-run/node";
import { authenticate } from "~/shopify.server";
import { json } from "stream/consumers";
import { useActionData, useSubmit } from "@remix-run/react";

//We have to create action: ActionFunction whenever we work with form
export const action: ActionFunction = async ({ request }) => {
    const { admin } = await authenticate.admin(request);

    const formData = await request.formData();

    const name = formData.get('name');
    const email = formData.get('email');
    console.log(name, email);

    try {
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
                    "phone": "6465555555",
                    "firstName": name,
                    "lastName": "",
                    "acceptsMarketing": true,
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

        if (response.ok) {
            const data = await response.json();
            console.log(data);

            return json({
                data: data.data
            });
        }
        return null;
    } catch (error) {
        console.log(error);
    }
    return null;

}


const CustomerForm = () => {
    // const [active, setActive] = React.useState<string | null>(null);

    // const toggleActive = (id: string) => () => {
    //     setActive((activeId) => (activeId !== id ? id : null));
    // };

    const [active, setActive] = useState(false);

    const handleChange = useCallback(() => setActive(!active), [active]);

    const activator = <Button onClick={handleChange}>Open</Button>;

// set get customer data
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const submit = useSubmit();
    const actionData = useActionData<typeof action>();
    console.log(actionData, 'actionData');

    const generateCustomer = () => submit({}, { replace: true, method: 'POST'});

    return (
        <Page>
            <Layout>
                <Layout.Section>
                    <Card>
                        <h1>Customer Form</h1>
                        {/* <Link to="/customer">Customer List</Link> */}
                    </Card>
                </Layout.Section>
                <Layout.Section>
                    <Card>
                        <InlineStack gap="500">
                            <ButtonGroup variant="segmented">
                                <Button variant="primary">Save</Button>
                                {/* <Popover 
                                    active={active === 'popover1'} 
                                    preferredAlignment = "right"
                                    activator = {
                                        <Button variant="primary" onClick={toggleActive('popover1')}
                                        icon={ChevronDownMinor}
                                        accessibilityLabel="Other Save Action"
                                        />
                                    } 
                                    autofocusTarget = "first-node"
                                    onClose={toggleActive('popover1')}
                                >
                                <ActionList
                                    actionRole="menuitem"
                                    items={[{content: 'Save as draft'}]}
                                    />
                                </Popover> */}
                            </ButtonGroup>
                        </InlineStack>
                    </Card>
                </Layout.Section>
                <Layout.Section>
                    <FormLayout>
                        <Form onSubmit={generateCustomer} method="post">
                            <TextField 
                            label="Name"
                            name="name"
                            autoComplete="off"
                            value={name}
                            onChange={(value) => {setName(value)}}
                            />
                            <TextField
                                type="email"
                                name="email"
                                label="Email"
                                autoComplete="email"
                                value={email}
                                onChange={(value) => {setEmail(value)}}
                            />
                            <Button submit>Submit</Button>
                        </Form>
                        </FormLayout>
                </Layout.Section>
                <Layout.Section>
                <div style={{height: '500px'}}>
      <Frame>
        <Modal
          activator={activator}
          open={active}
          onClose={handleChange}
          title="Reach more shoppers with Instagram product tags"
          primaryAction={{
            content: 'Add Instagram',
            onAction: handleChange,
          }}
          secondaryActions={[
            {
              content: 'Learn more',
              onAction: handleChange,
            },
          ]}
        >
          <Modal.Section>
          <MediaCard
            title="Getting Started"
            primaryAction={{
                content: 'Learn about getting started',
                onAction: () => {},
            }}
            description="Discover how Shopify can power up your entrepreneurial journey."
            popoverActions={[{content: 'Dismiss', onAction: () => {}}]}
            >
            <img
                alt=""
                width="100%"
                height="100%"
                style={{
                objectFit: 'cover',
                objectPosition: 'center',
                }}
                src="https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1850"
            />
            </MediaCard>
          </Modal.Section>
        </Modal>
      </Frame>
    </div>
                </Layout.Section>
            </Layout>
        </Page>
    )
}

export default CustomerForm;