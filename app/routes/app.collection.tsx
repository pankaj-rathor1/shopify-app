import { LoaderFunction } from "@remix-run/node";
import { Card, Layout, List, Page } from "@shopify/polaris";
import { apiVersion, authenticate } from "../shopify.server";
import { useLoaderData } from "@remix-run/react";

export const query = `
{
    collections(first: 5) {
        edges {
            node {
                id
                title
                handle
                updatedAt
                productsCount
                sortOrder
            }
        },
        pageInfo{
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
    // const response = await fetch(`https://${shop}/admin/api/${apiVersion}/graphql.json`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/graphql",
    //     "X-Shopify-Access-Token": accessToken!,
    //   },
    //   body: query,
    // });

    if (response.ok) {
      const data = await response.json();

      if (data.errors) {
        throw new Error(`GraphQL Error: ${data.errors[0]?.message}`);
      }

      const {
        data: {
          collections: { edges },
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

export default function Collection() {
  const collections: any = useLoaderData();
  console.log(collections, "collections");

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card>
            <h1>Collection</h1>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card>
            {collections ? (
              <List type="bullet" gap="loose">
                {collections.map((edge: any) => {
                  const { node: collection } = edge;
                  return (
                    <List.Item key={collection.id}>
                      <h1>{collection.id}</h1>
                      <h1>{collection.title}</h1>
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
