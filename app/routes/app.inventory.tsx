import { LoaderFunction } from "@remix-run/node";
import { Card, Layout, List, Page } from "@shopify/polaris";
import { apiVersion, authenticate } from "../shopify.server";
import { useLoaderData } from "@remix-run/react";

export const query = `
{
    inventoryItems(first:5) {
      edges {
        node {
          id
          createdAt
          countryCodeOfOrigin
          sku
          updatedAt
          locationsCount
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

export const loader: LoaderFunction = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const { shop, accessToken } = session;

  try {
    const response = await fetch(`https://${shop}/admin/api/${apiVersion}/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/graphql",
        "X-Shopify-Access-Token": accessToken!,
      },
      body: query,
    });

    if (response.ok) {
      const data = await response.json();

      if (data.errors) {
        throw new Error(`GraphQL Error: ${data.errors[0]?.message}`);
      }

      const {
        data: {
            inventoryItems: { edges },
        },
      } = data;

      return edges;
    }

    throw new Error(`Failed to fetch data from Shopify. Status: ${response.status}`);
  } catch (err) {
    console.error(err);
    throw new Error("Error fetching data from Shopify");
  }
};

export default function Inventory() {
  const inventoryItems: any = useLoaderData();
  console.log(inventoryItems, "inventoryItems");

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card>
            <h1>Inventory</h1>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card>
            {inventoryItems ? (
              <List type="bullet" gap="loose">
                {inventoryItems.map((edge: any) => {
                  const { node: inventoryItem } = edge;
                  return (
                    <List.Item key={inventoryItem.id}>
                      <h1>{inventoryItem.id}</h1>
                    </List.Item>
                  );
                })}
              </List>
            ) : (
              <p>Loading...</p>
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
