import { LoaderFunction } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { Badge, BlockStack, Box, Card, EmptyState, Layout, Text } from "@shopify/polaris";
import { useState } from "react";
import { createCustomer } from "~/api/prisma.server"
import {IndexTableWithViewsSearchFilterSorting} from "../routes/component/grid";
import { authenticate, apiVersion } from "~/shopify.server";

const customersList:any = () => {
    

    return [{name:'Pakaj', age: 20},{name:'Pakaj', age: 20}];
}

const IsEmptyState = (isEmpty: boolean) => {
    if (isEmpty) {
        return (
            <Layout.Section>
                <Box paddingBlock="500" paddingInline="500" >
                    <Card>
                        <EmptyState
                            heading="Manage Customers Account"
                            action={{content: 'Create Customer', url: '../createcustomer'}}
                            secondaryAction={{
                            content: 'Learn more',
                                url: '../faq',
                            }}
                            fullWidth
                            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                        >
                            <p>Manage Loyalty Discount of Customers.</p>
                        </EmptyState>
                    </Card>
                </Box>
            </Layout.Section>
        );
    }
}

const createGridLayout = (list:any) => {
    // console.log(list);
    
    const customers:any = [
        {
          id: '1',
          date: 'Jul 20 at 4:34pm',
          customerName: 'Pankaj Rathor',
          loyaltyPoint: '$969.44',
          loyaltyStatus: <Badge tone="success">Enable</Badge>,
        },
        {
          id: '2',
          customerName: 'Pankaj test1',
          loyaltyPoint: '$701.19',
          loyaltyStatus: <Badge tone="info">Disable</Badge>,
          date: 'Jul 20 at 3:46pm'
        },
      ];

    if (customers?.length == 0) return IsEmptyState(true)

    return (
        <Layout.Section>
            <Box paddingBlock="500" paddingInline="500" >
                {IndexTableWithViewsSearchFilterSorting(customers)}
            </Box>
        </Layout.Section>
    );
}

export const query = `
{
  customers(first: 10) {
    edges {
      node {
        id
        displayName
        email
        phone
        state
        updatedAt
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}
`;

export const loader: LoaderFunction = async ({ request }) => {
  
  return json({message: `Customer Save Name`});
  try {
    const { admin } = await authenticate.admin(request);
    
    const response = await admin.graphql(
      `#graphql

      `);
      const data = await response.json();
      // return json(data);
      if (response.ok) {
          return json({message: `Customer Saved Name:`});
        }
      
    } catch (error:any) {
      return json({error:error},{ status: 500 });
    }
    
    return null;
  };

const CustomerList = () => {
    const loaderData = useLoaderData();
    console.log(loaderData);

    const [list, setList] = useState<any>({});
    const data = customersList();
    // console.log(data);
    
    return (
        <Layout>
            {createGridLayout(data)}
        </Layout> 
    );
}

export default CustomerList;