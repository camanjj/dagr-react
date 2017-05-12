import React, { Component } from 'react';

class WelcomeView extends Component {
  render() {
    return (
      <div>
        <p>Welcome!</p>
        <p>
          This plugin is used to help aid in viewing and modifying the MMDA database for the CMSC424 Project.
          In this plugin you can view, assign categories and insert DAGRs via url. You can also create categories and subcategories.
          You can also search DAGRs based on queries.
        </p>
      </div>
    );
  }
}

export default WelcomeView;