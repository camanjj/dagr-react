import React, {Component} from 'react';
import Form from "react-jsonschema-form";
import {DateRangeField, IntRangeField} from './FormItems.js'
import $ from 'jquery';
import Modal from 'react-modal';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

export default class QueryView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      results: []
    }

    this.queryBackend = this.queryBackend.bind(this)
  }

  queryBackend(form) {
    console.log("Query")
      $.ajax({
      type: 'POST',
      dataType: 'json',
      contentType: "application/json",
      url: `${process.env.REACT_APP_URL}/dagr/query`,
      data: JSON.stringify(form.formData)
    })
      .then((data, status, xhr) => {
        console.log(data)
        this.setState({results: data, modalOpen: true})
    })
  }

  render() {

    const uiSchema = {created: {"ui:field": "geo"}, modified: {"ui:field": "geo"}, fileSize: {"ui:field": "intRange"}};
    const fields = {geo: DateRangeField, intRange: IntRangeField};
    const schema = {
      title: "Time Range Query",
      type: "object",
      required: [],
      properties: {
        created: {
          title: "Created",
          properties: {
            before: {type: "datetime"},
            after: {type: "datetime"}
          }
        },
        modified: {
          title: "Modified",
          properties: {
            before: {type: "datetime"},
            after: {type: "datetime"}
          }
        },
        author: {
          "type": "string",
          "title": "File Creator"
        },
        fileSize: {
          title: "File Size Range",
          type: 'object',
          properties: {
            low: {type: 'number'},
            high: {type: 'number'}
          }
        },
        fileType: {
          "type": "string",
          "title": "File Type"
        },
        
      }
    };

    const closeModal = () => this.setState({modalOpen: false})
    const formatPath = (cell, row) => {
      var prefix = row.path.lastIndexOf('http', 0) === 0 ? "" : "file:///"
      return <a href={prefix + row.path}> {cell} </a>
    }

    return (
      <div>
        <Form schema={schema}
          uiSchema={uiSchema}
          fields={fields}
          noValidate={true}
          onChange={(e) => console.log(e)}
          onSubmit={this.queryBackend}
          onError={console.log("errors")} />
  
        <Modal
          isOpen={this.state.modalOpen}
          contentLabel="Add Category"
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
    )
    
  }


}