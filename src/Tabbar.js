import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import CategoryView from './CategoryView.js'
import InsertView from './InsertView.js'
import QueryView from './QueryView.js'
import WelcomeView from './WelcomeView.js'

export default () => (
  <Tabs>
    <TabList>
      <Tab>Welcome</Tab>
      <Tab>DAGRs</Tab>
      <Tab>Categories</Tab>
      <Tab>Queries</Tab>
    </TabList>

    
    <TabPanel>
      <WelcomeView />
    </TabPanel>
    <TabPanel>
      <InsertView />
    </TabPanel>
    <TabPanel>
      <CategoryView />
    </TabPanel>
    <TabPanel>
      <QueryView />
    </TabPanel>
  </Tabs>
);