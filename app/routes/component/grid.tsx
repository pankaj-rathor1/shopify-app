import {
    TextField,
    IndexTable,
    Card,
    IndexFilters,
    useSetIndexFiltersMode,
    useIndexResourceState,
    Text,
    ChoiceList,
    RangeSlider,
    Badge,
    useBreakpoints,
    Link,
    Tag,
  } from '@shopify/polaris';
  import type {IndexFiltersProps, TabProps} from '@shopify/polaris';
import { url } from 'inspector';
  import {useState, useCallback} from 'react';
  
  export function IndexTableWithViewsSearchFilterSorting(customerData:any) {
    
    const customers:any = customerData;

    const sleep = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    const [itemStrings, setItemStrings] = useState([
      'All',
      'Available Point',
      'No Point',
      'Enable',
      'Disable',
    ]);
    const deleteView = (index: number) => {
      const newItemStrings = [...itemStrings];
      newItemStrings.splice(index, 1);
      setItemStrings(newItemStrings);
      setSelected(0);
    };
  
    const duplicateView = async (name: string) => {
      setItemStrings([...itemStrings, name]);
      setSelected(itemStrings.length);
      await sleep(1);
      return true;
    };
  
    const tabs: TabProps[] = itemStrings.map((item, index) => ({
      content: item,
      index,
      onAction: () => {},
      id: `${item}-${index}`,
      isLocked: index === 0,
      actions:
        index === 0
          ? []
          : [
              {
                type: 'rename',
                onAction: () => {},
                onPrimaryAction: async (value: string): Promise<boolean> => {
                  const newItemsStrings = tabs.map((item, idx) => {
                    if (idx === index) {
                      return value;
                    }
                    return item.content;
                  });
                  await sleep(1);
                  setItemStrings(newItemsStrings);
                  return true;
                },
              },
              {
                type: 'duplicate',
                onPrimaryAction: async (value: string): Promise<boolean> => {
                  await sleep(1);
                  duplicateView(value);
                  return true;
                },
              },
              {
                type: 'edit',
              },
              {
                type: 'delete',
                onPrimaryAction: async () => {
                  await sleep(1);
                  deleteView(index);
                  return true;
                },
              },
            ],
    }));
    const [selected, setSelected] = useState(0);
    const onCreateNewView = async (value: string) => {
      await sleep(500);
      setItemStrings([...itemStrings, value]);
      setSelected(itemStrings.length);
      return true;
    };
    const sortOptions: IndexFiltersProps['sortOptions'] = [
      {label: 'Order', value: 'customer asc', directionLabel: 'Ascending'},
      {label: 'Order', value: 'customer desc', directionLabel: 'Descending'},
      {label: 'Customer', value: 'customer asc', directionLabel: 'A-Z'},
      {label: 'Customer', value: 'customer desc', directionLabel: 'Z-A'},
      {label: 'Date', value: 'date asc', directionLabel: 'A-Z'},
      {label: 'Date', value: 'date desc', directionLabel: 'Z-A'},
      {label: 'Total', value: 'total asc', directionLabel: 'Ascending'},
      {label: 'Total', value: 'total desc', directionLabel: 'Descending'},
    ];
    const [sortSelected, setSortSelected] = useState(['customer asc']);
    const {mode, setMode} = useSetIndexFiltersMode();
    const onHandleCancel = () => {};
  
    const onHandleSave = async () => {
      await sleep(1);
      return true;
    };
  
    const primaryAction: IndexFiltersProps['primaryAction'] =
      selected === 0
        ? {
            type: 'save-as',
            onAction: onCreateNewView,
            disabled: false,
            loading: false,
          }
        : {
            type: 'save',
            onAction: onHandleSave,
            disabled: false,
            loading: false,
          };
    const [accountStatus, setAccountStatus] = useState<string[] | undefined>(
      undefined,
    );
    const [moneySpent, setMoneySpent] = useState<[number, number] | undefined>(
      undefined,
    );
    const [taggedWith, setTaggedWith] = useState('');
    const [queryValue, setQueryValue] = useState('');
  
    const handleAccountStatusChange = useCallback(
      (value: string[]) => setAccountStatus(value),
      [],
    );
    const handleMoneySpentChange = useCallback(
      (value: [number, number]) => setMoneySpent(value),
      [],
    );
    const handleTaggedWithChange = useCallback(
      (value: string) => setTaggedWith(value),
      [],
    );
    const handleFiltersQueryChange = useCallback(
      (value: string) => setQueryValue(value),
      [],
    );
    const handleAccountStatusRemove = useCallback(
      () => setAccountStatus(undefined),
      [],
    );
    const handleMoneySpentRemove = useCallback(
      () => setMoneySpent(undefined),
      [],
    );
    const handleTaggedWithRemove = useCallback(() => setTaggedWith(''), []);
    const handleQueryValueRemove = useCallback(() => setQueryValue(''), []);
    const handleFiltersClearAll = useCallback(() => {
      handleAccountStatusRemove();
      handleMoneySpentRemove();
      handleTaggedWithRemove();
      handleQueryValueRemove();
    }, [
      handleAccountStatusRemove,
      handleMoneySpentRemove,
      handleQueryValueRemove,
      handleTaggedWithRemove,
    ]);
  
    const filters = [
      {
        key: 'accountStatus',
        label: 'Account status',
        filter: (
          <ChoiceList
            title="Account status"
            titleHidden
            choices={[
              {label: 'Enabled', value: 'enabled'},
              {label: 'Not invited', value: 'not invited'},
              {label: 'Invited', value: 'invited'},
              {label: 'Declined', value: 'declined'},
            ]}
            selected={accountStatus || []}
            onChange={handleAccountStatusChange}
            allowMultiple
          />
        ),
        shortcut: true,
      },
      {
        key: 'taggedWith',
        label: 'Tagged with',
        filter: (
          <TextField
            label="Tagged with"
            value={taggedWith}
            onChange={handleTaggedWithChange}
            autoComplete="off"
            labelHidden
          />
        ),
        shortcut: true,
      },
      {
        key: 'moneySpent',
        label: 'Money spent',
        filter: (
          <RangeSlider
            label="Money spent is between"
            labelHidden
            value={moneySpent || [0, 500]}
            prefix="$"
            output
            min={0}
            max={2000}
            step={1}
            onChange={handleMoneySpentChange}
          />
        ),
      },
    ];
  
    const appliedFilters: IndexFiltersProps['appliedFilters'] = [];
    if (accountStatus && !isEmpty(accountStatus)) {
      const key = 'accountStatus';
      appliedFilters.push({
        key,
        label: disambiguateLabel(key, accountStatus),
        onRemove: handleAccountStatusRemove,
      });
    }
    if (moneySpent) {
      const key = 'moneySpent';
      appliedFilters.push({
        key,
        label: disambiguateLabel(key, moneySpent),
        onRemove: handleMoneySpentRemove,
      });
    }
    if (!isEmpty(taggedWith)) {
      const key = 'taggedWith';
      appliedFilters.push({
        key,
        label: disambiguateLabel(key, taggedWith),
        onRemove: handleTaggedWithRemove,
      });
    }
  
    const resourceName = {
      singular: 'customer',
      plural: 'customers',
    };
  
    const {selectedResources, allResourcesSelected, handleSelectionChange} =
      useIndexResourceState(customers);
  
    const rowMarkup = customers.map(
      (
        {id, date, customerName, loyaltyPoint, loyaltyStatus},
        index,
      ) => (
        <IndexTable.Row
          id={id}
          key={id}
          selected={selectedResources.includes(id)}
          position={index}
          disabled
        >
          <IndexTable.Cell>
          <Link
            url={'https://admin.shopify.com/store/test-webential-store/customers/7683519021377'}
            target={'_blank'}
          >
            <Text fontWeight="bold" as="span">
              {customerName}
            </Text>
          </Link>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <Text as="span" numeric>
              {loyaltyPoint}
            </Text>
          </IndexTable.Cell>
          <IndexTable.Cell>{loyaltyStatus}</IndexTable.Cell>
          <IndexTable.Cell>{date}</IndexTable.Cell>
        </IndexTable.Row>
      ),
    );
  
    return (
      <Card>
        <IndexFilters
          sortOptions={sortOptions}
          sortSelected={sortSelected}
          queryValue={queryValue}
          queryPlaceholder="Searching in all"
          onQueryChange={handleFiltersQueryChange}
          onQueryClear={() => setQueryValue('')}
          onSort={setSortSelected}
          primaryAction={primaryAction}
          cancelAction={{
            onAction: onHandleCancel,
            disabled: false,
            loading: false,
          }}
          tabs={tabs}
          selected={selected}
          onSelect={setSelected}
          canCreateNewView
          onCreateNewView={onCreateNewView}
          filters={filters}
          appliedFilters={appliedFilters}
          onClearAll={handleFiltersClearAll}
          mode={mode}
          setMode={setMode}
        />
        <IndexTable
          condensed={useBreakpoints().smDown}
          resourceName={resourceName}
          itemCount={customers.length}
          selectedItemsCount={
            allResourcesSelected ? 'All' : selectedResources.length
          }
          onSelectionChange={handleSelectionChange}
          headings={[
            {title: 'Customer Name'},
            {title: 'Loyalty Point'},
            {title: 'Loyalty status'},
            {title: 'Date'},
          ]}
        >
          {rowMarkup}
        </IndexTable>
      </Card>
    );
  
    function disambiguateLabel(key: string, value: string | any[]): string {
      switch (key) {
        case 'moneySpent':
          return `Money spent is between $${value[0]} and $${value[1]}`;
        case 'taggedWith':
          return `Tagged with ${value}`;
        case 'accountStatus':
          return (value as string[]).map((val) => `Customer ${val}`).join(', ');
        default:
          return value as string;
      }
    }
  
    function isEmpty(value: string | string[]): boolean {
      if (Array.isArray(value)) {
        return value.length === 0;
      } else {
        return value === '' || value == null;
      }
    }
  }
