import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import CategoryView from './CategoryView.js'
import InsertView from './InsertView.js'

export default () => (
  <Tabs>
    <TabList>
      <Tab>DAGRs</Tab>
      <Tab>Categories</Tab>
    </TabList>

    <TabPanel>
      <InsertView />
    </TabPanel>
    <TabPanel>
      <CategoryView />

    </TabPanel>
  </Tabs>
);