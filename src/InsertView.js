import React, {Component} from 'react';
import Dropzone from 'react-dropzone'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import $ from 'jquery';
import { ProgressHUD, Wrapper } from "react-progress-hud";


class InsertView extends Component {
  constructor () {
    super()
    this.state = {
      dagrs: [],
      loading: true
    }
  }

  componentDidMount() {
    this.DagrList()
  }

  DagrList() {
        return $.getJSON(`${process.env.REACT_APP_URL}/dagr`)
      .then((data) => {
        console.log(data)
        this.setState({ dagrs: data, loading: false });
      });
  }

  render() {

    const onDrop = (acceptedFiles, rejectedFiles) => {
      console.log(acceptedFiles)
    }

    const addCurrentTab = () => {
      window.chrome.tabs.query({
          'active': true,
          'lastFocusedWindow': true
        }, function (tabs) {
          var url = tabs[0].url;
          $.getJSON(`${process.env.REACT_APP_URL}/dagr/link?url=${encodeURIComponent(url)}`).then((data) => {
            console.log(data)
          })

          console.log(url);
        })
    }

    return (
      <div>
        
        <ProgressHUD
          isVisible={this.state.loading}
          overlayColor="rgba(0, 0, 0, 0.11)"
        />


        <h2>Dagrs</h2>
        <BootstrapTable data={this.state.dagrs} striped={true} hover pagination search>
          <TableHeaderColumn dataField="id" isKey hidden>Category Id</TableHeaderColumn>
          <TableHeaderColumn dataField="file_name">File Name</TableHeaderColumn>
          <TableHeaderColumn dataField="file_alias">Alias</TableHeaderColumn>
          <TableHeaderColumn dataField="file_path">File Path</TableHeaderColumn>
        </BootstrapTable>

        <button className='btn btn-primary' onClick={addCurrentTab}>
          Add current page to the database!
        </button>

      </div>
    );
  }
}

export default InsertView;