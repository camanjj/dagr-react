import React, {Component} from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import $ from 'jquery';
import { ProgressHUD, Wrapper } from "react-progress-hud";
import Modal from 'react-modal';

class InsertView extends Component {
  constructor () {
    super()
    this.state = {
      dagrs: [],
      selectedDagr: null,
      loading: true,
      results: [],
      modalOpen: false,
    }

    this.rowSelect = this.rowSelect.bind(this)
    this.reachablityQuery = this.reachablityQuery.bind(this)
    this.orphanQuery = this.orphanQuery.bind(this)
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

  rowSelect(row, isSelected, e) {
    this.setState({selectedDagr: row})
  }

  reachablityQuery() {
    if (this.state.selectedDagr === null) {
      alert('Need to select a DAGR')
    } else {
      // do the query
      $.ajax({
        type: 'POST',
        dataType: 'json',
        contentType: "application/json",
        url: `${process.env.REACT_APP_URL}/dagr/reach`,
        data: JSON.stringify({id: this.state.selectedDagr.id})
      }).then((data, status, xhr) => {
          this.setState({results: data, modalOpen: true})
      })
    }
  }

  orphanQuery() {
    $.getJSON(`${process.env.REACT_APP_URL}/dagr/orphans`)
      .then((data) => {
        this.setState({results: data, modalOpen: true});
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

    const closeModal = () => this.setState({modalOpen: false})
    const formatPath = (cell, row) => {
      var prefix = row.path.lastIndexOf('http', 0) === 0 ? "" : "file:///"
      return <a href={prefix + row.path}> {cell} </a>
    }

    const selectRowProp = {
      mode: 'radio',
      clickToSelect: true,
      onSelect: this.rowSelect
    };

    return (
      <div>
        
        <ProgressHUD
          isVisible={this.state.loading}
          overlayColor="rgba(0, 0, 0, 0.11)"
        />


        <h2>Dagrs</h2>
        <BootstrapTable data={this.state.dagrs} striped={true} selectRow={selectRowProp} hover pagination search>
          <TableHeaderColumn dataField="id" isKey hidden>Category Id</TableHeaderColumn>
          <TableHeaderColumn dataField="file_name">File Name</TableHeaderColumn>
          <TableHeaderColumn dataField="alias">Alias</TableHeaderColumn>
          <TableHeaderColumn dataField="path" dataFormat={formatPath} >File Path</TableHeaderColumn>
        </BootstrapTable>

        <div className="btn-group" role="group" aria-label="...">
        <button className='btn btn-primary' onClick={addCurrentTab}>Add current page to the database!</button>
        <button className='btn btn-success' onClick={this.reachablityQuery}>Reachability</button>
        <button className='btn btn-info' onClick={this.orphanQuery}>Orphaned and Sterile DAGRs</button>
        </div>

        <Modal
          isOpen={this.state.modalOpen}
          contentLabel="Results"
          onRequestClose={closeModal}
          shouldCloseOnOverlayClick={true}>
          <div className="">
                <h3>Results</h3>
                <BootstrapTable data={this.state.results} striped={true} hover pagination>
                  <TableHeaderColumn dataField="id" isKey hidden>Id</TableHeaderColumn>
                  <TableHeaderColumn dataField="file_alias">Alias</TableHeaderColumn>
                  <TableHeaderColumn dataField="file_name">File Name</TableHeaderColumn>
                  <TableHeaderColumn dataField="path" dataFormat={formatPath} >File Path</TableHeaderColumn>
                  <TableHeaderColumn dataField="creator" >Creator</TableHeaderColumn>
                  <TableHeaderColumn dataField="file_type" >File Type</TableHeaderColumn>
                  <TableHeaderColumn dataField="file_size" >File Size (Bytes)</TableHeaderColumn>
                  <TableHeaderColumn dataField="created" >Created</TableHeaderColumn>
                  <TableHeaderColumn dataField="modified" >Modified</TableHeaderColumn>
                </BootstrapTable>
              </div>
        </Modal>

      </div>
    );
  }
}

export default InsertView;