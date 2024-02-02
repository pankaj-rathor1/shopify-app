import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Badge, BlockStack, Box, Card, EmptyState, Layout, Text } from "@shopify/polaris";
import { useState } from "react";
import { createCustomer } from "~/api/prisma.server"
import {IndexTableWithViewsSearchFilterSorting} from "../routes/component/grid";

interface customerData{
    name:string,
    age: number
}
const listData:any = () => {
    // return null;

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
    console.log(list);
    
    const orders:any = [
        {
          id: '1',
          customer: (
            <Text as="span" variant="bodyMd" fontWeight="semibold">
              #1040
            </Text>
          ),
          date: 'Jul 20 at 4:34pm',
          firstname: 'Pankaj',
          lastname: 'Rathor',
          total: '$969.44',
          paymentStatus: <Badge progress="complete">Paid</Badge>,
          fulfillmentStatus: <Badge progress="incomplete">Unfulfilled</Badge>,
        },
        {
          id: '2',
          customer: (
            <Text as="span" variant="bodyMd" fontWeight="semibold">
              #1019
            </Text>
          ),
          date: 'Jul 20 at 3:46pm',
          firstname: 'Pankaj',
          lastname: 'test1',
          total: '$701.19',
          paymentStatus: <Badge progress="partiallyComplete">Partially paid</Badge>,
          fulfillmentStatus: <Badge progress="incomplete">Unfulfilled</Badge>,
        },
      ];

    return (
        <Layout.Section>
            {IndexTableWithViewsSearchFilterSorting(orders)}
            {/* <Box paddingBlock="500" paddingInline="500" >
                <Card>
                {
                    list.map((value:any)=>(
                        <h4>{value.name}</h4> 
                    ))
                }
                </Card>
            </Box> */}
        </Layout.Section>
    );
}

export const loader:LoaderFunction = async () => {
    return null;
}

const CustomerList = () => {
    // const loaderData = useLoaderData();
    const [list, setList] = useState<any>({});
    const data = listData();
    // console.log(data);
    
    return (
        <Layout>
            {listData()?IsEmptyState(true):IsEmptyState(false)}
            {/* {createGridLayout(data)} */}
        </Layout> 
    );
}

export default CustomerList;